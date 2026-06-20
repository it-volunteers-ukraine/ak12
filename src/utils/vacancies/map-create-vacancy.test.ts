import { ActiveLanguage } from "@/types/enum";
import { CreateVacancyDto } from "@/schemas/vacancies/create-vacancy.schema";
import { mapCreateVacancy } from "@/utils/vacancies/map-create-vacancy";
import { logger } from "@/lib/logger";

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

describe("mapCreateVacancy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return two rows", () => {
    expect(mapCreateVacancy(baseDto, langMap)).toHaveLength(2);
  });

  it("should map the ukrainian vacancy correctly", () => {
    const rows = mapCreateVacancy(baseDto, langMap);

    expect(rows[0]).toEqual({
      position: "Інженер",
      slug: expect.any(String),
      description: "Опис ролі інженера у тилу.",
      type: "backline",
      salary_min: 25000,
      salary_max: 40000,
      language_id: "lang-uk-id",
    });
  });

  it("should map the english vacancy correctly", () => {
    const rows = mapCreateVacancy(baseDto, langMap);

    expect(rows[1]).toEqual({
      position: "Engineer",
      slug: "engineer",
      description: "Backline engineer role description.",
      type: "backline",
      salary_min: 25000,
      salary_max: 40000,
      language_id: "lang-en-id",
    });
  });

  it("should default missing salaryMax to null on both rows", () => {
    const rows = mapCreateVacancy(
      {
        ...baseDto,
        salaryMax: undefined,
      },
      langMap,
    );

    expect(rows[0].salary_max).toBeNull();
    expect(rows[1].salary_max).toBeNull();
  });

  it("should log and throw when uk language id is missing", () => {
    const invalidLangMap = {
      uk: "",
      en: "lang-en-id",
    } as Record<ActiveLanguage, string>;

    expect(() => mapCreateVacancy(baseDto, invalidLangMap)).toThrow(
      "Missing language IDs for required locales: en, uk",
    );

    expect(logger.error).toHaveBeenCalledWith("Missing language IDs for required locales: en, uk");
  });

  it("should log and throw when en language id is missing", () => {
    const invalidLangMap = {
      uk: "lang-uk-id",
      en: "",
    } as Record<ActiveLanguage, string>;

    expect(() => mapCreateVacancy(baseDto, invalidLangMap)).toThrow(
      "Missing language IDs for required locales: en, uk",
    );

    expect(logger.error).toHaveBeenCalledWith("Missing language IDs for required locales: en, uk");
  });
});
