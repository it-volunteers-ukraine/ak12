"use client";

import { ComponentPropsWithoutRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { cn } from "@/utils";
import { FORM_RADIO_BUTTON } from "./t";
import { Locale } from "@/types";

function getNestedError(errors: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], errors);
}

const INPUT_CLASS =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none";

interface FormRadioButtonProp extends ComponentPropsWithoutRef<"div"> {
  name: string;
  locale: Locale;
}

export const FormRadioButton = ({ name, className, locale }: FormRadioButtonProp) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const t = FORM_RADIO_BUTTON[locale];

  const handleAdd = () => {
    append({ label: "" });

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
          <RadioButtonItem
            key={field.id}
            name={name}
            index={index}
            t={t}
            isRemovable={fields.length > 1}
            onRemove={() => remove(index)}
          />
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

interface RadioButtonItemProps {
  name: string;
  index: number;
  t: any;
  isRemovable: boolean;
  onRemove: () => void;
}

const RadioButtonItem = ({ name, index, t, isRemovable, onRemove }: RadioButtonItemProps) => {
  const { register, formState } = useFormContext();

  const arrayErrors = getNestedError(formState.errors, name);
  const labelError = getNestedError(arrayErrors, `${index}.label`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 max-w-sm">
        <label className="mb-2 block text-sm font-medium">{t.titleButton}</label>
        <input {...register(`${name}.${index}.label`)} className={INPUT_CLASS} />
        {labelError?.message && <p className="mt-1 text-xs text-red-600">{String(labelError.message)}</p>}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">{t.item.replace("{index}", String(index + 1))}</p>
        <button
          type="button"
          disabled={!isRemovable}
          onClick={onRemove}
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-medium transition",
            !isRemovable
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
          )}
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
};
