import { contentService } from "@/lib/content/content.service";
import { getAdminSectionConfig } from "@/lib/admin/admin-config";
import { AdminDataMap, AdminSectionKey, isAdminSectionKey } from "@/lib/admin/admin-types";

interface PageProps {
  params: Promise<{
    subsidebar: string;
  }>;
}

async function renderAdminSection<K extends AdminSectionKey>(sectionKey: K, subsidebar: string) {
  const config = getAdminSectionConfig(sectionKey);

  const [contentUk, contentEn] = (await Promise.all([
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
  ])) as [AdminDataMap[K]["uk"] | null, AdminDataMap[K]["en"] | null];

  if (!contentUk || !contentEn) {
    return <div>Дані для секції {subsidebar} відсутні або ще не створені.</div>;
  }

  const Component = config.component;
  const data = { uk: contentUk, en: contentEn } as AdminDataMap[K];

  return (
    <div className="px-4 py-6">
      <Component data={data} />
    </div>
  );
}

export default async function AdminPage({ params }: PageProps) {
  const { subsidebar } = await params;

  if (!isAdminSectionKey(subsidebar)) {
    return <div className="p-8 text-red-500">Секцію "{subsidebar}" не знайдено</div>;
  }

  return renderAdminSection(subsidebar, subsidebar);
}
