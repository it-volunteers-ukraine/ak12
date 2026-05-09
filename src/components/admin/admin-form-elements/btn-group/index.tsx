import { Button } from "@/components/button";

import { getStyles } from "./styles";

interface IBtnGroup {
  isValid: boolean;
  className?: string;
  resetText?: string;
  onReset: () => void;
  submitText?: string;
  resetClassName?: string;
  submitClassName?: string;
  addNewElementForArray?: boolean;
  addNewElementHandleClick?: () => void;
}

export const BtnGroup = ({
  isValid,
  onReset,
  resetText,
  className,
  submitText,
  resetClassName,
  submitClassName,
  addNewElementForArray,
  addNewElementHandleClick,
}: IBtnGroup) => {
  const { wrapper } = getStyles();

  return (
    <div className={wrapper(className)}>
      {addNewElementForArray && (
        <Button onClick={addNewElementHandleClick} variant="add" className="mr-auto">
          Додати елемент галереї
        </Button>
      )}
      <Button variant="primary" type="submit" disabled={!isValid} className={submitClassName}>
        {submitText || "Зберегти зміни"}
      </Button>

      <Button variant="outline" type="reset" onClick={() => onReset()} className={resetClassName}>
        {resetText || "Скасувати правки"}
      </Button>
    </div>
  );
};
