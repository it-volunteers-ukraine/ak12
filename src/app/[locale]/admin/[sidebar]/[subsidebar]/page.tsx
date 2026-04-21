import { Locale } from "@/types";
import { ADMIN_CONFIG } from "@/lib/admin/admin-config";
import { contentService } from "@/lib/content/content.service";
import { SectionDataMap, TAdminFormComponent } from "@/lib/admin/admin-types";

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
export type AdminSectionKey = keyof typeof ADMIN_CONFIG;

export default async function AdminPage({ params }: PageProps) {
  const { subsidebar } = await params;

  const sectionKey = subsidebar as AdminSectionKey;

  const config = ADMIN_CONFIG[sectionKey];

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

  const Component = config.component as TAdminFormComponent<AdminSectionKey>;

  const data = { uk: contentUk, en: contentEn } as {
    uk: SectionDataMap[typeof sectionKey];
    en: SectionDataMap[typeof sectionKey];
  };

  return <div className="px-4 py-6">{Component && <Component data={data} />}</div>;
}
