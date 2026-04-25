import { Button } from "@/components/button";

import { getStyles } from "./styles";

interface IBtnGroup {
  isValid: boolean;
  className?: string;
  resetText?: string;
  onReset: () => void;
  submitText?: string;
  submitClassName?: string;
  resetClassName?: string;
}

export const BtnGroup = ({ 
  isValid, 
  onReset, 
  submitText, 
  resetText, 
  className,
  submitClassName,
  resetClassName 
}: IBtnGroup) => {
  const { wrapper } = getStyles();

  return (
    <div className={wrapper(className)}>
      <Button 
        variant="primary" 
        type="submit" 
        disabled={!isValid}
        className={submitClassName}
      >
        {submitText || "Зберегти зміни"}
      </Button>

      <Button 
        variant="outline" 
        type="reset" 
        onClick={() => onReset()}
        className={resetClassName}
      >
        {resetText || "Скасувати правки"}
      </Button>
    </div>
  );
};
