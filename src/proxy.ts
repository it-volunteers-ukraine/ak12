import createMiddleware from "next-intl/middleware";

import { locales } from "./constants";

export default createMiddleware({
    locales,
    defaultLocale: "uk",
    localePrefix: "always",
});

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
