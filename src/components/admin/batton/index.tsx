"use client";

import { Locale } from "@/types";

export const RestoreButton = ({ locale }: { locale: Locale }) => {
    return (
        <button
            onClick={() => console.log(locale)}
            className="px-4 py-2 bg-green-600 text-white rounded"
        >
            сабміт
        </button>
    );
};
