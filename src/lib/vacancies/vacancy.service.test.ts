/**
 * @jest-environment node
 */
import { supabaseServer } from "@/lib/supabase-server";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { UpdateVacancyStatusDto } from "@/schemas/vacancies/update-vacancy-status.schema";
import { ReorderVacanciesDto } from "@/schemas/vacancies/reorder-vacancy.schema";
import { PostgrestSingleResponse, PostgrestError } from "@supabase/postgrest-js";

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: {
    rpc: jest.fn(),
  },
}));

const mockedSupabase = jest.mocked(supabaseServer);

describe("vacancyService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call updateStatus method with correct data", async () => {
    const validData: UpdateVacancyStatusDto = {
      ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
      enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
      isActive: true,
    };

    const mockSuccessResponse: PostgrestSingleResponse<null> = {
      success: true,
      error: null,
      data: null,
      count: null,
      status: 204,
      statusText: "No Content",
    };

    mockedSupabase.rpc.mockResolvedValue(mockSuccessResponse);

    await vacancyService.updateStatus(validData);

    expect(mockedSupabase.rpc).toHaveBeenCalledTimes(1);
    expect(mockedSupabase.rpc).toHaveBeenCalledWith("update_vacancy_status_atomic", {
      uk_id: validData.ukId,
      en_id: validData.enId,
      new_status: validData.isActive,
    });
  });

  it("should throw error if fails to update status of vacancies", async () => {
    const validData: UpdateVacancyStatusDto = {
      ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
      enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
      isActive: true,
    };

    const mockFailureResponse: PostgrestSingleResponse<null> = {
      success: false,
      error: new PostgrestError({
        message: "Only one vacancy found, expected two",
        details: "",
        hint: "",
        code: "P0001",
      }),
      data: null,
      count: null,
      status: 404,
      statusText: "Not Found",
    };

    mockedSupabase.rpc.mockResolvedValue(mockFailureResponse);

    const { error } = mockFailureResponse;

    await expect(vacancyService.updateStatus(validData)).rejects.toThrow(error.message);

    expect(mockedSupabase.rpc).toHaveBeenCalledTimes(1);
    expect(mockedSupabase.rpc).toHaveBeenCalledWith("update_vacancy_status_atomic", {
      uk_id: validData.ukId,
      en_id: validData.enId,
      new_status: validData.isActive,
    });
  });

  it("should call reorder method with correct data", async () => {
    const validData: ReorderVacanciesDto = {
      items: [
        {
          ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
          enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
          sortOrder: 1,
        },
      ],
    };

    const mockSuccessResponse: PostgrestSingleResponse<null> = {
      success: true,
      error: null,
      data: null,
      count: null,
      status: 204,
      statusText: "No Content",
    };

    mockedSupabase.rpc.mockResolvedValue(mockSuccessResponse);

    await vacancyService.reorder(validData);

    expect(mockedSupabase.rpc).toHaveBeenCalledTimes(1);
    expect(mockedSupabase.rpc).toHaveBeenCalledWith("reorder_vacancies_atomic", {
      payload: validData,
    });
  });

  it("should throw error if fails to reorder vacancies", async () => {
    const validData: ReorderVacanciesDto = {
      items: [
        {
          ukId: "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b",
          enId: "8fae0102-cfc8-4f19-81f7-922f6a724112",
          sortOrder: 1,
        },
      ],
    };

    const mockFailureResponse: PostgrestSingleResponse<null> = {
      success: false,
      error: new PostgrestError({
        message: "Some vacancy ids not found",
        details: "",
        hint: "",
        code: "P0001",
      }),
      data: null,
      count: null,
      status: 404,
      statusText: "Not Found",
    };

    mockedSupabase.rpc.mockResolvedValue(mockFailureResponse);

    const { error } = mockFailureResponse;

    await expect(vacancyService.reorder(validData)).rejects.toThrow(error.message);

    expect(mockedSupabase.rpc).toHaveBeenCalledTimes(1);
    expect(mockedSupabase.rpc).toHaveBeenCalledWith("reorder_vacancies_atomic", {
      payload: validData,
    });
  });
});
