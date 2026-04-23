import { SVGProps, ComponentType } from "react";

import { FormField } from "@/components/form-elements";

import { getStyles } from "./style";

interface ILocaleContentGroup {
  label: string;
  locale: string;
  iconWidth?: number;
  iconHeight?: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const LocaleContentGroup = ({ icon: Icon, iconWidth, iconHeight, locale, label }: ILocaleContentGroup) => {
  const { iconWrapper, textContentWrapper } = getStyles();

  return (
    <div className={textContentWrapper}>
      <div className="mb-4 flex justify-between">
        <h3 className="font-medium">{label}</h3>

        <div className={iconWrapper()}>
          <Icon width={iconWidth} height={iconHeight} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <FormField name={`${locale}.title`} label="Заголовок" />
        <FormField name={`${locale}.subtitle`} label="Підзаголовок" />
      </div>
    </div>
  );
};
