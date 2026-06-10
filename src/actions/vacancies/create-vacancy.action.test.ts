import { createVacancy } from "./create-vacancy.action";
import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    create: jest.fn(),
  },
}));

describe("createVacancy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates vacancies when data is valid", async () => {
    const payload = {
      type: "frontline",
      salaryMin: 23000,
      salaryMax: 100000,
      uk: {
        position: "Кухар",
        description: "Шукаємо відповідальну людину з досвідом роботи кухарем або профільною освітою.",
      },
      en: {
        position: "Cook",
        description: "We are looking for a responsible person with cooking experience or relevant education.",
      },
    };

    const created = [
      {
        id: "uk-id",
        position: "Кухар",
        slug: null,
        description: payload.uk.description,
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
      {
        id: "en-id",
        position: "Cook",
        slug: null,
        description: payload.en.description,
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
    ];

    (vacancyService.create as jest.Mock).mockResolvedValue(created);

    await expect(createVacancy(payload)).resolves.toEqual(created);

    expect(vacancyService.create).toHaveBeenCalledWith(payload);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("returns validation issues when data is invalid", async () => {
    const payload = {
      type: "invalid",
      salaryMin: -1,
      uk: {
        position: "A",
        description: "short",
      },
      en: {
        position: "",
        description: "",
      },
    };

    const result = await createVacancy(payload);

    expect(Array.isArray(result)).toBe(true);

    expect(vacancyService.create).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      }),
      "Create vacancy form validation failed",
    );
  });
});
