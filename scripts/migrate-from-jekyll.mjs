/**
 * One-time migration: Jekyll `_posts`-style Markdown (migration-input/*.md)
 * → Mizuki `src/content/posts/*.md`
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(new URL(import.meta.url))), "..");
const INPUT = path.join(ROOT, "migration-input");
const OUT = path.join(ROOT, "src", "content", "posts");

function parseFrontmatter(block) {
	const data = {};
	const lines = block.split(/\r?\n/);
	function cleanScalar(s) {
		return s
			.replace(/\u00A0/g, " ")
			.replace(/#.*$/, "")
			.trim();
	}
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (/^\s*#/.test(line)) continue;
		const km = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
		if (!km || /^[\t ]/.test(line)) continue;

		const k = km[1];
		let rest = cleanScalar(km[2] ?? "");
		const next = lines[i + 1];

		if (next && /^\s+-\s+/.test(next) && rest === "") {
			const arr = [];
			i++;
			while (i < lines.length && /^\s+-\s+(.+)$/.test(lines[i])) {
				arr.push(lines[i].replace(/^\s+-\s+/, "").trim());
				i++;
			}
			i--;
			data[k] = arr;
		} else {
			data[k] = rest;
		}
	}
	return data;
}

function splitFile(content, basename) {
	const trimmed = content.replace(/^\ufeff/, "");
	const m = /^---\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/m.exec(trimmed);
	if (m) return { fm: parseFrontmatter(m[1]), body: m[2] };

	const dateM = basename.match(/^(\d{4}-\d{2}-\d{2})/);
	const date = dateM ? dateM[1] : "2025-01-01";
	const titleGuess = basename
		.replace(/^\d{4}-\d{2}-\d{2}-/, "")
		.replace(/\.md$/u, "");
	return {
		fm: { title: titleGuess, date, tags: [], subtitle: titleGuess },
		body: trimmed,
	};
}

function deriveDate(data, basename) {
	const d = (data.date || "").trim();
	if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
	const fromName = basename.match(/^(\d{4}-\d{2}-\d{2})/);
	if (fromName) return fromName[1];
	throw new Error(`No publish date for ${basename}`);
}

function normalizeImage(headerImg) {
	if (!headerImg) return "";
	const s = headerImg.trim();
	if (s.startsWith("http://") || s.startsWith("https://")) return s;
	if (s.startsWith("/")) return s;
	return `/${s.replace(/^\/+/, "")}`;
}

function emitYaml(post) {
	const lines = [
		`title: "${post.title.replace(/"/g, '\\"')}"`,
		`published: ${post.published}`,
		`description: "${post.description.replace(/"/g, '\\"')}"`,
		post.image ? `image: "${post.image.replace(/"/g, '\\"')}"` : "",
		`draft: ${post.draft}`,
		post.author ? `author: "${post.author.replace(/"/g, '\\"')}"` : "",
		post.tags?.length ? `tags: ${JSON.stringify(post.tags)}` : "tags: []",
		post.category ? `category: "${post.category.replace(/"/g, '\\"')}"` : `category: "随笔"`,
		`comment: true`,
		`pinned: false`,
		"lang: \"\"",
	]
		.filter(Boolean)
		.join("\n");
	return `---\n${lines}\n---\n\n`;
}

async function main() {
	const files = (await fs.readdir(INPUT)).filter((f) => f.endsWith(".md"));
	if (!files.length) {
		console.warn("migration-input/*.md empty; skip migration.");
		return;
	}
	await fs.mkdir(OUT, { recursive: true });
	for (const name of files) {
		const raw = await fs.readFile(path.join(INPUT, name), "utf8");
		const { fm, body } = splitFile(raw, name);
		const title = (fm.title || "").trim() || path.basename(name, ".md");
		const published = deriveDate(fm, name);
		const description = (
			fm.subtitle ||
			fm.description ||
			title
		).trim();

		let tags = fm.tags;
		if (!tags) tags = [];
		if (typeof tags === "string") {
			try {
				tags = JSON.parse(tags.replace(/'/g, '"'));
			} catch {
				tags = tags.split(",").map((t) => t.trim());
			}
		}
		if (!Array.isArray(tags)) tags = [];

		const category =
			typeof fm.categories === "string" && fm.categories.trim()
				? fm.categories.trim()
				: tags[0] || "随笔";

		const draft = String(fm.draft || "")
			.toLowerCase()
			.trim()
			.replace(/^["']|["']$/g, "") === "true";

		const image = fm["header-img"] ? normalizeImage(fm["header-img"]) : "";

		const outName = path.basename(name, ".md") + ".md";
		const content =
			emitYaml({
				title,
				published,
				description,
				image,
				tags,
				category,
				draft,
				author: (fm.author || "").trim(),
			}) + body.trimStart();

		await fs.writeFile(path.join(OUT, outName), content, "utf8");
		console.log(`Migrated → ${outName}`);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
