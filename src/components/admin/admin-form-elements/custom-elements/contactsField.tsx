"use client";

import { ComponentPropsWithoutRef } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

import { CONTACTS_LABELS } from "./t";
import { ContactsType } from "@/constants";

function getNestedError(errors: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], errors);
}

const INPUT_CLASS =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none";

interface ContactsFieldProp extends ComponentPropsWithoutRef<"div"> {
  name: string;
}

export const ContactsField = ({ name, className }: ContactsFieldProp) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const locale = name.split(".")[0] === "en" ? "en" : "uk";
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
  const { register, formState, setValue, control } = useFormContext();

  const currentType = useWatch({
    control,
    name: `${name}.${index}.type`,
  });

  const arrayErrors = getNestedError(formState.errors, name);
  const typeError = getNestedError(arrayErrors, `${index}.type`);
  const hrefError = getNestedError(arrayErrors, `${index}.href`);
  const labelError = getNestedError(arrayErrors, `${index}.label`);
  const textHrefError = getNestedError(arrayErrors, `${index}.textHref`);

  const typeField = register(`${name}.${index}.type`);
  const isContactType = currentType === ContactsType.PHONE || currentType === ContactsType.EMAIL;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    typeField.onChange(e);

    const newType = e.target.value;

    if (newType === ContactsType.PHONE || newType === ContactsType.EMAIL) {
      setValue(`${name}.${index}.textHref`, "contact", { shouldValidate: true });
    } else {
      setValue(`${name}.${index}.textHref`, "", { shouldValidate: true });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[250px_1fr]">
        <div>
          <label className="mb-2 block text-sm font-medium">{t.type}</label>
          <select {...typeField} onChange={handleTypeChange} className={`${INPUT_CLASS} uppercase`}>
            <option value="" disabled hidden>
              {t.selectPlaceholder}
            </option>
            {Object.values(ContactsType).map((type) => (
              <option className="uppercase" key={type} value={type}>
                {type === ContactsType.OTHER ? t.typeOther : type}
              </option>
            ))}
          </select>
          {typeError?.message && <p className="mt-1 text-xs text-red-600">{String(typeError.message)}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t.titleContact}</label>
          <input {...register(`${name}.${index}.label`)} className={INPUT_CLASS} />
          {labelError?.message && <p className="mt-1 text-xs text-red-600">{String(labelError.message)}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t.link}</label>
          <input
            {...register(`${name}.${index}.href`)}
            className={INPUT_CLASS}
            placeholder={isContactType ? "" : "https://"}
          />
          {hrefError?.message && <p className="mt-1 text-xs text-red-600">{String(hrefError.message)}</p>}
        </div>

        {!isContactType && (
          <div>
            <label className="mb-2 block text-sm font-medium">{t.textLink}</label>
            <input {...register(`${name}.${index}.textHref`)} className={INPUT_CLASS} />
            {textHrefError?.message && <p className="mt-1 text-xs text-red-600">{String(textHrefError.message)}</p>}
          </div>
        )}
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
