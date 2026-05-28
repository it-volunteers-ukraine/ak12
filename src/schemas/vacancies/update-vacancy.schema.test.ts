import { updateVacancySchema } from "./update-vacancy.schema";

const validInput = {
  ukId: "11111111-1111-4111-8111-111111111111",
  enId: "22222222-2222-4222-8222-222222222222",
  type: "frontline" as const,
  salaryMin: 30000,
  salaryMax: 60000,
  uk: {
    position: "Стрілець",
    description: "Опис обовʼязків стрільця у бойовому підрозділі.",
    slug: "strilets",
  },
  en: {
    position: "Rifleman",
    description: "Description of the rifleman duties in a combat unit.",
    slug: "rifleman",
  },
};

describe("updateVacancySchema", () => {
  it("should accept a fully populated valid payload with slugs", () => {
    const result = updateVacancySchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("should trim slug whitespace", () => {
    const result = updateVacancySchema.safeParse({
      ...validInput,
      uk: { ...validInput.uk, slug: "  strilets  " },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.uk.slug).toBe("strilets");
    }
  });
});
