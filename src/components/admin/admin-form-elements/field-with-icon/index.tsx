import { SVGProps, ComponentType } from "react";

import { FormField } from "@/components/form-elements";

import { getStyles } from "./styles";

interface IFieldWithIcon {
  rows?: number;
  label?: string;
  locale: string;
  basePath: string;
  iconWidth?: number;
  iconHeight?: number;
  className?: string;              // Для самого інпута/textarea
  wrapperClassName?: string;       // Для обгортки
  labelClassName?: string;         // Для лейбла
  labelWrapperClassName?: string;  // Для контейнера лейбл+іконка
  iconClassName?: string;          // Для іконки
  component?: React.ElementType;
  iconWrapperClassName?: string;   // Для обгортки іконки
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const FieldWithIcon = ({
  rows,
  label,
  locale,
  basePath,
  component,
  className,
  iconWidth,
  iconHeight,
  icon: Icon,
  labelClassName,
  labelWrapperClassName,
  iconClassName,
  wrapperClassName,
  iconWrapperClassName,
  ...props
}: IFieldWithIcon) => {
  const { iconWrapper, wrapper } = getStyles();

  const defaultLabelWrapperClass = label ? "flex w-full justify-between" : "flex flex-col py-1";

  return (
    <div className={wrapper(wrapperClassName)}>
      <div className={labelWrapperClassName || defaultLabelWrapperClass}>
        {label && <h3 className={labelClassName}>{label}</h3>}

        <div className={iconWrapper(iconWrapperClassName)}>
          <Icon 
            width={iconWidth} 
            height={iconHeight} 
            className={iconClassName || "h-full w-full object-cover"} 
          />
        </div>
      </div>

      <FormField 
        name={`${locale}.${basePath}`} 
        component={component} 
        rows={rows} 
        className={className}
        {...props} 
      />
    </div>
  );
};
