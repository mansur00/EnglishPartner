import { MetadataRoute } from "next";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SHOPPING_MONEY_LADDER_STEPS } from "@/content/seed/niche_shopping_money";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://englishpartner.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/dashboard",
    "/vocabulary",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const scenarioRoutes: MetadataRoute.Sitemap = SEED_SCENARIOS.map((scenario) => ({
    url: `${baseUrl}/conversations/${scenario.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const ladderRoutes: MetadataRoute.Sitemap = SHOPPING_MONEY_LADDER_STEPS.map((step) => ({
    url: `${baseUrl}/conversations/${step.stepSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...scenarioRoutes, ...ladderRoutes];
}

