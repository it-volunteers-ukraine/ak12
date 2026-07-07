import { VACANCY_TYPES, DEFAULT_TYPE } from "@/constants/vacancies/filters";

describe("vacancy constants", () => {
  it("VACANCY_TYPES contains correct values", () => {
    expect(VACANCY_TYPES).toEqual(["frontline", "backline"]);
  });

  it("DEFAULT_TYPE should be frontline", () => {
    expect(DEFAULT_TYPE).toBe("frontline");
  });
});
