"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "@/assets/icons";
import { TrashIcon, EditIcon } from "@/assets/icon";

interface IFormImg {
  src?: string | null;
  file?: File | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const FormImg = ({ src, file, onFileChange, onRemove, disabled = false }: IFormImg) => {
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
    <div className="mb-10 w-100 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 py-10">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <div>
        <h2 className="mb-4">Фото на сайті</h2>
        {displayImage ? (
          <div className="relative aspect-352/202 w-full overflow-hidden rounded-2xl border border-transparent">
            <Image
              priority
              src={imageSrc as string}
              width={352}
              height={202}
              alt="main-banner"
              onError={() => setHasError(true)}
              className="rounded-2xl object-cover"
              unoptimized={Boolean(previewUrl)}
            />
            <div className="absolute top-3 right-3 flex gap-1">
              <button
                type="button"
                onClick={handlePickClick}
                disabled={disabled}
                className="rounded-full bg-white/80 p-1.25"
                aria-label={"Оновити файл"}
              >
                <EditIcon className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="rounded-full bg-white/80 p-1.25"
                aria-label={"Видалити файл"}
              >
                <TrashIcon className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#697077] p-6">
            <button type="button" onClick={handlePickClick} disabled={disabled} className="m-auto w-fit">
              <Upload width={44} height={44} />
            </button>
            <div className="flex w-76 flex-col items-center gap-2">
              <h3 className="start">Технічні параметри:</h3>
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
