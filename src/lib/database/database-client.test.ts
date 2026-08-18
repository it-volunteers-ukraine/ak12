import { databaseClient } from "./database-client";

describe("databaseClient", () => {
  it("exports the database client instance", () => {
    expect(databaseClient).toBeDefined();
  });
});
