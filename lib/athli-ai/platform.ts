/**
 * Athli AI — Platform Knowledge Base
 */

import { prisma } from "@/lib/prisma";
import type { Language } from "@prisma/client";

export interface PlatformInfoParams {
  category?: string;
  search?: string;
}

export async function getPlatformInfo(
  params: PlatformInfoParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.category) {
    where.category = params.category;
  }

  // Try to find content in the user's language first, fallback to Portuguese
  const articles = await prisma.platformKnowledge.findMany({
    where: {
      ...where,
      language: lang,
    },
    orderBy: [{ priority: "desc" }, { category: "asc" }],
  });

  // If no results in user's language, fall back to Portuguese
  const results =
    articles.length > 0
      ? articles
      : await prisma.platformKnowledge.findMany({
          where: {
            ...where,
            language: "pt",
          },
          orderBy: [{ priority: "desc" }, { category: "asc" }],
        });

  if (results.length === 0) {
    return "No platform information found for this query.";
  }

  // If search term provided, filter by content/title match
  let filtered = results;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = results.filter(
      (r) =>
        r.title.toLowerCase().includes(searchLower) ||
        r.content.toLowerCase().includes(searchLower) ||
        r.category.toLowerCase().includes(searchLower)
    );
    if (filtered.length === 0) {
      // If no search match, return all results for the category
      filtered = results;
    }
  }

  return filtered
    .map((article) => `## ${article.title}\n\n${article.content}`)
    .join("\n\n---\n\n");
}
