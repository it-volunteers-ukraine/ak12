import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/uk/management-console-12ak/", "/en/management-console-12ak/", "/uk/login/", "/en/login/"],
    },
  };
}
