import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://recurio-gg.vercel.app",
      lastModified: new Date(),
      alternates: {
        languages: {
          bg: "https://recurio-gg.vercel.app/bg",
          en: "https://recurio-gg.vercel.app/en",
        },
      },
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://recurio-gg.vercel.app/privacy-policy",
      lastModified: new Date(),
      alternates: {
        languages: {
          bg: "https://recurio-gg.vercel.app/bg/privacy-policy",
          en: "https://recurio-gg.vercel.app/en/privacy-policy",
        },
      },
      changeFrequency: "yearly",
      priority: 0.75,
    },
    {
      url: "https://recurio-gg.vercel.app/terms-of-use",
      lastModified: new Date(),
      alternates: {
        languages: {
          bg: "https://recurio-gg.vercel.app/bg/terms-of-use",
          en: "https://recurio-gg.vercel.app/en/terms-of-use",
        },
      },
      changeFrequency: "yearly",
      priority: 0.75,
    },
  ];
}
