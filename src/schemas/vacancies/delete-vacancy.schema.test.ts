import { deleteVacancySchema } from "./delete-vacancy.schema";

describe("deleteVacancySchema", () => {
  it("should accept a valid pair of uuids", () => {
    const result = deleteVacancySchema.safeParse({
      ukId: "11111111-1111-4111-8111-111111111111",
      enId: "22222222-2222-4222-8222-222222222222",
    });

    expect(result.success).toBe(true);
  });
});
