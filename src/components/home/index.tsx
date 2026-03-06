"use client";

import { useTranslations } from "next-intl";

export const HomePage = ({}) => {
    const t = useTranslations("");
    return (
        <div className="p-4 flex flex-col gap-4 ">
            <p className="text-3xl">{t("test")}</p>
        </div>
    );
};
