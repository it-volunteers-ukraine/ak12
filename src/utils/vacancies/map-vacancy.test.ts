import { VacancyWithLanguage, VacancyMapped } from "@/types/vacancy";
import { mapVacancy } from "@/utils/vacancies/map-vacancy";

const baseVacancy: VacancyWithLanguage = {
  id: "vac-1",
  position: "Stryker driver",
  slug: "stryker-driver",
  description: "Drive the Stryker",
  type: "frontline",
  salary_min: 30000,
  salary_max: 50000,
  is_active: true,
  sort_order: 5,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
  language: { code: "uk" },
};

describe("mapVacancy", () => {
  it("should map all snake_case fields to camelCase equivalents", () => {
    expect(mapVacancy(baseVacancy)).toEqual({
      id: "vac-1",
      position: "Stryker driver",
      slug: "stryker-driver",
      description: "Drive the Stryker",
      type: "frontline",
      salaryMin: 30000,
      salaryMax: 50000,
      isActive: true,
      sortOrder: 5,
      language: { code: "uk" },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it.each<[keyof VacancyWithLanguage, keyof VacancyMapped]>([
    ["salary_max", "salaryMax"],
    ["slug", "slug"],
  ])("should preserve null on the %s → %s field", (sourceField, mappedField) => {
    const mapped = mapVacancy({ ...baseVacancy, [sourceField]: null });

    expect(mapped[mappedField]).toBeNull();
  });

  it("should pass the language object through unchanged", () => {
    const mapped = mapVacancy({ ...baseVacancy, language: { code: "en" } });

    expect(mapped.language).toEqual({ code: "en" });
  });
});
