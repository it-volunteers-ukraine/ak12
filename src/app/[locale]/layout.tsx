import { ReactNode } from "react";

import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import localeFont from "next/font/local";

import { WidthToast } from "./with-toast";

import "@/styles/globals.css";

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

const roadUI = localeFont({
  src: [
    { path: "../../fonts/road_ui/RoadUI-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/road_ui/RoadUI-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/road_ui/RoadUI-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/road_ui/RoadUI-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-road-ui",
});

const ermilov = localeFont({
  src: [{ path: "../../fonts/ermilov/Ermilov-bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-ermilov",
});

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${roadUI.variable} ${ermilov.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WidthToast>{children}</WidthToast>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
