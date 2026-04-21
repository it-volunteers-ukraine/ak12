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
  wrapperClassName?: string;
  component?: React.ElementType;
  iconWrapperClassName?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const FieldWithIcon = ({
  rows,
  label,
  locale,
  basePath,
  component,
  iconWidth,
  iconHeight,
  icon: Icon,
  wrapperClassName,
  iconWrapperClassName,
  ...props
}: IFieldWithIcon) => {
  const { iconWrapper, wrapper } = getStyles();

  return (
    <div className={wrapper(wrapperClassName)}>
      <div className={label ? "flex w-full justify-between" : "flex flex-col py-1"}>
        {label && <h3>{label}</h3>}

        <div className={iconWrapper(iconWrapperClassName)}>
          <Icon width={iconWidth} height={iconHeight} className="h-full w-full object-cover" />
        </div>
      </div>

      <FormField name={`${locale}.${basePath}`} component={component} rows={rows} {...props} />
    </div>
  );
};
