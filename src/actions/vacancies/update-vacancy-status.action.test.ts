/**
 * @jest-environment node
 */
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { UpdateVacancyStatusDto } from "@/schemas/vacancies/update-vacancy-status.schema";

import { updateVacancyStatus } from "./update-vacancy-status.action";

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: {
    rpc: jest.fn(),
  },
}));

jest.mock("@/lib/vacancies/vacancy.service", () => ({
  vacancyService: {
    updateStatus: jest.fn(),
  },
}));

describe("updateVacancyStatus", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call vacancyService.updateStatus with correct data when validation passes", async () => {
    const validData: UpdateVacancyStatusDto = {
      ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
      enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
      isActive: true,
    };

    const result = await updateVacancyStatus(validData);

    expect(result).toBeUndefined();

    expect(vacancyService.updateStatus).toHaveBeenCalledTimes(1);
    expect(vacancyService.updateStatus).toHaveBeenCalledWith(validData);
  });

  it("should return validation errors and not call vacancyService.updateStatus when validation fails", async () => {
    const invalidData = {
      ukId: null,
    };

    const result = await updateVacancyStatus(invalidData);

    expect(vacancyService.updateStatus).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
