import { useState } from "react";

import Image from "next/image";

import { Upload } from "@/assets/icons";

interface IFormImg {
  src?: string;
}

export const FormImg = ({ src }: IFormImg) => {
  const [hasError, setHasError] = useState(false);

  const displayImage = src && !hasError;

  return (
    <div className="w-100 rounded-2xl border border-gray-300 bg-[#F8F9FA]/80 px-6 py-10">
      <div>
        <h2 className="mb-4">Фото на сайті</h2>
        {displayImage ? (
          <div className="relative aspect-352/202 w-full overflow-hidden rounded-2xl border border-gray-200">
            <Image
              priority
              src={src}
              width={352}
              height={202}
              alt="main-banner"
              onError={() => setHasError(true)}
              className="rounded-2xl object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#697077] p-6">
            <div className="m-auto w-fit">
              <Upload width={44} height={44} />
            </div>
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
      </div>
    </div>
  );
};
