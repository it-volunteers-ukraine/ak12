"use client";

import { ComponentPropsWithoutRef, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

import { CONTACTS_LABELS } from "./t";
import { ContactsType } from "@/constants";
import { Locale } from "@/types";
import { FormField, FormSelect } from "@/components/form-elements";

interface ContactsFieldProp extends ComponentPropsWithoutRef<"div"> {
  name: string;
  locale: Locale;
}

export const ContactsField = ({ name, className, locale }: ContactsFieldProp) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const t = CONTACTS_LABELS[locale];

  const handleAdd = () => {
    append({ type: "", href: "", label: "", textHref: "" });

    setTimeout(() => trigger(name), 0);
  };

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{t.title}</p>
          <p className="text-xs text-gray-500">{t.description}</p>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
          {t.emptyState}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <ContactItem key={field.id} name={name} index={index} t={t} onRemove={() => remove(index)} />
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

interface ContactItemProps {
  t: any;
  name: string;
  index: number;
  onRemove: () => void;
}

const ContactItem = ({ name, index, t, onRemove }: ContactItemProps) => {
  const { setValue, control } = useFormContext();

  const currentType = useWatch({
    control,
    name: `${name}.${index}.type`,
  });

  const currentHrefText = useWatch({
    control,
    name: `${name}.${index}.textHref`,
  });

  const [oldHrefText, setOldHrefText] = useState(currentHrefText);

  const isContactType = currentType === ContactsType.PHONE || currentType === ContactsType.EMAIL;

  const option = [
    { label: t.selectPlaceholder, value: "" },
    ...Object.values(ContactsType).map((item) => {
      if (item === "other") {
        return { label: t.typeOther, value: item };
      }

      return { label: item, value: item };
    }),
  ];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;

    if (currentHrefText !== "contact") {
      setOldHrefText(currentHrefText);
    }

    if (newType === ContactsType.PHONE || newType === ContactsType.EMAIL) {
      setValue(`${name}.${index}.textHref`, "contact", { shouldValidate: true });
    } else {
      setValue(`${name}.${index}.textHref`, oldHrefText !== "contact" ? oldHrefText : "", { shouldValidate: true });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[250px_1fr]">
        <FormSelect label={t.type} name={`${name}.${index}.type`} options={option} onChange={handleTypeChange} />

        <FormField name={`${name}.${index}.label`} label={t.titleContact} />
        <FormField name={`${name}.${index}.href`} label={t.link} />
        {!isContactType && <FormField name={`${name}.${index}.textHref`} label={t.textLink} />}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
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
