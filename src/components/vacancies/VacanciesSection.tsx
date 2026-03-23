import { getTranslations } from "next-intl/server";

import { getVacancies } from "@/actions/vacancies/getVacancies";

export async function VacanciesSection() {
  const t = await getTranslations("vacancies");
  const { data, count } = await getVacancies();

  return (
    <section>
      <h2>{t("title")}</h2>

      <p>Total: {count}</p>

      <ul>
        {data.map((v) => (
          <li key={v.id}>{v.position}</li>
        ))}
      </ul>
    </section>
  );
}
