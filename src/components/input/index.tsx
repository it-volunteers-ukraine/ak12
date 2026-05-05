import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import { getStyles } from "./styles";

interface InputProps<T extends FieldValues> extends UseControllerProps<T> {
  as?: "text" | "radio" | "textarea";
  type?: string;
  label?: string;
  placeholder?: string;
  classNameContainer?: string;
  radioOptions?: { label: string }[];
}

export const FormInput = <T extends FieldValues>({
  label,
  placeholder,
  radioOptions,
  type = "text",
  as = "text",
  classNameContainer,
  ...controllerProps
}: InputProps<T>) => {
  const {
    field,
    fieldState: { error, isDirty, isTouched },
  } = useController(controllerProps);

  const isError = !!error;

  const isSuccess = (isDirty || isTouched) && !error;

  const styles = getStyles({ isError, isSuccess, classNameContainer });

  return (
    <>
      {as !== "radio" && (
        <div className={styles.container}>
          {label && (
            <label htmlFor={field.name} className={styles.label}>
              {label}
            </label>
          )}

          {as === "text" && (
            <input className={styles.input} id={field.name} type={type} placeholder={placeholder} {...field} />
          )}

          {as === "textarea" && (
            <textarea className={styles.textarea} id={field.name} placeholder={placeholder} {...field} />
          )}
          {error && <span className={styles.errorText}>{error.message}</span>}
        </div>
      )}

      {as === "radio" && radioOptions && radioOptions?.length > 0 && (
        <fieldset className={styles.container}>
          {label && <legend className={styles.radioLabelGroup}>{label}</legend>}

          <div className={styles.radioContainer}>
            {radioOptions.map((option, index) => (
              <label key={option.label + index} className={styles.radioLabel}>
                <input
                  className="peer sr-only"
                  type="radio"
                  value={option.label}
                  checked={field.value === option.label}
                  onChange={() => field.onChange(option.label)}
                />
                <div className={styles.radioBigCircle}>
                  <div className={styles.radioSmallCircle} />
                </div>
                {option.label}
              </label>
            ))}
          </div>
          {error && <span className={styles.errorText}>{error.message}</span>}
        </fieldset>
      )}
    </>
  );
};
