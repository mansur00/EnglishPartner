import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EnglishPartner — English Learning Platform",
    short_name: "EnglishPartner",
    description:
      "Learn English through realistic, context-driven conversations with bilingual Bengali guidance.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FAF7FD",
    theme_color: "#4A1D6E",
    icons: [
      {
        src: "/globe.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
