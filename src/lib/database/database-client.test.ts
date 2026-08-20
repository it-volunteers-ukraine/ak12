jest.mock("@/lib/db", () => {
  const client = { from: jest.fn(), rpc: jest.fn() };

  return {
    getDbClient: jest.fn(() => client),
  };
});

import { databaseClient } from "./database-client";

describe("databaseClient", () => {
  it("exports the database client instance", () => {
    expect(databaseClient).toBeDefined();
    expect(databaseClient.from).toBeDefined();
    expect(databaseClient.rpc).toBeDefined();
  });
});
