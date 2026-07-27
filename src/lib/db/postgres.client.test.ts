const mockQuery = jest.fn();
const mockEnd = jest.fn();

jest.mock("pg", () => {
  return {
    Pool: jest.fn().mockImplementation(() => {
      return {
        query: mockQuery,
        end: mockEnd,
      };
    }),
  };
});

describe("PostgresClient postgres.client.ts unit tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReset();
    mockEnd.mockReset();
    // Restore originalEnv for tests that don't explicitly set env vars
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Pool Initialization", () => {
    it("should return error if POSTGRES_USER or POSTGRES_PASSWORD are not set", async () => {
      await jest.isolateModulesAsync(async () => {
        // Explicitly delete properties from process.env for this isolated test
        delete process.env.POSTGRES_HOST;
        delete process.env.POSTGRES_PORT;
        delete process.env.POSTGRES_USER;
        delete process.env.POSTGRES_PASSWORD;
        delete process.env.POSTGRES_DB;

        const { postgresClient } = require("./postgres.client");

        const { data, error } = await postgresClient.from("users").select().execute();

        expect(data).toEqual([]);
        expect(error).toEqual(new Error("POSTGRES_USER and POSTGRES_PASSWORD must be set in production"));
      });
    });

    it("should initialize Pool with custom environment variables", () => {
      jest.isolateModules(() => {
        jest.resetModules(); // Clear module cache for this isolated test

        process.env.POSTGRES_HOST = "custom-host";
        process.env.POSTGRES_PORT = "9999";
        process.env.POSTGRES_USER = "custom-user";
        process.env.POSTGRES_PASSWORD = "custom-password";
        process.env.POSTGRES_DB = "custom-db";

        const { postgresClient } = require("./postgres.client");

        postgresClient.from("users").select().execute();

        const { Pool } = require("pg");

        expect(Pool).toHaveBeenCalledWith({
          host: "custom-host",
          port: 9999,
          user: "custom-user",
          password: "custom-password",
          database: "custom-db",
        });
      });
    });
  });

  describe("Select Queries", () => {
    const selectTestCases = [
      {
        name: "default select *",
        query: (client: any) => client.from("users").select(),
        expectedSql: "SELECT * FROM users",
        expectedParams: [],
      },
      {
        name: "select specific columns",
        query: (client: any) => client.from("users").select("id, name, email"),
        expectedSql: "SELECT id, name, email FROM users",
        expectedParams: [],
      },
      {
        name: "eq condition",
        query: (client: any) => client.from("users").select().eq("id", 42),
        expectedSql: "SELECT * FROM users WHERE id = $1",
        expectedParams: [42],
      },
      {
        name: "neq condition",
        query: (client: any) => client.from("users").select().neq("role", "admin"),
        expectedSql: "SELECT * FROM users WHERE role != $1",
        expectedParams: ["admin"],
      },
      {
        name: "in condition",
        query: (client: any) => client.from("users").select().in("role", ["admin", "editor"]),
        expectedSql: "SELECT * FROM users WHERE role IN ($1, $2)",
        expectedParams: ["admin", "editor"],
      },
      {
        name: "multiple conditions",
        query: (client: any) => client.from("users").select().eq("active", true).neq("id", 1),
        expectedSql: "SELECT * FROM users WHERE active = $1 AND id != $2",
        expectedParams: [true, 1],
      },
      {
        name: "order by ascending",
        query: (client: any) => client.from("users").select().order("created_at", { ascending: true }),
        expectedSql: "SELECT * FROM users ORDER BY created_at ASC",
        expectedParams: [],
      },
      {
        name: "order by descending",
        query: (client: any) => client.from("users").select().order("created_at", { ascending: false }),
        expectedSql: "SELECT * FROM users ORDER BY created_at DESC",
        expectedParams: [],
      },
      {
        name: "limit",
        query: (client: any) => client.from("users").select().limit(10),
        expectedSql: "SELECT * FROM users LIMIT 10",
        expectedParams: [],
      },
      {
        name: "combined filter, order and limit",
        query: (client: any) =>
          client.from("users").select().eq("status", "active").order("name", { ascending: true }).limit(5),
        expectedSql: "SELECT * FROM users WHERE status = $1 ORDER BY name ASC LIMIT 5",
        expectedParams: ["active"],
      },
      {
        name: "Supabase-style inner join relation select",
        query: (client: any) =>
          client
            .from("vacancy")
            .select("*, language:language_id!inner(code)")
            .eq("is_active", true)
            .eq("language.code", "en")
            .order("sort_order", { ascending: true }),
        expectedSql:
          "SELECT vacancy.*, jsonb_build_object('code', language.code) as language FROM vacancy INNER JOIN language ON vacancy.language_id = language.id WHERE vacancy.is_active = $1 AND language.code = $2 ORDER BY vacancy.sort_order ASC",
        expectedParams: [true, "en"],
      },
      {
        name: "Supabase-style left join relation select without alias",
        query: (client: any) => client.from("vacancy").select("id, language_id(code, name)").eq("id", "some-uuid"),
        expectedSql:
          "SELECT vacancy.id, jsonb_build_object('code', language.code, 'name', language.name) as language_id FROM vacancy LEFT JOIN language ON vacancy.language_id = language.id WHERE vacancy.id = $1",
        expectedParams: ["some-uuid"],
      },
    ];

    test.each(selectTestCases)("$name", async ({ query, expectedSql, expectedParams }) => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "Alice" }] });
        const { data, error } = await query(postgresClient).execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1, name: "Alice" }]);
        expect(mockQuery).toHaveBeenCalledWith(expectedSql, expectedParams);
      });
    });

    it("should handle error in execute", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const dbError = new Error("Database select failure");

        mockQuery.mockRejectedValue(dbError);

        const { data, error } = await postgresClient.from("users").select().execute();

        expect(data).toEqual([]);
        expect(error).toBe(dbError);
      });
    });

    describe("maybeSingle", () => {
      it("should return data as null if no rows are found", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");

          mockQuery.mockResolvedValue({ rows: [] });

          const { data, error } = await postgresClient.from("users").select().eq("id", 1).maybeSingle();

          expect(error).toBeNull();
          expect(data).toBeNull();
          expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [1]);
        });
      });

      it("should return data as single row if row is found", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");

          mockQuery.mockResolvedValue({ rows: [{ id: 123, name: "Bob" }] });

          const { data, error } = await postgresClient.from("users").select().eq("id", 123).maybeSingle();

          expect(error).toBeNull();
          expect(data).toEqual({ id: 123, name: "Bob" });
        });
      });

      it("should catch and return database error", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");
          const dbError = new Error("Database query fault");

          mockQuery.mockRejectedValue(dbError);

          const { data, error } = await postgresClient.from("users").select().maybeSingle();

          expect(data).toBeNull();
          expect(error).toBe(dbError);
        });
      });
    });

    describe("single", () => {
      it("should return single row if found", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");

          mockQuery.mockResolvedValue({ rows: [{ id: 456 }] });

          const { data, error } = await postgresClient.from("users").select().eq("id", 456).single();

          expect(error).toBeNull();
          expect(data).toEqual({ id: 456 });
        });
      });

      it("should return null for data and 'No rows found' error if empty", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");

          mockQuery.mockResolvedValue({ rows: [] });

          const { data, error } = await postgresClient.from("users").select().single();

          expect(data).toBeNull();
          expect(error).toEqual(new Error("No rows found"));
        });
      });

      it("should catch and return database error", async () => {
        jest.isolateModules(async () => {
          process.env.POSTGRES_USER = "test-user";
          process.env.POSTGRES_PASSWORD = "test-password";
          const { postgresClient } = require("./postgres.client");
          const dbError = new Error("Connection timed out");

          mockQuery.mockRejectedValue(dbError);

          const { data, error } = await postgresClient.from("users").select().single();

          expect(data).toBeNull();
          expect(error).toBe(dbError);
        });
      });
    });
  });

  describe("Insert Queries", () => {
    it("should build and execute correct single insert", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "Alice" }] });

        const { data, error } = await postgresClient.from("users").insert({ name: "Alice", active: true }).execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1, name: "Alice" }]);
        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO users (name, active) VALUES ($1, $2) RETURNING *", [
          "Alice",
          true,
        ]);
      });
    });

    it("should build and execute correct multiple insert", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

        const { data, error } = await postgresClient
          .from("users")
          .insert([
            { name: "Alice", active: true },
            { name: "Bob", active: false },
          ])
          .execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO users (name, active) VALUES ($1, $2), ($3, $4) RETURNING *", [
          "Alice",
          true,
          "Bob",
          false,
        ]);
      });
    });

    it("should return error if empty array insert", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const { data, error } = await postgresClient.from("users").insert([]).execute();

        expect(data).toEqual([]);
        expect(error).toEqual(new Error("No data to insert"));
      });
    });

    it("should handle insertion database error", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const dbError = new Error("Duplicate key violation");

        mockQuery.mockRejectedValue(dbError);

        const { data, error } = await postgresClient.from("users").insert({ id: 1 }).execute();

        expect(data).toEqual([]);
        expect(error).toBe(dbError);
      });
    });

    it("should insert and return rows via select() with RETURNING *", async () => {
      await jest.isolateModulesAsync(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "Alice" }] });

        const { data, error } = await postgresClient.from("users").insert({ name: "Alice" }).select().single();

        expect(error).toBeNull();
        expect(data).toEqual({ id: 1, name: "Alice" });
        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO users (name) VALUES ($1) RETURNING *", ["Alice"]);
      });
    });

    it("should insert and return specific columns via select(cols)", async () => {
      await jest.isolateModulesAsync(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 7 }] });

        const { data, error } = await postgresClient.from("language").insert({ code: "en" }).select("id").single();

        expect(error).toBeNull();
        expect(data).toEqual({ id: 7 });
        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO language (code) VALUES ($1) RETURNING id", ["en"]);
      });
    });

    it("should insert and return joined relation via select() using a CTE", async () => {
      await jest.isolateModulesAsync(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, language: { code: "en" } }] });

        const { data, error } = await postgresClient
          .from("vacancy")
          .insert({ language_id: "lang-uuid", title: "Dev" })
          .select("*, language:language_id!inner(code)")
          .execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1, language: { code: "en" } }]);
        expect(mockQuery).toHaveBeenCalledWith(
          "WITH _mutation AS (INSERT INTO vacancy (language_id, title) VALUES ($1, $2) RETURNING *) " +
            "SELECT _mutation.*, jsonb_build_object('code', language.code) as language " +
            "FROM _mutation INNER JOIN language ON _mutation.language_id = language.id",
          ["lang-uuid", "Dev"],
        );
      });
    });
  });

  describe("Update Queries", () => {
    it("should update with condition", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "New Name" }] });

        const { data, error } = await postgresClient.from("users").update({ name: "New Name" }).eq("id", 1).execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1, name: "New Name" }]);
        expect(mockQuery).toHaveBeenCalledWith("UPDATE users SET name = $1 WHERE id = $2 RETURNING *", ["New Name", 1]);
      });
    });

    it("should return error if update condition is missing", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const { data, error } = await postgresClient.from("users").update({ name: "New Name" }).execute();

        expect(data).toEqual([]);
        expect(error).toEqual(new Error("Update requires at least one condition"));
      });
    });

    it("should handle update database error", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const dbError = new Error("Deadlock detected");

        mockQuery.mockRejectedValue(dbError);

        const { data, error } = await postgresClient.from("users").update({ active: false }).eq("id", 5).execute();

        expect(data).toEqual([]);
        expect(error).toBe(dbError);
      });
    });

    it("should update and return the affected row via select() with RETURNING *", async () => {
      await jest.isolateModulesAsync(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "New Name" }] });

        const { data, error } = await postgresClient
          .from("users")
          .update({ name: "New Name" })
          .eq("id", 1)
          .select()
          .single();

        expect(error).toBeNull();
        expect(data).toEqual({ id: 1, name: "New Name" });
        expect(mockQuery).toHaveBeenCalledWith("UPDATE users SET name = $1 WHERE id = $2 RETURNING *", ["New Name", 1]);
      });
    });

    it("should return error from select() when update condition is missing", async () => {
      await jest.isolateModulesAsync(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        const { data, error } = await postgresClient.from("users").update({ name: "x" }).select().execute();

        expect(data).toEqual([]);
        expect(error).toEqual(new Error("Update requires at least one condition"));
      });
    });
  });

  describe("Delete Queries", () => {
    it("should delete with condition", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });

        const { data, error } = await postgresClient.from("users").delete().eq("id", 1).execute();

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1 }]);
        expect(mockQuery).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [1]);
      });
    });

    it("should return error if delete condition is missing", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const { data, error } = await postgresClient.from("users").delete().execute();

        expect(data).toEqual([]);
        expect(error).toEqual(new Error("Delete requires at least one condition"));
      });
    });

    it("should handle delete database error", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const dbError = new Error("Foreign key constraint violation");

        mockQuery.mockRejectedValue(dbError);

        const { data, error } = await postgresClient.from("users").delete().eq("id", 5).execute();

        expect(data).toEqual([]);
        expect(error).toBe(dbError);
      });
    });
  });

  describe("RPC Calls", () => {
    it("should execute RPC without arguments", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ count: 100 }] });

        const { data, error } = await postgresClient.rpc("get_user_count");

        expect(error).toBeNull();
        expect(data).toEqual([{ count: 100 }]);
        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM get_user_count()", []);
      });
    });

    it("should execute RPC with arguments", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ id: 1, email: "abc@example.com" }] });

        const { data, error } = await postgresClient.rpc("get_user_by_email", {
          email: "abc@example.com",
          is_staff: true,
        });

        expect(error).toBeNull();
        expect(data).toEqual([{ id: 1, email: "abc@example.com" }]);
        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM get_user_by_email($1, $2)", ["abc@example.com", true]);
      });
    });

    it("should handle RPC database error", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");
        const dbError = new Error("Function does not exist");

        mockQuery.mockRejectedValue(dbError);

        const { data, error } = await postgresClient.rpc("get_missing");

        expect(data).toBeNull();
        expect(error).toBe(dbError);
      });
    });
  });

  describe("Thenable (PromiseLike) Chaining", () => {
    it("should support thenable SelectQuery", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ val: "select" }] });

        const result = await postgresClient.from("table").select();

        expect(result).toEqual({ data: [{ val: "select" }], error: null });
      });
    });

    it("should support thenable InsertQuery", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ val: "insert" }] });

        const result = await postgresClient.from("table").insert({ foo: "bar" });

        expect(result).toEqual({ data: [{ val: "insert" }], error: null });
      });
    });

    it("should support thenable UpdateQuery", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ val: "update" }] });

        const result = await postgresClient.from("table").update({ foo: "bar" }).eq("id", 1);

        expect(result).toEqual({ data: [{ val: "update" }], error: null });
      });
    });

    it("should support thenable DeleteQuery", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient } = require("./postgres.client");

        mockQuery.mockResolvedValue({ rows: [{ val: "delete" }] });

        const result = await postgresClient.from("table").delete().eq("id", 1);

        expect(result).toEqual({ data: [{ val: "delete" }], error: null });
      });
    });
  });

  describe("Connection Closing", () => {
    it("should call pool.end when closePostgresConnection is invoked", async () => {
      jest.isolateModules(async () => {
        process.env.POSTGRES_USER = "test-user";
        process.env.POSTGRES_PASSWORD = "test-password";
        const { postgresClient, closePostgresConnection } = require("./postgres.client");

        // Trigger pool creation
        await postgresClient.from("users").select().execute();

        await closePostgresConnection();

        expect(mockEnd).toHaveBeenCalled();
      });
    });

    it("should do nothing when closePostgresConnection is invoked and pool is not initialized", async () => {
      // Run inside isolation to ensure pool was never instantiated
      jest.isolateModules(async () => {
        const { closePostgresConnection } = require("./postgres.client");

        await closePostgresConnection();
        expect(mockEnd).not.toHaveBeenCalled();
      });
    });
  });
});