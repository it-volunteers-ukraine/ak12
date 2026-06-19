import { logger } from "@/lib/logger";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { deleteVacancy } from "@/actions/vacancies/delete-vacancy.action";

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    delete: jest.fn(),
  },
}));

describe("deleteVacancy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes vacancies when data is valid", async () => {
    const payload = {
      ukId: "550e8400-e29b-41d4-a716-446655440000",
      enId: "550e8400-e29b-41d4-a716-446655440001",
    };

    (vacancyService.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(deleteVacancy(payload)).resolves.toBeUndefined();

    expect(vacancyService.delete).toHaveBeenCalledWith(payload);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("returns validation issues when data is invalid", async () => {
    const payload = {
      ukId: "invalid-id",
      enId: "",
    };

    const result = await deleteVacancy(payload);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);

    expect(vacancyService.delete).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      }),
      "Delete vacancy data validation failed",
    );
  });
});
