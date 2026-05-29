import { reorderVacanciesSchema } from "./reorder-vacancy.schema";

const UK_ID_A = "11111111-1111-4111-8111-111111111111";
const EN_ID_A = "22222222-2222-4222-8222-222222222222";
const UK_ID_B = "33333333-3333-4333-8333-333333333333";
const EN_ID_B = "44444444-4444-4444-8444-444444444444";

const item = (ukId: string, enId: string, sortOrder: number) => ({ ukId, enId, sortOrder });

describe("reorderVacanciesSchema", () => {
  it("should accept a single-item batch", () => {
    const result = reorderVacanciesSchema.safeParse({
      items: [item(UK_ID_A, EN_ID_A, 0)],
    });

    expect(result.success).toBe(true);
  });

  it("should accept a batch with unique sortOrder values", () => {
    const result = reorderVacanciesSchema.safeParse({
      items: [item(UK_ID_A, EN_ID_A, 0), item(UK_ID_B, EN_ID_B, 1)],
    });

    expect(result.success).toBe(true);
  });
});
