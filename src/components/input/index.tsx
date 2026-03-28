"use client";

import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function Input({ label, error, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                {...props}
                className={`border rounded-lg px-3 py-2 outline-none transition
                    focus:ring-2 focus:ring-blue-500
                    ${error ? "border-red-500" : "border-gray-300"}
                `}
            />

            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}
