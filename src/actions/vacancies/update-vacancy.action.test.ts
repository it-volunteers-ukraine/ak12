import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { updateVacancy } from "@/actions/vacancies/update-vacancy.action";

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    update: jest.fn(),
  },
}));

describe("updateVacancy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call vacancyService.update when data is valid", async () => {
    const data = {
      ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
      enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
      type: "frontline",
      salaryMin: 1000,
      salaryMax: 2000,
      uk: {
        position: "Стрілець",
        description: "Це достатньо довгий опис вакансії більше двадцяти символів.",
        slug: "strilets",
      },
      en: {
        position: "Rifleman",
        description: "This is a sufficiently long vacancy description over twenty characters.",
        slug: "rifleman",
      },
    };

    const expected = [
      {
        id: "1",
        position: "Стрілець",
      },
    ];

    (vacancyService.update as jest.Mock).mockResolvedValue(expected);

    const result = await updateVacancy(data);

    expect(vacancyService.update).toHaveBeenCalledTimes(1);
    expect(vacancyService.update).toHaveBeenCalledWith(data);
    expect(logger.error).not.toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it("should return validation issues when data is invalid", async () => {
    const result = await updateVacancy({});

    expect(vacancyService.update).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.any(Array),
          message: expect.any(String),
        }),
      ]),
    );
  });
});
