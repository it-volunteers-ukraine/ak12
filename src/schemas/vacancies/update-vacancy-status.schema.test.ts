import { updateVacancyStatusSchema } from "@/schemas/vacancies/update-vacancy-status.schema";

const UK_ID = "11111111-1111-4111-8111-111111111111";
const EN_ID = "22222222-2222-4222-8222-222222222222";

describe("updateVacancyStatusSchema", () => {
  it.each([
    ["active", true],
    ["inactive", false],
  ])("should accept a payload toggling status to %s", (_label, isActive) => {
    const result = updateVacancyStatusSchema.safeParse({
      ukId: UK_ID,
      enId: EN_ID,
      isActive,
    });

    expect(result.success).toBe(true);
  });
});
