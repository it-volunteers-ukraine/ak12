import { createVacancySchema } from "./create-vacancy.schema";

const validInput = {
  type: "frontline" as const,
  salaryMin: 30000,
  salaryMax: 60000,
  uk: {
    position: "Стрілець",
    description: "Опис обовʼязків стрільця у бойовому підрозділі.",
  },
  en: {
    position: "Rifleman",
    description: "Description of the rifleman duties in a combat unit.",
  },
};

describe("createVacancySchema", () => {
  it("should accept a fully populated valid payload", () => {
    const result = createVacancySchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("should accept omitted salaryMax", () => {
    const { salaryMax: _, ...rest } = validInput;
    const result = createVacancySchema.safeParse(rest);

    expect(result.success).toBe(true);
  });

  it("should accept the backline vacancy type", () => {
    const result = createVacancySchema.safeParse({ ...validInput, type: "backline" });

    expect(result.success).toBe(true);
  });

  it("should trim whitespace around uk and en text fields", () => {
    const result = createVacancySchema.safeParse({
      ...validInput,
      uk: { position: "  Стрілець  ", description: "  Опис обовʼязків стрільця у бойовому підрозділі.  " },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.uk.position).toBe("Стрілець");
      expect(result.data.uk.description).toBe("Опис обовʼязків стрільця у бойовому підрозділі.");
    }
  });
});
