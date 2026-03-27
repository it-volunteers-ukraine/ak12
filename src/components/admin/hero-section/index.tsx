"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { HeroSchema } from "@/schemas/heroSchema";
import { updateHeroMultiLangAction } from "@/actions/heroActions";

interface TAdminData {
  en: HeroSchema | null;
  uk: HeroSchema | null;
}
interface IHeroSection {
  data: TAdminData;
}

export const HeroSection = ({ data }: IHeroSection) => {
  const router = useRouter();
  const { uk: dataUK, en: dataEN } = data;

  const handleSubmit = async (formData: FormData) => {
    const res = await updateHeroMultiLangAction(formData);

    if (res.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4 rounded border bg-white p-6 text-black shadow">
      <form onSubmit={() => console.log(data)} action={handleSubmit}>
        <div>
          <input name="titleUk" defaultValue={dataUK?.title} className="w-full rounded border p-2 text-black" />
          <input name="subtitleUk" defaultValue={dataUK?.subtitle} className="w-full rounded border p-2 text-black" />
        </div>
        <div>
          <input name="titleEn" defaultValue={dataEN?.title} className="w-full rounded border p-2 text-black" />
          <input name="subtitleEn" defaultValue={dataEN?.subtitle} className="w-full rounded border p-2 text-black" />
        </div>

        <input
          name="backgroundImage"
          defaultValue={dataUK?.backgroundImage || dataEN?.backgroundImage}
          placeholder="https://example.com/image.jpg"
          className="mb-4 w-full rounded border p-2 text-black"
        />
        {!data && (
          <div className="rounded bg-yellow-50 p-4 text-yellow-700">
            Дані для цієї локалі ({dataUK?.title || dataEN?.title}) ще не створені в базі.
          </div>
        )}
        <Image
          className="rounded-lg object-cover"
          alt="main-banner"
          width={100}
          height={100}
          src={
            dataUK?.backgroundImage ||
            dataUK?.backgroundImage ||
            "https://i.pinimg.com/736x/24/11/42/241142e0b2024e219879c624a153264a.jpg"
          }
        />
        <div>
          <input
            name="primaryButtonTextEn"
            defaultValue={dataEN?.primaryButton?.text}
            className="w-full rounded border p-2 text-black"
          />
          <input
            name="primaryButtonTextUk"
            defaultValue={dataUK?.primaryButton?.text}
            className="w-full rounded border p-2 text-black"
          />
        </div>

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400">
          submit
        </button>
      </form>
    </div>
  );
};
