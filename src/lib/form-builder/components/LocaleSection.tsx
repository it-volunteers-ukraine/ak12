"use client";

import { ReactNode } from "react";
import { FormField } from "@/components/form-elements";
import { En, Uk } from "../../../../public/icons";
import { LOCALES, SectionConfig } from "../types";
import { logger } from "@/lib/logger";

const LANGUAGE_ICONS = {
  uk: Uk,
  en: En,
};

const FlagBadge = ({ children, size = "sm" }: { children: ReactNode; size?: "sm" | "md" }) => {
  const classes = size === "md" ? "h-8 w-8" : "h-5 w-5";

  return <span className={`inline-flex ${classes} overflow-hidden rounded-full`}>{children}</span>;
};

interface LocaleSectionProps {
  section: SectionConfig;
  showOutsideTitle: boolean;
}

const SplitLayout = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  return (
    <>
      {LOCALES.map((locale) => {
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
      })}
    </>
  );
};

const CombinedLayout = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  return (
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
  );
};

const ByFieldLayout = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  return (
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
  );
};

const ByLocaleLayout = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  return (
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
  );
};

const LAYOUT_COMPONENTS: Record<string, React.FC<LocaleSectionProps>> = {
  split: SplitLayout,
  combined: CombinedLayout,
  "by-field-2col": ByFieldLayout,
  "by-locale-2col": ByLocaleLayout,
};

export const LocaleSection = ({ section, showOutsideTitle }: LocaleSectionProps) => {
  const layout = section.localeLayout || "split";
  const LayoutComponent = LAYOUT_COMPONENTS[layout];

  if (!LayoutComponent) {
    logger.warn(`Unknown layout: ${layout}. Falling back to 'split'.`);

    return <SplitLayout section={section} showOutsideTitle={showOutsideTitle} />;
  }

  return <LayoutComponent section={section} showOutsideTitle={showOutsideTitle} />;
};
