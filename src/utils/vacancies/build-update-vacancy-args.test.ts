import { buildUpdateVacancyArgs } from "@/utils/vacancies/build-update-vacancy-args";
import { UpdateVacancyDto } from "@/schemas/vacancies/update-vacancy.schema";

const baseDto: UpdateVacancyDto = {
  ukId: "11111111-1111-4111-8111-111111111111",
  enId: "22222222-2222-4222-8222-222222222222",
  type: "frontline",
  salaryMin: 30000,
  salaryMax: 60000,
  uk: {
    position: "Стрілець",
    description: "Український опис вакансії стрільця.",
    slug: "strilets",
  },
  en: {
    position: "Rifleman",
    description: "English description for the rifleman role.",
    slug: "rifleman",
  },
};

describe("buildUpdateVacancyArgs", () => {
  it("should map the DTO to a snake_case payload", () => {
    expect(buildUpdateVacancyArgs(baseDto)).toEqual({
      payload: {
        uk_id: baseDto.ukId,
        en_id: baseDto.enId,
        type: "frontline",
        salary_min: 30000,
        salary_max: 60000,
        uk: {
          position: "Стрілець",
          description: "Український опис вакансії стрільця.",
          slug: "strilets",
        },
        en: {
          position: "Rifleman",
          description: "English description for the rifleman role.",
          slug: "rifleman",
        },
      },
    });
  });

  it("should pass through ids without modification", () => {
    const result = buildUpdateVacancyArgs(baseDto);

    expect(result.payload.uk_id).toBe(baseDto.ukId);
    expect(result.payload.en_id).toBe(baseDto.enId);
  });

  it("should default missing salaryMax to null", () => {
    const dtoWithoutMax: UpdateVacancyDto = { ...baseDto, salaryMax: undefined };
    const result = buildUpdateVacancyArgs(dtoWithoutMax);

    expect(result.payload.salary_max).toBeNull();
  });

  it("should keep the uk and en blocks structurally identical to the DTO", () => {
    const result = buildUpdateVacancyArgs(baseDto);

    expect(result.payload.uk).toEqual(baseDto.uk);
    expect(result.payload.en).toEqual(baseDto.en);
  });
});
