"use client";

import { useFormContext } from "react-hook-form";
import { FormImg } from "@/components/form-elements";
import { BtnGroup } from "@/components/admin/admin-form-elements";
import { LocaleSection } from "./LocaleSection";
import { FormBuilderConfig } from "../types";

interface FormBuilderProps {
  data: any;
  imageFile?: File | null;
  config: FormBuilderConfig;
  onImageRemove?: () => void;
  onImageChange?: (file: File | null) => void;
}

const SECTION_GRIDS: Record<string, string> = {
  "text-content": "grid-cols-1 lg:grid-cols-3", // [Фото | UK | EN]
  statistics: "grid-cols-1 lg:grid-cols-2",
  subtitle: "grid-cols-1 lg:grid-cols-2",
  button: "grid-cols-1 lg:grid-cols-2",
};

const getSectionGrid = (
  sectionId: string,
  localeMode: string,
  hasImage: boolean
): string => {
  const baseGrid = SECTION_GRIDS[sectionId] || "grid-cols-1 lg:grid-cols-2";
  
  if (hasImage) {
    return localeMode === "split" ? baseGrid : "grid-cols-1 lg:grid-cols-[350px_1fr]";
  }
  
  if (localeMode !== "split") {
    return "grid-cols-1";
  }
  
  return baseGrid;
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
    const hasImage = section.id === "text-content" && config.options?.hasImage && onImageChange;
    const localeMode = section.localeLayout || "split";
    const showOutsideTitle =
      Boolean(section.title) && section.titlePlacement === "outside" && !options?.suppressOutsideTitle;
    
    const gridClasses = getSectionGrid(section.id, localeMode, !!hasImage);

    return (
      <div className="space-y-3">
        {showOutsideTitle && <h4 className="text-lg font-medium">{section.title}</h4>}
        
        <div className={`grid ${gridClasses} gap-8`}>
          {hasImage && (
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
          <LocaleSection section={section} showOutsideTitle={showOutsideTitle} />
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
