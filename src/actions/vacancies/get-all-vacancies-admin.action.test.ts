import { getAllVacanciesAdmin } from "./get-all-vacancies-admin.action";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    getAllAdmin: jest.fn(),
  },
}));

describe("getAllVacanciesAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns vacancies grouped by locale", async () => {
    const result = {
      uk: [
        {
          id: "uk-id",
          position: "Кухар",
          slug: "kukhar",
          description: "Шукаємо відповідальну людину з досвідом роботи кухарем або профільною освітою.",
          type: "frontline",
          salaryMin: 23000,
          salaryMax: 100000,
          isActive: true,
          sortOrder: 10,
          language: {
            code: "uk",
          },
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      en: [
        {
          id: "en-id",
          position: "Cook",
          slug: "kukhar",
          description: "We are looking for a responsible person with cooking experience or relevant education.",
          type: "frontline",
          salaryMin: 23000,
          salaryMax: 100000,
          isActive: true,
          sortOrder: 10,
          language: {
            code: "en",
          },
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    };

    (vacancyService.getAllAdmin as jest.Mock).mockResolvedValue(result);

    await expect(getAllVacanciesAdmin()).resolves.toEqual(result);

    expect(vacancyService.getAllAdmin).toHaveBeenCalledTimes(1);
  });
});
