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

  const createVacancy = (overrides: any = {}) => ({
    id: "id",
    position: "position",
    slug: "slug",
    description: "description",
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
    ...overrides,
  });

  it("returns vacancies grouped by locale", async () => {
    const result = {
      uk: [
        createVacancy({
          id: "uk-id",
          position: "Кухар",
          slug: "kukhar",
          description: "Шукаємо відповідальну людину з досвідом роботи кухарем або профільною освітою.",
          language: { code: "uk" },
        }),
      ],
      en: [
        createVacancy({
          id: "en-id",
          position: "Cook",
          description: "We are looking for a responsible person with cooking experience or relevant education.",
          language: { code: "en" },
        }),
      ],
    };

    (vacancyService.getAllAdmin as jest.Mock).mockResolvedValue(result);

    await expect(getAllVacanciesAdmin()).resolves.toEqual(result);

    expect(vacancyService.getAllAdmin).toHaveBeenCalledTimes(1);
  });
});
