import { useFormContext } from "react-hook-form";

import { TextArea } from "@/components/form-elements";

import { AdminData } from "../config";
import { LANGUAGES, textLabels, buttonLabels, textContentLabels } from "./config";
import { BtnGroup, FieldWithIcon, LocaleContentGroup } from "../../admin-form-elements";

interface IMobilizationForm {
  data: AdminData;
  isValid: boolean;
}

export const MobilizationForm = ({ data, isValid }: IMobilizationForm) => {
  const { reset } = useFormContext();

  return (
    <>
    <BtnGroup
        isValid={isValid}
        onReset={() => reset(data)}
        submitText="Зберегти зміни"
        resetText="Скасувати правки"
      />

      <div className="mb-10 flex items-stretch justify-between gap-12">
        {LANGUAGES.map(({ id, icon: Icon }) => (
          <LocaleContentGroup
            icon={Icon}
            locale={id}
            iconWidth={42}
            iconHeight={32}
            label={textLabels[id]}
            key={`${id}-${textLabels[id]}`}
          />
        ))}
      </div>

      <div className="mb-10 flex items-stretch justify-between gap-12 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-4">
        {LANGUAGES.map(({ id, icon: Icon }) => (
          <FieldWithIcon
            rows={6}
            icon={Icon}
            locale={id}
            iconWidth={42}
            iconHeight={32}
            component={TextArea}
            basePath="content"
            label={textContentLabels[id]}
            key={`${id}-${textContentLabels[id]}`}
          />
        ))}
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-xl font-medium">Редагування кнопки</h3>

        <div className="flex justify-between gap-12 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 pt-10 pb-4">
          {LANGUAGES.map(({ id, icon: Icon }) => (
            <FieldWithIcon
              icon={Icon}
              locale={id}
              iconWidth={42}
              iconHeight={32}
              basePath="buttonTitle"
              label={buttonLabels[id]}
              key={`${id}-${buttonLabels[id]}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};
