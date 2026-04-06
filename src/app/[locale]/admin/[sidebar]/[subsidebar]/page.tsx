import { Locale } from "@/types";
import { contentService } from "@/lib/content/content.service";

import { SectionDataMap, FORM_COMPONENTS, TAdminFormComponent, ADMIN_SECTIONS_CONFIG } from "./config-admin-forms";

export type AdminPageParams = {
  locale: Locale;
  sidebar: string;
  subsidebar: string;
};
interface PageProps {
  params: Promise<{
    subsidebar: string;
  }>;
}
export type AdminSectionKey = keyof typeof ADMIN_SECTIONS_CONFIG;

export default async function AdminPage({ params }: PageProps) {
  const { subsidebar } = await params;

  const sectionKey = subsidebar as AdminSectionKey;

  const config = ADMIN_SECTIONS_CONFIG[sectionKey];

  if (!config) {
    return <div className="p-8 text-red-500">Секцію "{subsidebar}" не знайдено</div>;
  }

  const [contentUk, contentEn] = await Promise.all([
    contentService.get({
      locale: "uk",
      schema: config.schema,
      section: config.sectionKey,
    }),
    contentService.get({
      locale: "en",
      schema: config.schema,
      section: config.sectionKey,
    }),
  ]);

  if (!contentUk || !contentEn) {
    return <div>Дані для секції {subsidebar} відсутні або ще не створені.</div>;
  }

  const Component = FORM_COMPONENTS[sectionKey] as TAdminFormComponent<typeof sectionKey>;

  const data = { uk: contentUk, en: contentEn } as {
    uk: SectionDataMap[typeof sectionKey];
    en: SectionDataMap[typeof sectionKey];
  };

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Редагування: {subsidebar}</h1>
      {Component && <Component data={data} />}
    </div>
  );
}
