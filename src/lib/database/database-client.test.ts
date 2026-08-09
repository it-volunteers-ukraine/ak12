/**
 * @jest-environment node
 */
const mockGetDbClient = jest.fn();

jest.mock("@/lib/db", () => ({
  getDbClient: mockGetDbClient,
}));

type MockDatabaseClient = {
  from: jest.Mock;
  rpc: jest.Mock;
};

describe("databaseClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockGetDbClient.mockReturnValue({
      from: jest.fn(),
      rpc: jest.fn(),
    });
  });

  const getDatabaseClient = (): MockDatabaseClient => {
    return require("./database-client").databaseClient;
  };

  it("should export a database client object", () => {
    const databaseClient = getDatabaseClient();

    expect(databaseClient).toBeDefined();
    expect(typeof databaseClient).toBe("object");
  });

  it("should have from method for table queries", () => {
    const databaseClient = getDatabaseClient();

    expect(typeof databaseClient.from).toBe("function");
  });

  it("should have rpc method for calling stored procedures", () => {
    const databaseClient = getDatabaseClient();

    expect(typeof databaseClient.rpc).toBe("function");
  });

  it("should use getDbClient to initialize the client", () => {
    const databaseClient = getDatabaseClient();

    expect(databaseClient).toBeDefined();
    expect(mockGetDbClient).toHaveBeenCalledTimes(1);
  });

  it("should return a client that implements DatabaseClient interface", () => {
    const mockFromFn = jest.fn();
    const mockRpcFn = jest.fn();

    mockGetDbClient.mockReturnValue({
      from: mockFromFn,
      rpc: mockRpcFn,
    });

    const databaseClient = getDatabaseClient();

    expect(typeof databaseClient.from).toBe("function");
    expect(typeof databaseClient.rpc).toBe("function");

    const mockTable = {
      select: jest.fn(),
    };

    mockFromFn.mockReturnValue(mockTable);

    const result = databaseClient.from("users");

    expect(mockFromFn).toHaveBeenCalledWith("users");
    expect(result).toBe(mockTable);
  });
});
