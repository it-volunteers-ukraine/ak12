"use client";

import { useRef, useMemo, useState, useEffect } from "react";

import Image from "next/image";

import { Upload, EditIcon, TrashIcon } from "../../../../public/icons";

interface IFormImg {
  label?: string;
  disabled?: boolean;
  file?: File | null;
  src?: string | null;
  onRemove: () => void;
  containerClassName?: string;
  imageFrameClassName?: string;
  imageAspectClassName?: string;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const FormImg = ({
  src,
  file,
  label,
  onRemove,
  onFileChange,
  disabled = false,
  containerClassName,
  imageFrameClassName,
  imageAspectClassName,
}: IFormImg) => {
  const imageClassName = imageFrameClassName
    ? "h-full w-full rounded-2xl object-cover"
    : `${imageAspectClassName || "aspect-1.5/1"} w-full rounded-2xl object-cover`;

  const [hasError, setHasError] = useState(false);
  const [clientError, setClientError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const remoteUrl = src || null;
  const imageSrc = previewUrl || remoteUrl || null;
  const displayImage = Boolean(imageSrc) && !hasError;

  function handlePickClick() {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setClientError("");
    setHasError(false);

    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    if (!ALLOWED_TYPES.includes(nextFile.type)) {
      setClientError("Допустимі формати: JPG, JPEG, PNG, WEBP");
      event.target.value = "";

      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setClientError("Максимальна вага файлу — 5 MB");
      event.target.value = "";

      return;
    }

    onFileChange(nextFile);
  }

  function handleRemove() {
    setClientError("");
    setHasError(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove();
  }

  return (
    <div
      className={`h-full w-full rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 py-6 ${containerClassName || ""}`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />
      <div className="w-full">
        {label ? <p className="mb-4 text-lg font-medium">{label}</p> : null}
        {displayImage ? (
          <div
            className={`relative z-0 w-full overflow-hidden rounded-2xl border border-transparent ${imageFrameClassName || ""}`}
          >
            <Image
              priority
              width={352}
              height={202}
              alt="main-banner"
              src={imageSrc as string}
              className={imageClassName}
              onError={() => setHasError(true)}
              unoptimized={Boolean(previewUrl)}
            />
            <div className="absolute top-3 right-3 flex gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={handlePickClick}
                aria-label={"Оновити файл"}
                className="rounded-full bg-white/80 p-1.25 transition-all ease-in-out hover:scale-125 hover:bg-sky-300"
              >
                <EditIcon className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="rounded-full bg-white/80 p-1.25 transition-all ease-in-out hover:scale-125 hover:bg-red-300"
                aria-label={"Видалити файл"}
              >
                <TrashIcon className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#697077] p-6 ${imageFrameClassName || ""}`}
          >
            <button type="button" onClick={handlePickClick} disabled={disabled} className="m-auto w-fit">
              <Upload width={44} height={44} />
            </button>
            <div className="flex w-76 flex-col items-center gap-2">
              <p className="start">Технічні параметри:</p>
              <ol className="ml-5 list-decimal">
                <li className="text-sm">Розмір: від 1920px x 800px</li>
                <li className="text-sm">Формат: Jpeg, JPG, PNG</li>
                <li className="text-sm">Вага: до 5МБ</li>
              </ol>
            </div>
          </div>
        )}
        <p className="flex items-center text-xs leading-[1.2] text-red-400">{clientError ?? "\u00A0"}</p>
      </div>
    </div>
  );
};
