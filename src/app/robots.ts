import type { MetadataRoute } from "next";

import { routes } from "@/constants/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`/uk${routes.admin.home}/`, `/en${routes.admin.home}/`, "/uk/login/", "/en/login/"],
    },
  };
}
