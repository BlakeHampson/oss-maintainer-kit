import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "out",
  "coverage",
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
  const pattern = /!?\[[^\]]*]\(([^)]+)\)/g;

  for (const match of markdown.matchAll(pattern)) {
    links.push({
      line: countLineAtIndex(markdown, match.index ?? 0),
      target: match[1],
    });
  }

  return links;
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
