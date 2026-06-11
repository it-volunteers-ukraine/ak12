import { supabaseServer } from "@/lib/supabase-server";
import { vacancyService } from "@/lib/vacancies/vacancy.service";
import { UpdateVacancyStatusDto } from "@/schemas/vacancies/update-vacancy-status.schema";
import { ReorderVacanciesDto } from "@/schemas/vacancies/reorder-vacancy.schema";
import { PostgrestSingleResponse, PostgrestError } from "@supabase/postgrest-js";
import { getLanguageMap } from "@/utils/vacancies/get-language-map";
import { logger } from "@/lib/logger";

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: {
    rpc: jest.fn(),
    from: jest.fn(),
  },
}));

jest.mock("@/utils/vacancies/get-language-map", () => ({
  getLanguageMap: jest.fn(),
}));

jest.mock("transliteration", () => ({
  slugify: (value: string) => value.toLowerCase().replace(/\s+/g, "-"),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockedLogger = jest.mocked(logger);

const UK_ID = "5cb2dac0-1be1-4212-b10f-e9e56fa1c23b";
const EN_ID = "8fae0102-cfc8-4f19-81f7-922f6a724112";

const rawRow = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "vac-1",
  position: "Stryker driver",
  slug: "stryker-driver",
  description: "Drive the Stryker",
  type: "frontline" as const,
  salary_min: 30000,
  salary_max: 50000,
  is_active: true,
  sort_order: 5,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
  language: { code: "uk" as const },
  ...overrides,
});

const mockedSupabase = jest.mocked(supabaseServer);

describe("vacancyService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call updateStatus method with correct data", async () => {
    const validData: UpdateVacancyStatusDto = {
      ukId: UK_ID,
      enId: EN_ID,
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
      ukId: UK_ID,
      enId: EN_ID,
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
          ukId: UK_ID,
          enId: EN_ID,
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
          ukId: UK_ID,
          enId: EN_ID,
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

  it("should fetch active vacancies for the requested locale and return mapped rows", async () => {
    const order = jest.fn().mockResolvedValue({ data: [rawRow()], error: null });
    const eqCode = jest.fn(() => ({ order }));
    const eqActive = jest.fn(() => ({ eq: eqCode }));
    const select = jest.fn(() => ({ eq: eqActive }));

    mockedSupabase.from.mockReturnValue({ select } as never);

    const result = await vacancyService.getAll({ locale: "uk" });

    expect(mockedSupabase.from).toHaveBeenCalledWith("vacancy");
    expect(select).toHaveBeenCalledWith("*, language:language_id!inner(code)");
    expect(eqActive).toHaveBeenCalledWith("is_active", true);
    expect(eqCode).toHaveBeenCalledWith("language.code", "uk");
    expect(order).toHaveBeenCalledWith("sort_order", { ascending: true });

    expect(result.vacancies).toHaveLength(1);
    expect(result.vacancies[0]).toEqual(
      expect.objectContaining({
        id: "vac-1",
        salaryMin: 30000,
        salaryMax: 50000,
        isActive: true,
        sortOrder: 5,
        language: { code: "uk" },
      }),
    );
  });

  it("should default getAll to an empty array when supabase returns null data", async () => {
    const order = jest.fn().mockResolvedValue({ data: null, error: null });

    mockedSupabase.from.mockReturnValue({
      select: () => ({ eq: () => ({ eq: () => ({ order }) }) }),
    } as never);

    const result = await vacancyService.getAll({ locale: "uk" });

    expect(result.vacancies).toEqual([]);
  });

  it("should split admin vacancies by language code", async () => {
    const order = jest.fn().mockResolvedValue({
      data: [rawRow({ id: "uk-1", language: { code: "uk" } }), rawRow({ id: "en-1", language: { code: "en" } })],
      error: null,
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({ order }),
    } as never);

    const result = await vacancyService.getAllAdmin();

    expect(result.uk.map((v) => v.id)).toEqual(["uk-1"]);
    expect(result.en.map((v) => v.id)).toEqual(["en-1"]);
  });

  it("should insert mapped rows and return mapped vacancies on create", async () => {
    (getLanguageMap as jest.Mock).mockResolvedValue({ uk: "lang-uk", en: "lang-en" });

    const select = jest.fn().mockResolvedValue({
      data: [
        rawRow({ id: "uk-created", language: { code: "uk" } }),
        rawRow({ id: "en-created", language: { code: "en" } }),
      ],
      error: null,
    });
    const insert = jest.fn((_rows: unknown[]) => ({ select }));

    mockedSupabase.from.mockReturnValue({ insert } as never);

    const result = await vacancyService.create({
      type: "backline",
      salaryMin: 25000,
      uk: { position: "Інженер", description: "Опис ролі." },
      en: { position: "Engineer", description: "Description." },
    });

    expect(mockedSupabase.from).toHaveBeenCalledWith("vacancy");

    const [insertedRows] = insert.mock.calls[0];

    expect(insertedRows).toHaveLength(2);
    expect(insertedRows[0]).toEqual(
      expect.objectContaining({
        position: "Інженер",
        type: "backline",
        salary_min: 25000,
        salary_max: null,
        language_id: "lang-uk",
      }),
    );
    expect(insertedRows[1]).toEqual(
      expect.objectContaining({
        position: "Engineer",
        slug: "engineer",
        language_id: "lang-en",
      }),
    );

    expect(result.map((v) => v.id)).toEqual(["uk-created", "en-created"]);
  });

  it("should call update_vacancy_atomic RPC with the snake_case payload on update", async () => {
    mockedSupabase.rpc.mockResolvedValue({
      data: [rawRow({ id: "uk-updated", language: { code: "uk" } })],
      error: null,
    } as never);

    const result = await vacancyService.update({
      ukId: UK_ID,
      enId: EN_ID,
      type: "frontline",
      salaryMin: 30000,
      salaryMax: 60000,
      uk: { position: "Стрілець", description: "Опис.", slug: "strilets" },
      en: { position: "Rifleman", description: "Description.", slug: "rifleman" },
    });

    expect(mockedSupabase.rpc).toHaveBeenCalledWith(
      "update_vacancy_atomic",
      expect.objectContaining({
        payload: expect.objectContaining({
          uk_id: UK_ID,
          en_id: EN_ID,
          salary_min: 30000,
          salary_max: 60000,
        }),
      }),
    );
    expect(result[0].id).toBe("uk-updated");
  });

  it("should call delete_vacancy_atomic RPC with snake_case ids on delete", async () => {
    mockedSupabase.rpc.mockResolvedValue({ data: null, error: null } as never);

    await vacancyService.delete({
      ukId: UK_ID,
      enId: EN_ID,
    });

    expect(mockedSupabase.rpc).toHaveBeenCalledWith("delete_vacancy_atomic", {
      uk_id: UK_ID,
      en_id: EN_ID,
    });
  });

  it("should throw error when getAll fails", async () => {
    mockedSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "DB error" },
            }),
          }),
        }),
      }),
    } as never);

    await expect(vacancyService.getAll({ locale: "uk" })).rejects.toThrow("DB error");
  });

  it("should throw error in getAllAdmin", async () => {
    mockedSupabase.from.mockReturnValue({
      select: () => ({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "fail admin" },
        }),
      }),
    } as never);

    await expect(vacancyService.getAllAdmin()).rejects.toThrow("fail admin");
  });

  it("should throw error on create vacancy failure", async () => {
    (getLanguageMap as jest.Mock).mockResolvedValue({ uk: "uk", en: "en" });

    mockedSupabase.from.mockReturnValue({
      insert: () => ({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "insert failed" },
        }),
      }),
    } as never);

    await expect(
      vacancyService.create({
        type: "backline",
        salaryMin: 1000,
        uk: { position: "A", description: "B" },
        en: { position: "C", description: "D" },
      }),
    ).rejects.toThrow("insert failed");
  });

  it("should throw error on update failure", async () => {
    mockedSupabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "rpc failed" },
    } as never);

    await expect(
      vacancyService.update({
        ukId: UK_ID,
        enId: EN_ID,
        type: "frontline",
        salaryMin: 1,
        uk: { position: "x", description: "x", slug: "x" },
        en: { position: "y", description: "y", slug: "y" },
      }),
    ).rejects.toThrow("rpc failed");
  });

  it("should throw error on delete failure", async () => {
    mockedSupabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "delete failed" },
    } as never);

    await expect(
      vacancyService.delete({
        ukId: UK_ID,
        enId: EN_ID,
      }),
    ).rejects.toThrow("delete failed");
  });

  it("should throw error on reorder failure", async () => {
    const validData: ReorderVacanciesDto = {
      items: [
        {
          ukId: UK_ID,
          enId: EN_ID,
          sortOrder: 1,
        },
      ],
    };

    mockedSupabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "reorder failed" },
    } as never);

    await expect(vacancyService.reorder(validData)).rejects.toThrow("reorder failed");
  });

  it("should call logger.error when updateStatus fails", async () => {
    const validData: UpdateVacancyStatusDto = {
      ukId: UK_ID,
      enId: EN_ID,
      isActive: true,
    };

    mockedSupabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "status failed" },
    } as never);

    await expect(vacancyService.updateStatus(validData)).rejects.toThrow("status failed");

    expect(mockedLogger.error).toHaveBeenCalled();
  });

  it("should handle undefined data in getAllAdmin", async () => {
    const order = jest.fn().mockResolvedValue({
      data: undefined,
      error: null,
    });

    mockedSupabase.from.mockReturnValue({
      select: () => ({ order }),
    } as never);

    const result = await vacancyService.getAllAdmin();

    expect(result.uk).toEqual([]);
    expect(result.en).toEqual([]);
  });
});
