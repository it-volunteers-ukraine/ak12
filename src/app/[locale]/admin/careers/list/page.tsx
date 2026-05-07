
import { getAllVacanciesAdmin } from "@/actions/vacancies/get-all-vacancies-admin.action";
import { VacanciesListSection } from "@/components/admin/vacancies-section/vacancies-list-section";
 
export default async function VacanciesListPage() {
  const { uk, en } = await getAllVacanciesAdmin();

  return (
    <div className="px-4 py-6">
      <VacanciesListSection vacanciesUk={uk} vacanciesEn={en} />
    </div>
  );
}