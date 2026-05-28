import { mapCreateVacancy } from "./map-create-vacancy";
import { CreateVacancyDto } from "@/schemas/vacancies/create-vacancy.schema";
import { ActiveLanguage } from "@/types/enum";

jest.mock("@/lib/logger", () => ({
  logger: { error: jest.fn() },
}));

jest.mock("transliteration", () => ({
  slugify: (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-"),
}));

const baseDto: CreateVacancyDto = {
  type: "backline",
  salaryMin: 25000,
  salaryMax: 40000,
  uk: {
    position: "Інженер",
    description: "Опис ролі інженера у тилу.",
  },
  en: {
    position: "Engineer",
    description: "Backline engineer role description.",
  },
};

const langMap: Record<ActiveLanguage, string> = {
  uk: "lang-uk-id",
  en: "lang-en-id",
};

const sharedRowFields = {
  type: "backline",
  salary_min: 25000,
  salary_max: 40000,
};

describe("mapCreateVacancy", () => {
  it("should return two rows: one for uk and one for en", () => {
    expect(mapCreateVacancy(baseDto, langMap)).toHaveLength(2);
  });

  it.each([
    {
      label: "uk",
      rowIndex: 0,
      expected: {
        position: "Інженер",
        slug: expect.any(String),
        description: "Опис ролі інженера у тилу.",
        language_id: "lang-uk-id",
        ...sharedRowFields,
      },
    },
    {
      label: "en",
      rowIndex: 1,
      expected: {
        position: "Engineer",
        slug: "engineer",
        description: "Backline engineer role description.",
        language_id: "lang-en-id",
        ...sharedRowFields,
      },
    },
  ])("should map the $label row with the corresponding language id and slugified position", ({ rowIndex, expected }) => {
    const rows = mapCreateVacancy(baseDto, langMap);

    expect(rows[rowIndex]).toEqual(expected);
  });

  it("should default missing salaryMax to null on both rows", () => {
    const rows = mapCreateVacancy({ ...baseDto, salaryMax: undefined }, langMap);

    expect(rows[0].salary_max).toBeNull();
    expect(rows[1].salary_max).toBeNull();
  });
});
