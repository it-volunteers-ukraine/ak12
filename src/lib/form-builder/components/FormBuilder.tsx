// 🎓 FORM BUILDER - рендерить форму яка працює з БД (uk/en структура)
"use client";

import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { FormImg, FormField } from "@/components/form-elements";
import { BtnGroup } from "@/components/admin/admin-form-elements";

import { En, Uk } from "../../../../public/icons";
import { LOCALES, FormBuilderConfig } from "../types";
// Іконки для мов
interface FormBuilderProps {
  data: any;
  imageFile?: File | null;
  config: FormBuilderConfig;
  onImageRemove?: () => void;
  onImageChange?: (file: File | null) => void;
}

const LANGUAGE_ICONS = {
  uk: Uk,
  en: En,
};

const FlagBadge = ({ children, size = "sm" }: { children: ReactNode; size?: "sm" | "md" }) => {
  const classes = size === "md" ? "h-8 w-8" : "h-5 w-5";

  return <span className={`inline-flex ${classes} overflow-hidden rounded-full`}>{children}</span>;
};

const SECTION_LAYOUTS: Record<string, string> = {
  "text-content": "grid-cols-1 lg:grid-cols-3", // [Фото | UK | EN]
  statistics: "grid-cols-1 lg:grid-cols-2", // [UK | EN]
  subtitle: "grid-cols-1 lg:grid-cols-2",
  button: "grid-cols-1 lg:grid-cols-2",
};

export const FormBuilder = ({ config, data, imageFile, onImageChange, onImageRemove }: FormBuilderProps) => {
  const { reset, formState } = useFormContext();
  const { isValid } = formState;

  const submitText = config.options?.submitText || "Зберегти зміни";
  const resetText = config.options?.resetText || "Скасувати правки";
  const bannerImage = data.uk?.backgroundImage || data.en?.backgroundImage || null;
  const bannerImg = bannerImage?.secureUrl || null;

  const renderSectionContent = (
    section: FormBuilderConfig["sections"][number],
    options?: { suppressOutsideTitle?: boolean }
  ) => {
    const gridLayout = SECTION_LAYOUTS[section.id] || "grid-cols-1 lg:grid-cols-2";
    const showImage = section.id === "text-content" && config.options?.hasImage && onImageChange;
    const localeLayout = section.localeLayout || "split";
    const showOutsideTitle =
      Boolean(section.title) && section.titlePlacement === "outside" && !options?.suppressOutsideTitle;
    const sectionGridLayout = showImage
      ? localeLayout === "split"
        ? gridLayout
        : "grid-cols-1 lg:grid-cols-[350px_1fr]"
      : localeLayout === "combined" || localeLayout === "by-field-2col" || localeLayout === "by-locale-2col"
        ? "grid-cols-1"
        : gridLayout;

    return (
      <div className="space-y-3">
        {showOutsideTitle && <h4 className="text-lg font-medium">{section.title}</h4>}
        <div className={`grid ${sectionGridLayout} gap-8`}>
        {showImage && (
          <div className={config.imageWrapperClassName || "w-full"}>
            <FormImg
              src={bannerImg}
              file={imageFile}
              label={config.options?.imageConfig?.label || "Фото на сайті"}
              onRemove={onImageRemove || (() => {})}
              onFileChange={onImageChange}
            />
          </div>
        )}

        {localeLayout === "by-locale-2col" ? (
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
            {!showOutsideTitle && section.title && (
              <div className="mb-6">
                <h4 className="text-lg font-medium">{section.title}</h4>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {LOCALES.map((locale) => {
                const localeFields = section.fields.filter((field) => (field.locales || LOCALES).includes(locale));
                const Icon = LANGUAGE_ICONS[locale];

                if (localeFields.length === 0) {
                  return null;
                }

                return (
                  <div key={`by-locale-2col-${locale}`} className="space-y-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold">{locale === "uk" ? "Українська" : "English"}</p>
                      <FlagBadge>
                        <Icon width={28} height={20} />
                      </FlagBadge>
                    </div>

                    {localeFields.map((field) => (
                      <div key={`${locale}-${field.name}`}>
                        <label className="mb-2 block text-sm font-medium">{field.label[locale]}</label>
                        <FormField
                          name={`${locale}.${field.name}`}
                          component={field.component}
                          className={field.className || "bg-white"}
                          {...field.props}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : localeLayout === "by-field-2col" ? (
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
            {!showOutsideTitle && section.title && (
              <div className="mb-6">
                <h4 className="text-lg font-medium">{section.title}</h4>
              </div>
            )}

            <div className="space-y-6">
              {section.fields.map((field) => {
                const fieldLocales = field.locales || LOCALES;

                return (
                  <div
                    key={`by-field-2col-${field.name}`}
                    className={`grid ${
                      fieldLocales.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
                    } gap-6`}
                  >
                    {fieldLocales.map((locale) => {
                      const Icon = LANGUAGE_ICONS[locale];

                      return (
                        <div key={`${locale}-${field.name}`}>
                          <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium">{field.label[locale]}</label>
                            <FlagBadge>
                              <Icon width={28} height={20} />
                            </FlagBadge>
                          </div>
                          <FormField
                            name={`${locale}.${field.name}`}
                            component={field.component}
                            className={field.className || "bg-white"}
                            {...field.props}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : localeLayout === "combined" ? (
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
            {!showOutsideTitle && section.title && (
              <div className="mb-6">
                <h4 className="text-lg font-medium">{section.title}</h4>
              </div>
            )}

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={`combined-${field.name}`} className="space-y-4">
                  {(field.locales || LOCALES).map((locale) => {
                    const Icon = LANGUAGE_ICONS[locale];

                    return (
                      <div key={`${locale}-${field.name}`}>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="block text-sm font-medium">{field.label[locale]}</label>
                          <FlagBadge>
                            <Icon width={28} height={20} />
                          </FlagBadge>
                        </div>
                        <FormField
                          name={`${locale}.${field.name}`}
                          component={field.component}
                          className={field.className || "bg-white"}
                          {...field.props}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          LOCALES.map((locale) => {
            const Icon = LANGUAGE_ICONS[locale];
            const localeText = locale === "uk" ? "українською" : "англійською";
            const blockTitle = section.title ? `${section.title} ${localeText}` : `Текстовий контент ${localeText}`;

            return (
              <div key={locale} className="rounded-xl border border-gray-200 bg-gray-100 p-6">
                {!showOutsideTitle && (
                  <div className="mb-6 flex items-center justify-between">
                    <h4 className="text-lg font-medium">{blockTitle}</h4>
                    <FlagBadge size="md">
                      <Icon width={42} height={32} />
                    </FlagBadge>
                  </div>
                )}

                <div className="space-y-6">
                  {section.fields
                    .filter((field) => (field.locales || LOCALES).includes(locale))
                    .map((field) => (
                      <div key={`${locale}-${field.name}`}>
                        {field.label &&
                          (showOutsideTitle ? (
                            <div className="mb-2 flex items-center justify-between">
                              <label className="block text-sm font-medium">{field.label[locale]}</label>
                              <FlagBadge>
                                <Icon width={28} height={20} />
                              </FlagBadge>
                            </div>
                          ) : (
                            <label className="mb-2 block text-sm font-medium">{field.label[locale]}</label>
                          ))}
                        <FormField
                          name={`${locale}.${field.name}`}
                          component={field.component}
                          className={field.className || "bg-white"}
                          {...field.props}
                        />
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    );
  };

  const sectionGroups: Array<
    | { type: "single"; section: FormBuilderConfig["sections"][number] }
    | { type: "group"; group: string; sections: FormBuilderConfig["sections"] }
  > = [];

  let index = 0;

  while (index < config.sections.length) {
    const currentSection = config.sections[index];

    if (!currentSection.group) {
      sectionGroups.push({ type: "single", section: currentSection });
      index += 1;
      continue;
    }

    const groupedSections = [currentSection];
    let nextIndex = index + 1;

    while (nextIndex < config.sections.length && config.sections[nextIndex].group === currentSection.group) {
      groupedSections.push(config.sections[nextIndex]);
      nextIndex += 1;
    }

    sectionGroups.push({
      type: "group",
      group: currentSection.group,
      sections: groupedSections,
    });
    index = nextIndex;
  }

  return (
    <div className={config.className || "form-builder"}>
      <div className={config.buttonsClassName}>
        <BtnGroup
          isValid={isValid}
          onReset={() => reset(data)}
          submitText={submitText}
          resetText={resetText}
          submitClassName={config.submitClassName}
          resetClassName={config.resetClassName}
        />
      </div>

      {sectionGroups.map((item, itemIndex) => {
        if (item.type === "single") {
          return (
            <div key={item.section.id} className="mb-10">
              {renderSectionContent(item.section)}
            </div>
          );
        }

        const groupSettings = config.sectionGroups?.[item.group];
        const groupClassName =
          typeof groupSettings === "string"
            ? groupSettings
            : groupSettings?.className || "grid grid-cols-1 lg:grid-cols-2 gap-8";
        const groupTitle = typeof groupSettings === "string" ? undefined : groupSettings?.title;
        const groupTitleClassName = typeof groupSettings === "string" ? undefined : groupSettings?.titleClassName;

        return (
          <div key={`${item.group}-${itemIndex}`} className="mb-10 space-y-3">
            {groupTitle && <h4 className={groupTitleClassName || "text-lg font-medium"}>{groupTitle}</h4>}
            <div className={groupClassName}>
              {item.sections.map((section) => (
                <div key={section.id}>
                  {renderSectionContent(section, { suppressOutsideTitle: Boolean(groupTitle) })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
