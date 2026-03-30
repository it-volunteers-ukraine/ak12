import { Locale } from "@/types";
import { SECTION_KEYS } from "@/constants";
import { heroContentSchema } from "@/schemas/heroContent";
import { contentService } from "@/lib/content/content.service";

import { FORM_COMPONENTS } from "./config-admin-forms";

export type AdminPageParams = {
  locale: Locale;
  sidebar: string;
  subsidebar: string;
};
interface PageProps {
  params: Promise<AdminPageParams>;
}

export default async function AdminPage({ params }: PageProps) {
  const { subsidebar } = await params;

  const [contentUk, contentEn] = await Promise.all([
    contentService.get({ locale: "uk", schema: heroContentSchema, section: SECTION_KEYS.HERO }),
    contentService.get({ locale: "en", schema: heroContentSchema, section: SECTION_KEYS.HERO }),
  ]);

  const SelectedForm = FORM_COMPONENTS[subsidebar];

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Редагування: {subsidebar}</h1>

      {SelectedForm && (
        <SelectedForm
          data={{
            uk: contentUk,
            en: contentEn,
          }}
        />
      )}
    </div>
  );
}
