"use client";

import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { En, Uk } from "../../../../public/icons";
import { LOCALES, SectionConfig } from "../types";
import { getYouTubeEmbedUrl } from "@/lib/youtube/youtube";
import { logger } from "@/lib/logger/logger";
import { Button } from "@/components";
import { FormImg, TextArea, FormField, TextInput } from "@/components/form-elements";

interface LocaleSectionProps {
  section: SectionConfig;
  showOutsideTitle: boolean;
  removedImageFieldIds?: Set<string>;
  galleryFiles?: Record<string, File | null>;
  onGalleryRemove?: (fieldId: string) => void;
  onGalleryItemRemove?: (index: number) => void;
  galleryFieldIdsByIndex?: Record<number, string>;
  gallerySrcByIndex?: Record<number, string | null>;
  onGalleryFileChange?: (fieldId: string, file: File | null) => void;
}
type RenderFieldOptions = Omit<LocaleSectionProps, "section" | "showOutsideTitle">;

const COMPONENT_BY_TYPE = {
  text: TextInput,
  number: TextInput,
  custom: TextInput,
  textarea: TextArea,
};

const LANGUAGE_ICONS = {
  uk: Uk,
  en: En,
};

const DEFAULT_LOCALE_TITLES: Record<(typeof LOCALES)[number], string> = {
  uk: "Українська",
  en: "English",
};

// VideoField
const VideoField = ({ fieldName }: { fieldName: string }) => {
  const { watch } = useFormContext();
  const value: string = watch(fieldName) ?? "";
  const embedUrl = getYouTubeEmbedUrl(value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">YouTube посилання</label>
      <FormField name={fieldName} className="bg-white" component={TextInput} placeholder="https://youtu.be/..." />
      {embedUrl && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <iframe
            src={embedUrl}
            title="YouTube preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        </div>
      )}
      {value && !embedUrl && <p className="text-xs text-red-500">Невалідне YouTube посилання</p>}
    </div>
  );
};

// MediaSelectorField
const MediaSelectorField = ({
  imageIndex,
  videoIndex,
  options,
}: {
  imageIndex: number;
  videoIndex: number;
  options: RenderFieldOptions;
}) => {
  const { watch, setValue } = useFormContext();
  const mediaType: "image" | "video" = watch(`uk.content.gallery.${imageIndex}.mediaType`) ?? "image";

  const handleMediaTypeChange = (type: "image" | "video") => {
    setValue(`uk.content.gallery.${imageIndex}.mediaType`, type, { shouldDirty: true });
    setValue(`en.content.gallery.${imageIndex}.mediaType`, type, { shouldDirty: true });
  };

  const fieldId = options.galleryFieldIdsByIndex?.[imageIndex];
  const isRemoved = fieldId ? (options.removedImageFieldIds?.has(fieldId) ?? false) : false;
  const file = fieldId ? (options.galleryFiles?.[fieldId] ?? null) : null;
  const src = isRemoved && !file ? null : (options.gallerySrcByIndex?.[imageIndex] ?? null);

  const canRemoveGalleryItem = imageIndex >= 9;

  return (
    <div className="space-y-3">
      <div className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name={`media-type-${imageIndex}`}
            value="image"
            checked={mediaType === "image"}
            onChange={() => handleMediaTypeChange("image")}
            className="accent-blue-400"
          />
          <span className="text-sm font-medium">Фото</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name={`media-type-${imageIndex}`}
            value="video"
            checked={mediaType === "video"}
            onChange={() => handleMediaTypeChange("video")}
            className="accent-blue-400"
          />
          <span className="text-sm font-medium">YouTube відео</span>
        </label>
      </div>

      {mediaType === "image" ? (
        fieldId ? (
          <div className="space-y-3">
            <FormImg
              src={src}
              file={file}
              onRemove={() => options.onGalleryRemove?.(fieldId)}
              onFileChange={(nextFile) => options.onGalleryFileChange?.(fieldId, nextFile)}
            />
            {canRemoveGalleryItem && (
              <Button
                variant="danger"
                onClick={() => options.onGalleryItemRemove?.(imageIndex)}
                className="border border-red-400 bg-red-200 text-rose-600 hover:text-white"
              >
                Видалити елемент галереї
              </Button>
            )}
          </div>
        ) : null
      ) : (
        <div className="space-y-3">
          <VideoField fieldName={`uk.content.gallery.${videoIndex}.videoUrl`} />
          {canRemoveGalleryItem && (
            <Button
              variant="danger"
              onClick={() => options.onGalleryItemRemove?.(imageIndex)}
              className="border border-red-400 bg-red-200 text-rose-600 hover:text-white"
            >
              Видалити елемент галереї
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// getFieldKey
const getFieldKey = (field: SectionConfig["fields"][number], fallback: string) => {
  if (field.id) {
    return field.id;
  }

  if (field.type === "image") {
    const imageIndex = Number(field.props?.imageIndex ?? -1);

    return imageIndex >= 0 ? `image-${imageIndex}` : fallback;
  }

  if (field.type === "video") {
    const videoIndex = Number(field.props?.videoIndex ?? -1);

    return videoIndex >= 0 ? `video-${videoIndex}` : fallback;
  }

  if (field.type === "media-selector") {
    const imageIndex = Number(field.props?.imageIndex ?? -1);

    return imageIndex >= 0 ? `media-selector-${imageIndex}` : fallback;
  }

  return field.name;
};

// RenderField
const renderField = (field: SectionConfig["fields"][number], locale: "uk" | "en", options: RenderFieldOptions) => {
  // Image
  if (field.type === "image") {
    const imageIndex = Number(field.props?.imageIndex ?? -1);

    if (imageIndex < 0) {
      return null;
    }

    const fieldId = options.galleryFieldIdsByIndex?.[imageIndex];

    if (!fieldId) {
      logger.warn(`Missing field id for gallery index: ${imageIndex}`);

      return null;
    }

    const isRemoved = options.removedImageFieldIds?.has(fieldId) ?? false;
    const file = options.galleryFiles?.[fieldId] ?? null;
    const src = isRemoved && !file ? null : (options.gallerySrcByIndex?.[imageIndex] ?? null);
    const imageLabel = field.props?.hideImageLabel
      ? undefined
      : (field.props?.imageLabel ?? field.label?.[locale] ?? "Фото");

    const canRemoveGalleryItem = imageIndex >= 9;

    return (
      <div className="space-y-3">
        <FormImg
          src={src}
          file={file}
          label={imageLabel}
          onRemove={() => options.onGalleryRemove?.(fieldId)}
          containerClassName={field.props?.containerClassName}
          imageFrameClassName={field.props?.imageFrameClassName}
          imageAspectClassName={field.props?.imageAspectClassName}
          onFileChange={(nextFile) => options.onGalleryFileChange?.(fieldId, nextFile)}
        />
        {canRemoveGalleryItem && (
          <Button
            variant="danger"
            onClick={() => options.onGalleryItemRemove?.(imageIndex)}
            className="border border-red-400 bg-red-200 text-rose-600 hover:text-white"
          >
            Видалити елемент галереї
          </Button>
        )}
      </div>
    );
  }

  // Video
  if (field.type === "video") {
    const videoIndex = Number(field.props?.videoIndex ?? -1);

    if (videoIndex < 0) {
      return null;
    }

    return <VideoField fieldName={`uk.content.gallery.${videoIndex}.videoUrl`} />;
  }

  // Media-selector
  if (field.type === "media-selector") {
    const imageIndex = Number(field.props?.imageIndex ?? -1);
    const videoIndex = Number(field.props?.videoIndex ?? -1);

    if (imageIndex < 0 || videoIndex < 0) {
      return null;
    }

    return <MediaSelectorField imageIndex={imageIndex} videoIndex={videoIndex} options={options} />;
  }

  // Custom
  if (field.type === "custom") {
    return (
      <FormField
        isCustom
        locale={locale}
        component={field.component}
        name={`${locale}.${field.name}`}
        className={field.className || "bg-white"}
        {...field.props}
      />
    );
  }

  // Text / Textarea / Number
  return (
    <FormField
      name={`${locale}.${field.name}`}
      className={field.className || "bg-white"}
      component={field.component || COMPONENT_BY_TYPE[field.type]}
      {...field.props}
    />
  );
};

// FlagBadge
const FlagBadge = ({ children, size = "sm" }: { children: ReactNode; size?: "sm" | "md" }) => {
  const classes = size === "md" ? "h-8 w-8" : "h-5 w-5";

  return <span className={`inline-flex ${classes} overflow-hidden rounded-full`}>{children}</span>;
};

// Layouts
const SplitLayout = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
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
                  <div key={`${locale}-${getFieldKey(field, "unnamed-field")}`}>
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
                    {renderField(field, locale, options)}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

const CombinedLayout = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
      {!showOutsideTitle && section.title && (
        <div className="mb-6">
          <h4 className="text-lg font-medium">{section.title}</h4>
        </div>
      )}

      <div className="space-y-6">
        {section.fields.map((field, index) => (
          <div key={`combined-${getFieldKey(field, `field-${index}`)}`} className="space-y-4">
            {(field.locales || LOCALES).map((locale) => {
              const Icon = LANGUAGE_ICONS[locale];

              return (
                <div key={`${locale}-${getFieldKey(field, `field-${index}`)}`}>
                  <div className="mb-2 flex items-center justify-between">
                    {field.label && <label className="block text-sm font-medium">{field.label[locale]}</label>}
                    {!section.hideLocaleBadge && (
                      <FlagBadge>
                        <Icon width={28} height={20} />
                      </FlagBadge>
                    )}
                  </div>
                  {renderField(field, locale, options)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const ByFieldLayout = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
      {!showOutsideTitle && section.title && (
        <div className="mb-6">
          <h4 className="text-lg font-medium">{section.title}</h4>
        </div>
      )}

      <div className="space-y-6">
        {section.fields.map((field, index) => {
          const fieldLocales = field.locales || LOCALES;

          return (
            <div
              key={`by-field-2col-${getFieldKey(field, `field-${index}`)}`}
              className={`grid ${fieldLocales.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6`}
            >
              {fieldLocales.map((locale) => {
                const Icon = LANGUAGE_ICONS[locale];

                return (
                  <div key={`${locale}-${getFieldKey(field, `field-${index}`)}`}>
                    <div className="mb-2 flex items-center justify-between">
                      {field.label && <label className="block text-sm font-medium">{field.label[locale]}</label>}
                      <FlagBadge>
                        <Icon width={28} height={20} />
                      </FlagBadge>
                    </div>
                    {renderField(field, locale, options)}
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

const ByLocaleLayout = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
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

              {localeFields.map((field, index) => (
                <div key={`${locale}-${getFieldKey(field, `field-${index}`)}`}>
                  {field.label && <label className="mb-2 block text-sm font-medium">{field.label[locale]}</label>}
                  {renderField(field, locale, options)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MEDIA_FIELD_TYPES = ["image", "video", "media-selector"] as const;

const GalleryThreeColLayout = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
  const mediaFields = section.fields.filter((field) =>
    MEDIA_FIELD_TYPES.includes(field.type as (typeof MEDIA_FIELD_TYPES)[number]),
  );
  const contentFields = section.fields.filter(
    (field) => !MEDIA_FIELD_TYPES.includes(field.type as (typeof MEDIA_FIELD_TYPES)[number]),
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
      {!showOutsideTitle && section.title && (
        <div className="mb-6">
          <h4 className="text-lg font-medium">{section.title}</h4>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          {mediaFields.map((field, index) => (
            <div key={`gallery-media-${getFieldKey(field, `media-${index}`)}`}>{renderField(field, "uk", options)}</div>
          ))}
        </div>
        {LOCALES.map((locale) => {
          const Icon = LANGUAGE_ICONS[locale];

          return (
            <div key={`gallery-locale-${locale}`} className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {section.localeTitles?.[locale] || DEFAULT_LOCALE_TITLES[locale]}
                </p>
                <FlagBadge>
                  <Icon width={28} height={20} />
                </FlagBadge>
              </div>

              {contentFields
                .filter((field) => (field.locales || LOCALES).includes(locale))
                .map((field, index) => (
                  <div key={`gallery-${locale}-${getFieldKey(field, `field-${index}`)}`}>
                    {field.label && <label className="mb-1 block text-sm">{field.label[locale]}</label>}
                    {renderField(field, locale, options)}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Layout registry
const LAYOUT_COMPONENTS: Record<string, React.FC<LocaleSectionProps>> = {
  split: SplitLayout,
  combined: CombinedLayout,
  "by-field-2col": ByFieldLayout,
  "by-locale-2col": ByLocaleLayout,
  "gallery-3col": GalleryThreeColLayout,
};

export const LocaleSection = ({ section, showOutsideTitle, ...options }: LocaleSectionProps) => {
  const layout = section.localeLayout || "split";
  const LayoutComponent = LAYOUT_COMPONENTS[layout];

  if (!LayoutComponent) {
    logger.warn(`Unknown layout: ${layout}. Falling back to 'split'.`);

    return <SplitLayout section={section} showOutsideTitle={showOutsideTitle} {...options} />;
  }

  return <LayoutComponent section={section} showOutsideTitle={showOutsideTitle} {...options} />;
};
