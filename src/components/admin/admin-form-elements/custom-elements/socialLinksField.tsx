"use client";

import { ComponentPropsWithoutRef } from "react";

import { useFieldArray, useFormContext } from "react-hook-form";

import { Locale } from "@/types";
import { SocialPlatform } from "@/constants";
import { FormField, FormSelect } from "@/components/form-elements";

import { SOCIAL_LINKS_LABELS } from "./t";

interface SocialLinksFieldProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  locale: Locale;
}
interface SocialLinkItemProps {
  name: string;
  index: number;
  locale: Locale;
  onRemove: () => void;
}

export const SocialLinksField = ({ name, className, locale }: SocialLinksFieldProps) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const t = SOCIAL_LINKS_LABELS[locale];

  const handleAdd = () => {
    append({ platform: "", href: "" });

    setTimeout(() => trigger(name), 0);
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <p className="text-sm font-medium">{t.title}</p>
        <p className="text-xs text-gray-500">{t.description}</p>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
          {t.emptyState}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <SocialLinkItem key={field.id} name={name} index={index} locale={locale} onRemove={() => remove(index)} />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {t.add}
      </button>
    </div>
  );
};

const SocialLinkItem = ({ name, index, locale, onRemove }: SocialLinkItemProps) => {
  const t = SOCIAL_LINKS_LABELS[locale];

  const option = [
    { label: t.selectPlaceholder, value: "" },
    ...Object.values(SocialPlatform).map((item) => {
      if (item === "other") {
        return { label: t.platformOther, value: item };
      }

      return { label: item, value: item };
    }),
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[250px_1fr]">
        <div>
          <FormSelect label={t.platform} name={`${name}.${index}.platform`} options={option} />
        </div>

        <div>
          <FormField name={`${name}.${index}.href`} label={t.link} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">{t.item.replace("{index}", String(index + 1))}</p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
};
