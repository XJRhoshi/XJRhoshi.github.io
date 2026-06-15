export type PostCategory = string | string[] | null | undefined;

export function normalizeCategories(category: PostCategory): string[] {
	if (!category) {
		return [];
	}
	if (Array.isArray(category)) {
		return category.map((c) => String(c).trim()).filter(Boolean);
	}
	if (typeof category === "object") {
		return Object.values(category as Record<string, unknown>)
			.map((c) => String(c).trim())
			.filter(Boolean);
	}
	const trimmed = String(category).trim();
	return trimmed ? [trimmed] : [];
}

export function hasAnyCategory(
	category: PostCategory,
	names: string[],
): boolean {
	const cats = normalizeCategories(category);
	return cats.some((c) => names.includes(c));
}

export function categoriesShareMatch(
	a: PostCategory,
	b: PostCategory,
): boolean {
	const catsA = normalizeCategories(a);
	const catsB = normalizeCategories(b);
	return catsA.some((c) => catsB.includes(c));
}

export function getPrimaryCategory(
	category: PostCategory,
): string | undefined {
	return normalizeCategories(category)[0];
}
