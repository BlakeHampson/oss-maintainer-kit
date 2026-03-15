import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "out",
  "coverage",
  ".venv",
  "venv",
  "env",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".tox",
  ".next",
  ".turbo",
  ".cache",
]);

function countLineAtIndex(content, index) {
  return content.slice(0, index).split("\n").length;
}

function normalizeLinkTarget(target) {
  const trimmed = target.trim();

  if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function splitLinkTarget(target) {
  const normalized = normalizeLinkTarget(target);
  const hashIndex = normalized.indexOf("#");

  if (hashIndex === -1) {
    return {
      anchor: "",
      pathPart: normalized,
    };
  }

  return {
    anchor: decodeURIComponent(normalized.slice(hashIndex + 1)),
    pathPart: normalized.slice(0, hashIndex),
  };
}

function isExternalTarget(target) {
  return /^(?:[a-z]+:)?\/\//i.test(target) || /^(mailto|tel|data):/i.test(target);
}

export function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&amp;/g, "and")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function collectAnchors(markdown) {
  const anchors = new Set();
  const duplicates = new Map();
  const headingPattern = /^#{1,6}\s+(.+)$/gm;

  for (const match of markdown.matchAll(headingPattern)) {
    const heading = match[1].trim();
    const baseSlug = slugifyHeading(heading);

    if (!baseSlug) {
      continue;
    }

    const currentCount = duplicates.get(baseSlug) ?? 0;
    duplicates.set(baseSlug, currentCount + 1);
    anchors.add(currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount}`);
  }

  return anchors;
}

export function collectMarkdownLinks(markdown) {
  const links = [];
  const pattern = /!?\[[^\]]*]\(/g;
  let match;

  while ((match = pattern.exec(markdown)) !== null) {
    const openParenIndex = (match.index ?? 0) + match[0].length - 1;
    const parsed = readInlineLink(markdown, openParenIndex);

    if (!parsed) {
      continue;
    }

    links.push({
      line: countLineAtIndex(markdown, match.index ?? 0),
      target: parsed.target,
    });
  }

  return links;
}

function extractInlineLinkTarget(rawTarget) {
  const trimmed = rawTarget.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("<")) {
    const closingIndex = trimmed.indexOf(">");
    return closingIndex === -1 ? trimmed : trimmed.slice(1, closingIndex);
  }

  let depth = 0;
  let escaped = false;
  let target = "";

  for (const character of trimmed) {
    if (escaped) {
      target += character;
      escaped = false;
      continue;
    }

    if (character === "\\") {
      target += character;
      escaped = true;
      continue;
    }

    if (/\s/.test(character) && depth === 0) {
      break;
    }

    if (character === "(") {
      depth += 1;
    } else if (character === ")" && depth > 0) {
      depth -= 1;
    }

    target += character;
  }

  return target;
}

function readInlineLink(markdown, openParenIndex) {
  let depth = 0;
  let escaped = false;
  let inAngle = false;
  let quote = null;
  let rawTarget = "";

  for (let index = openParenIndex + 1; index < markdown.length; index += 1) {
    const character = markdown[index];

    if (escaped) {
      rawTarget += character;
      escaped = false;
      continue;
    }

    if (character === "\\") {
      rawTarget += character;
      escaped = true;
      continue;
    }

    if (quote !== null) {
      rawTarget += character;
      if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (inAngle) {
      rawTarget += character;
      if (character === ">") {
        inAngle = false;
      }
      continue;
    }

    if (character === "<" && rawTarget.trim() === "") {
      rawTarget += character;
      inAngle = true;
      continue;
    }

    if (character === "\"" || character === "'") {
      rawTarget += character;
      quote = character;
      continue;
    }

    if (character === "(") {
      rawTarget += character;
      depth += 1;
      continue;
    }

    if (character === ")") {
      if (depth === 0) {
        return {
          target: extractInlineLinkTarget(rawTarget),
        };
      }

      rawTarget += character;
      depth -= 1;
      continue;
    }

    rawTarget += character;
  }

  return null;
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name)) {
          continue;
        }

        await walk(path.join(currentDir, entry.name));
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(path.join(currentDir, entry.name));
      }
    }
  }

  await walk(rootDir);
  return files;
}

async function resolveMarkdownTarget(baseFile, target) {
  const decoded = decodeURIComponent(target);
  const absolute = path.resolve(path.dirname(baseFile), decoded);

  if (await pathExists(absolute)) {
    return absolute;
  }

  const readmeCandidate = path.join(absolute, "README.md");
  if (await pathExists(readmeCandidate)) {
    return readmeCandidate;
  }

  return absolute;
}

export async function checkDocs({ rootDir }) {
  const markdownFiles = await collectMarkdownFiles(rootDir);
  const cache = new Map();
  const issues = [];

  async function getMarkdown(targetPath) {
    if (!cache.has(targetPath)) {
      cache.set(
        targetPath,
        readFile(targetPath, "utf8").then((content) => ({
          anchors: collectAnchors(content),
          content,
        })),
      );
    }

    return cache.get(targetPath);
  }

  for (const filePath of markdownFiles) {
    const markdown = await readFile(filePath, "utf8");
    const localAnchors = collectAnchors(markdown);
    const links = collectMarkdownLinks(markdown);

    for (const link of links) {
      const rawTarget = normalizeLinkTarget(link.target);

      if (!rawTarget || isExternalTarget(rawTarget)) {
        continue;
      }

      if (rawTarget.startsWith("#")) {
        const anchor = decodeURIComponent(rawTarget.slice(1));
        if (!localAnchors.has(anchor)) {
          issues.push({
            code: "missing-anchor",
            filePath,
            line: link.line,
            message: `Anchor "#${anchor}" does not exist in this file.`,
          });
        }
        continue;
      }

      const { anchor, pathPart } = splitLinkTarget(rawTarget);
      const targetPath = await resolveMarkdownTarget(filePath, pathPart);

      if (!(await pathExists(targetPath))) {
        issues.push({
          code: "missing-file",
          filePath,
          line: link.line,
          message: `Linked path "${pathPart}" does not exist.`,
        });
        continue;
      }

      if (anchor && targetPath.endsWith(".md")) {
        const targetMarkdown = await getMarkdown(targetPath);
        if (!targetMarkdown.anchors.has(anchor)) {
          issues.push({
            code: "missing-target-anchor",
            filePath,
            line: link.line,
            message: `Anchor "#${anchor}" does not exist in "${path.relative(rootDir, targetPath)}".`,
          });
        }
      }
    }
  }

  return {
    filesChecked: markdownFiles.length,
    issues,
    rootDir,
  };
}
