import { getAllSubdivisions } from "@/actions/subdivisions";
import { SubdivisionsListSection } from "@/components/admin/subdivisions-section/subdivisions-list-section";

export default async function SubdivisionsListPage() {
  const [subdivisionsUk, subdivisionsEn] = await Promise.all([
    getAllSubdivisions("uk"),
    getAllSubdivisions("en"),
  ]);

  return (
    <div className="px-4 py-6">
      <SubdivisionsListSection
        subdivisionsUk={subdivisionsUk}
        subdivisionsEn={subdivisionsEn}
      />
    </div>
  );
}