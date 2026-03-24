import { getVacancies } from "@/actions/vacancies/getVacancies";

export async function VacanciesSection() {
  const { data, count } = await getVacancies();

  return (
    <section>
      <h2>Vacancies</h2>

      <p>Total: {count}</p>

      <ul>
        {data.map((v) => (
          <li key={v.id}>{v.position}</li>
        ))}
      </ul>
    </section>
  );
}
