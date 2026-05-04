"use client";

import { ComponentPropsWithoutRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { SOCIAL_LINKS_LABELS } from "./t";
import { SocialPlatform } from "@/constants";

function getNestedError(errors: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], errors);
}

const INPUT_CLASS =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none";

interface SocialLinksFieldProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
}

export const SocialLinksField = ({ name, className }: SocialLinksFieldProps) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const locale = name.split(".")[0] === "en" ? "en" : "uk";
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
          <SocialLinkItem key={field.id} name={name} index={index} t={t} onRemove={() => remove(index)} />
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

interface SocialLinkItemProps {
  t: any;
  name: string;
  index: number;
  onRemove: () => void;
}

const SocialLinkItem = ({ name, index, t, onRemove }: SocialLinkItemProps) => {
  const { register, formState } = useFormContext();

  const arrayErrors = getNestedError(formState.errors, name);
  const platformError = getNestedError(arrayErrors, `${index}.platform`);
  const hrefError = getNestedError(arrayErrors, `${index}.href`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[250px_1fr]">
        <div>
          <label className="mb-2 block text-sm font-medium">{t.platform}</label>
          <select {...register(`${name}.${index}.platform`)} className={`${INPUT_CLASS} uppercase`}>
            <option value="" disabled hidden>
              {t.selectPlaceholder}
            </option>
            {Object.values(SocialPlatform).map((platform) => (
              <option className="uppercase" key={platform} value={platform}>
                {platform === SocialPlatform.OTHER ? t.platformOther : platform}
              </option>
            ))}
          </select>
          {platformError?.message && <p className="mt-1 text-xs text-red-600">{String(platformError.message)}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t.link}</label>
          <input {...register(`${name}.${index}.href`)} className={INPUT_CLASS} placeholder="https://" />
          {hrefError?.message && <p className="mt-1 text-xs text-red-600">{String(hrefError.message)}</p>}
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
