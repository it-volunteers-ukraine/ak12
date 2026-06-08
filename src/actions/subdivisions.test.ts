import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import {
  getSubdivisions,
  createSubdivision,
  updateSubdivisionsOrder,
  getSubdivisionBySlug,
  getAllSubdivisions,
  updateSubdivision,
  deleteSubdivision,
} from "@/actions/subdivisions";

jest.mock("@/lib/supabase-server", () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const MOCK_LANGUAGE_ID = "lang-1";

const MOCK_SUBDIVISION_ROW = {
  id: "s1",
  name: "Name",
  slug: "slug-1",
  description: "desc",
  site_url: null,
  image_url: { publicId: "p", secureUrl: "https://img" },
  hover_image_url: null,
  hover_name: null,
  hover_description: null,
  is_active: true,
  sort_order: 1,
  updated_at: "2020-01-01",
  language_id: MOCK_LANGUAGE_ID,
};

const MOCK_INSERTED_ROW = {
  id: "s2",
  name: "New",
  slug: "new",
  description: "d",
  site_url: null,
  image_url: null,
  hover_image_url: null,
  hover_name: null,
  hover_description: null,
  is_active: true,
  sort_order: 2,
  updated_at: "2020-01-02",
  language_id: MOCK_LANGUAGE_ID,
};

const MOCK_CREATE_PAYLOAD = {
  name: "New",
  slug: "new",
  description: "d",
  siteUrl: null,
  imageUrl: null,
  hoverImageUrl: null,
  hoverName: null,
  hoverDescription: null,
  isActive: true,
  sortOrder: 2,
  languageCode: "uk" as const,
};

describe("subdivisions actions", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("getSubdivisions", () => {
    it("returns mapped subdivisions for locale", async () => {
      const languageChain = createLanguageChain();
      const subdivisionChain = createSubdivisionChain("order", [MOCK_SUBDIVISION_ROW]);

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        switch (table) {
          case "language":
            return languageChain;
          case "subdivision":
            return subdivisionChain;
          default:
            return {} as any;
        }
      });

      const result = await getSubdivisions("uk" as any);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(MOCK_SUBDIVISION_ROW.id);
      expect(result[0].imageUrl).toEqual(MOCK_SUBDIVISION_ROW.image_url);
    });

    it("uses cached language id on second call", async () => {
      const languageChain = createLanguageChain();
      const subdivisionChain = createSubdivisionChain("order", [MOCK_SUBDIVISION_ROW]);

      const fromMock = jest.fn((table: string) => {
        if (table === "language") {
          return languageChain;
        }

        return subdivisionChain;
      });

      (supabaseServer.from as jest.Mock).mockImplementation(fromMock);

      await getSubdivisions("en" as any);
      await getSubdivisions("en" as any);

      expect(fromMock).toHaveBeenCalledWith("language");

      const languageCalls = fromMock.mock.calls.filter(([table]) => table === "language");

      expect(languageCalls).toHaveLength(1);
    });

    it("handles invalid image fields safely", async () => {
      const languageChain = createLanguageChain();

      const badRow = {
        ...MOCK_SUBDIVISION_ROW,
        image_url: "invalid-json",
        hover_image_url: "invalid-json",
      };

      const subdivisionChain = createSubdivisionChain("order", [badRow]);

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "language") {
          return languageChain;
        }

        return subdivisionChain;
      });

      const result = await getSubdivisions("uk" as any);

      expect(result[0].imageUrl).toBeNull();
      expect(result[0].hoverImageUrl).toBeNull();
    });

    it("throws error when subdivision query fails", async () => {
      const languageChain = createLanguageChain();
      const subdivisionChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: "DB Error" } }),
      };

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "language") {
          return languageChain;
        }

        return subdivisionChain;
      });

      await expect(getSubdivisions("uk" as any)).rejects.toThrow("Failed to load subdivisions for uk: DB Error");
    });
  });

  describe("createSubdivision", () => {
    it("inserts and calls revalidatePath", async () => {
      const languageChain = createLanguageChain();
      const insertChain: any = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: MOCK_INSERTED_ROW, error: null }),
      };

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        switch (table) {
          case "language":
            return languageChain;
          case "subdivision":
            return insertChain;
          default:
            return {} as any;
        }
      });

      const created = await createSubdivision(MOCK_CREATE_PAYLOAD as any);

      expect(created.id).toBe(MOCK_INSERTED_ROW.id);
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("throws when languageId is missing on create", async () => {
      const languageChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),

        single: jest.fn().mockResolvedValue({ data: null, error: { message: "Language row not found" } }),
      };

      (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "language") {
          return languageChain;
        }

        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const payloadWithUncachedLocale = {
        ...MOCK_CREATE_PAYLOAD,
        languageCode: "fr" as const,
      };

      await expect(createSubdivision(payloadWithUncachedLocale as any)).rejects.toThrow(/Language not found/);
    });
  });

  describe("updateSubdivisionsOrder", () => {
    it("updates items and calls revalidatePath", async () => {
      const updateResult = Promise.resolve({ error: null });

      (supabaseServer.from as jest.Mock).mockImplementation(() => ({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(updateResult),
        }),
      }));

      await updateSubdivisionsOrder([
        { id: "a", sortOrder: 1 },
        { id: "b", sortOrder: 2 },
      ]);

      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("throws when updateSubdivisionsOrder fails", async () => {
      (supabaseServer.from as jest.Mock).mockImplementation(() => ({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: { message: "fail" },
          }),
        }),
      }));

      await expect(
        updateSubdivisionsOrder([
          { id: "a", sortOrder: 1 },
          { id: "b", sortOrder: 2 },
        ]),
      ).rejects.toThrow();
    });
  });
});

function createLanguageChain(returnData: any = { id: MOCK_LANGUAGE_ID }) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: returnData, error: null }),
  };
}

function createSubdivisionChain(method: "order" | "single", data: any) {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
  };

  chain[method] = jest.fn().mockResolvedValue({ data, error: null });

  return chain;
}

describe("getSubdivisionBySlug", () => {
  it("returns subdivision by slug", async () => {
    const languageChain = createLanguageChain();

    const subdivisionChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: MOCK_SUBDIVISION_ROW,
        error: null,
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }
      if (table === "subdivision") {
        return subdivisionChain;
      }

      return {} as any;
    });

    const result = await getSubdivisionBySlug("slug-1", "uk" as any);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(MOCK_SUBDIVISION_ROW.id);
  });

  it("returns null if not found", async () => {
    const languageChain = createLanguageChain();

    const subdivisionChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }
      if (table === "subdivision") {
        return subdivisionChain;
      }

      return {} as any;
    });

    const result = await getSubdivisionBySlug("missing", "uk" as any);

    expect(result).toBeNull();
  });

  it("returns null when language is missing", async () => {
    const languageChain = createLanguageChain(null);

    const subdivisionChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }

      return subdivisionChain;
    });

    const result = await getSubdivisionBySlug("slug", "uk" as any);

    expect(result).toBeNull();
  });
});

describe("getAllSubdivisions", () => {
  it("returns all subdivisions including inactive", async () => {
    const languageChain = createLanguageChain();

    const subdivisionChain = createSubdivisionChain("order", [MOCK_SUBDIVISION_ROW]);

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }
      if (table === "subdivision") {
        return subdivisionChain;
      }

      return {} as any;
    });

    const result = await getAllSubdivisions("uk" as any);

    expect(result).toHaveLength(1);
  });

  it("throws error when database query fails", async () => {
    const languageChain = createLanguageChain();
    const subdivisionChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: { message: "Fetch All Error" } }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }

      return subdivisionChain;
    });

    await expect(getAllSubdivisions("uk" as any)).rejects.toThrow(
      "Failed to load all subdivisions for uk: Fetch All Error",
    );
  });

  it("returns empty array when language not found", async () => {
    const languageChain = createLanguageChain(null);

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }

      return {} as any;
    });

    const result = await getAllSubdivisions("xx" as any);

    expect(result).toEqual([]);
  });
});

describe("updateSubdivision", () => {
  it("updates subdivision and revalidates", async () => {
    const languageChain = createLanguageChain();

    const updateChain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: MOCK_SUBDIVISION_ROW,
        error: null,
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }
      if (table === "subdivision") {
        return updateChain;
      }

      return {} as any;
    });

    const result = await updateSubdivision("s1", {
      name: "Updated",
    });

    expect(result.id).toBe(MOCK_SUBDIVISION_ROW.id);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws on update error", async () => {
    const languageChain = createLanguageChain();

    const updateChain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "fail" },
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }
      if (table === "subdivision") {
        return updateChain;
      }

      return {} as any;
    });

    await expect(updateSubdivision("s1", { name: "x" })).rejects.toThrow("Failed to update subdivision");
  });

  it("handles empty update payload", async () => {
    const languageChain = createLanguageChain();

    const updateChain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: MOCK_SUBDIVISION_ROW,
        error: null,
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "language") {
        return languageChain;
      }

      return updateChain;
    });

    await updateSubdivision("s1", {});

    expect(updateChain.update).toHaveBeenCalledWith({});
  });

  it("handles a full update payload with all fields", async () => {
    const fullPayload = {
      name: "Updated Name",
      slug: "updated-slug",
      description: "Updated Desc",
      siteUrl: "https://site.com",
      imageUrl: { publicId: "p1", secureUrl: "https://url1" },
      hoverImageUrl: { publicId: "p2", secureUrl: "https://url2" },
      hoverName: "H Name",
      hoverDescription: "H Desc",
      isActive: false,
      sortOrder: 10,
      updatedAt: "2026-01-01",
      languageCode: "uk" as const,
    };

    const updateChain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: MOCK_SUBDIVISION_ROW, error: null }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation(() => updateChain);

    const result = await updateSubdivision("s1", fullPayload as any);

    expect(result.id).toBe(MOCK_SUBDIVISION_ROW.id);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws error when update fails in database", async () => {
    const updateChain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: "Update DB Error" } }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation(() => updateChain);

    await expect(updateSubdivision("s1", { name: "Test" })).rejects.toThrow(
      "Failed to update subdivision s1: Update DB Error",
    );
  });
});

describe("deleteSubdivision", () => {
  it("deletes subdivision and revalidates", async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation(() => deleteChain);

    await deleteSubdivision("s1");

    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws on delete error", async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: { message: "fail" },
      }),
    };

    (supabaseServer.from as jest.Mock).mockImplementation(() => deleteChain);

    await expect(deleteSubdivision("s1")).rejects.toThrow("Failed to delete subdivision s1");
  });
});
