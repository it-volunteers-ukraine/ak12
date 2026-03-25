"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Locale } from "@/types";
import { HeroSchema } from "@/schema/heroSchema";
import { updateHeroSectionAction } from "@/actions/heroActions";

interface IHeroSection {
    locale: Locale;
    data: HeroSchema | null;
}

export const HeroSection = ({ data, locale }: IHeroSection) => {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const res = await updateHeroSectionAction(formData, locale);

        if (res.success) {
            router.refresh();
        }
    };

    return (
        <div className="space-y-4 p-6 bg-white rounded shadow text-black">
            <form
                onSubmit={() => console.log(data)}
                action={handleSubmit}
            >
                <h2 className="text-xl font-bold border-b pb-2">
                    Перегляд даних секції
                </h2>
                <input
                    name="title"
                    defaultValue={data?.title}
                    className="w-full p-2 border rounded text-black"
                />
                <input
                    name="backgroundImage"
                    defaultValue={data?.backgroundImage}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border rounded text-black mb-4"
                />
                {!data && (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
                        Дані для цієї локалі ({locale}) ще не створені в базі.
                    </div>
                )}

                <Image
                    className="object-cover rounded-lg"
                    alt="test"
                    width={100}
                    height={100}
                    src={
                        data?.backgroundImage ||
                        "https://i.pinimg.com/736x/24/11/42/241142e0b2024e219879c624a153264a.jpg"
                    }
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                ></button>
            </form>
        </div>
    );
};
