import { getAllSubdivisions } from "@/actions/subdivisions/subdivisions.action";
import { SubdivisionsListSection } from "@/components/admin/subdivisions-section/subdivisions-list-section";

export default async function SubdivisionsListPage() {
  const [subdivisionsUk, subdivisionsEn] = await Promise.all([getAllSubdivisions("uk"), getAllSubdivisions("en")]);

  return (
    <div className="py-6 pr-4">
      <SubdivisionsListSection subdivisionsUk={subdivisionsUk} subdivisionsEn={subdivisionsEn} />
    </div>
  );
}
