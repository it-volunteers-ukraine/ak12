
"use client";

import { useFormContext } from "react-hook-form";
import { SimpleFieldConfig } from "../types";

interface SimpleFieldProps {
  config: SimpleFieldConfig;
}

export const SimpleField = ({ config }: SimpleFieldProps) => {

  const { register } = useFormContext();
  const { name, label, type, placeholder, required } = config;
  
  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          {...register(name, { required })}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows={4}
        />
      );
    }
    
    return (
      <input
        {...register(name, { required })}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
    );
  };
  
  return (
    <div className="mb-4">
      <label className="mb-2 block font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

