// 🎓 SIMPLE FORM - рендерить всю форму за конфігом

"use client";

import { useFormContext } from "react-hook-form";
import { SimpleFormConfig } from "../types";
import { SimpleField } from "./SimpleField";

interface SimpleFormProps {

  config: SimpleFormConfig;
  data: any;
}

export const SimpleForm = ({ config, data }: SimpleFormProps) => {
  const { reset, formState } = useFormContext();
  const { isValid } = formState;

  const submitText = config.submitText || "Зберегти";
  const resetText = config.resetText || "Скасувати";

  return (
    <div className="simple-form">
      <div className="mb-6 flex gap-4">
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitText}
        </button>
        
        <button
          type="button"
          onClick={() => reset(data)}
          className="rounded-md border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          {resetText}
        </button>
      </div>
      
      <div className="space-y-4">
        {config.fields.map((fieldConfig) => (
          <SimpleField 
            key={fieldConfig.name} 
            config={fieldConfig} 
          />
        ))}
      </div>
      
    </div>
  );
};

