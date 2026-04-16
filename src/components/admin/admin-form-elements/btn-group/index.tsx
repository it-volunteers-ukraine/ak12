import { Button } from "@/components/button";

import { getStyles } from "./styles";

interface IBtnGroup {
  isValid: boolean;
  className?: string;
  resetText?: string;
  onReset: () => void;
  submitText?: string;
}

export const BtnGroup = ({ isValid, onReset, submitText, resetText, className }: IBtnGroup) => {
  const { wrapper } = getStyles();

  return (
    <div className={wrapper(className)}>
      <Button variant="primary" type="submit" disabled={!isValid}>
        {submitText || "Зберегти зміни"}
      </Button>

      <Button variant="outline" type="reset" onClick={() => onReset()}>
        {resetText || "Скасувати правки"}
      </Button>
    </div>
  );
};
