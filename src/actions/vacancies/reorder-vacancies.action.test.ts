/**
 * @jest-environment node
 */
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { ReorderVacanciesDto } from "@/schemas/vacancies/reorder-vacancy.schema";

import { reorderVacancies } from "./reorder-vacancies.action";

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: {
    rpc: jest.fn(),
  },
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    reorder: jest.fn(),
  },
}));

describe("reorderVacancies", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call vacancyService.reorder with correct data when validation passes", async () => {
    const validData: ReorderVacanciesDto = {
      items: [
        {
          ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
          enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
          sortOrder: 70,
        },
      ],
    };

    const result = await reorderVacancies(validData);

    expect(result).toBeUndefined();

    expect(vacancyService.reorder).toHaveBeenCalledTimes(1);
    expect(vacancyService.reorder).toHaveBeenCalledWith(validData);
  });

  it("should return validation errors and not call vacancyService.reorder when validation fails", async () => {
    const invalidData = {
      items: [],
    };

    const result = await reorderVacancies(invalidData);

    expect(vacancyService.reorder).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
