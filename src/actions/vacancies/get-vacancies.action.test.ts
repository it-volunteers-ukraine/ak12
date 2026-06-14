import { getLocale } from "next-intl/server";

import { getVacancies } from "./get-vacancies.action";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

jest.mock("next-intl/server", () => ({
  getLocale: jest.fn(),
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    getAll: jest.fn(),
  },
}));

describe("getVacancies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns vacancies for current locale", async () => {
    const result = {
      vacancies: [
        {
          id: "1",
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
    };

    (getLocale as jest.Mock).mockResolvedValue("uk");
    (vacancyService.getAll as jest.Mock).mockResolvedValue(result);

    await expect(getVacancies()).resolves.toEqual(result);

    expect(getLocale).toHaveBeenCalledTimes(1);

    expect(vacancyService.getAll).toHaveBeenCalledWith({
      locale: "uk",
    });
  });
});
