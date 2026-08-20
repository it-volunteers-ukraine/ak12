import { Pool } from "pg";
import { serverEnv } from "@/lib/env/server";
import { DatabaseClient, DeleteQuery, InsertQuery, QueryBuilder, SelectQuery, UpdateQuery, RowData, QueryError, QueryValue } from "./types";
import { logger } from "@/lib/logger/logger";

let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    const user = serverEnv.postgres.user;
    const password = serverEnv.postgres.password;

    if (!user || !password) {
      throw new Error("POSTGRES_USER and POSTGRES_PASSWORD must be set in production");
    }

    pool = new Pool({
      host: serverEnv.postgres.host || "localhost",
      port: Number.parseInt(serverEnv.postgres.port || "5432"),
      user,
      password,
      database: serverEnv.postgres.database || "ak12",
    });
    logger.info({
      host: serverEnv.postgres.host || "localhost",
      port: Number.parseInt(serverEnv.postgres.port || "5432"),
      database: serverEnv.postgres.database || "ak12",
    }, "Postgres connection pool initialized");
  }

  return pool;
}

interface Condition {
  column: string;
  value: QueryValue;
}

interface JoinConfig {
  alias: string;
  tableName: string;
  foreignKey: string;
  isInner: boolean;
  columns: string[];
}

function getTableNameFromRelation(relationName: string): string {
  if (relationName.endsWith("_id")) {
    return relationName.slice(0, -3);
  }

  return relationName;
}

/**
 * Splits a select columns string by commas that are outside parentheses.
 * This correctly prevents splitting of nested columns lists (e.g. "language_id(id,code)").
 *
 * @param str The raw select columns string.
 * @returns An array of parsed select-part strings.
 */
function splitColumnsString(str: string): string[] {
  const parts: string[] = [];
  let currentPart = "";
  let parenDepth = 0;

  for (const element of str) {
    const char = element;

    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    }

    if (char === "," && parenDepth === 0) {
      parts.push(currentPart.trim());
      currentPart = "";
    } else {
      currentPart += char;
    }
  }

  if (currentPart.trim().length > 0) {
    parts.push(currentPart.trim());
  }

  return parts;
}

/**
 * Parses a single select columns part string (e.g. "language:language_id!inner(code)")
 * and returns its JoinConfig representation if it contains nested relations.
 *
 * @param part The column selection part string.
 * @returns A JoinConfig object, or null if the part represents a standard column.
 */
function parseSelectPart(part: string): JoinConfig | null {
  const parenStart = part.indexOf("(");

  if (parenStart === -1) {
    return null;
  }

  const parenEnd = part.indexOf(")", parenStart);

  if (parenEnd === -1) {
    return null;
  }

  const nestedColsStr = part.substring(parenStart + 1, parenEnd);
  const nestedCols = nestedColsStr.split(",").map((c) => c.trim());

  let relationPart = part.substring(0, parenStart).trim();
  let isInner = false;

  if (relationPart.endsWith("!inner")) {
    isInner = true;
    relationPart = relationPart.slice(0, -6).trim();
  }

  let alias = relationPart;
  let foreignKey = relationPart;

  const colonIdx = relationPart.indexOf(":");

  if (colonIdx !== -1) {
    alias = relationPart.substring(0, colonIdx).trim();
    foreignKey = relationPart.substring(colonIdx + 1).trim();
  }

  const tableName = getTableNameFromRelation(foreignKey);

  return {
    alias,
    tableName,
    foreignKey,
    isInner,
    columns: nestedCols,
  };
}

/**
 * Parses a Supabase-style select columns string into standard columns and relation joins.
 *
 * @param columns The raw select columns string. Defaults to "*" when omitted.
 * @returns The parsed standard columns and join configurations.
 */
function parseColumns(columns?: string): { standardColumns: string[]; joins: JoinConfig[] } {
  if (!columns || columns === "*") {
    return { standardColumns: ["*"], joins: [] };
  }

  const standardColumns: string[] = [];
  const joins: JoinConfig[] = [];

  for (const part of splitColumnsString(columns)) {
    const joinConfig = parseSelectPart(part);

    if (joinConfig) {
      joins.push(joinConfig);
    } else {
      standardColumns.push(part);
    }
  }

  return { standardColumns, joins };
}

/**
 * Builds the SELECT projection list for a given source (table name or CTE alias),
 * qualifying columns and expanding relation joins into jsonb_build_object expressions.
 */
function buildSelectList(source: string, standardColumns: string[], joins: JoinConfig[]): string {
  const hasJoins = joins.length > 0;
  const selectParts: string[] = [];

  for (const col of standardColumns) {
    if (col === "*") {
      selectParts.push(hasJoins ? `${source}.*` : "*");
    } else {
      selectParts.push(hasJoins ? `${source}.${col}` : col);
    }
  }

  for (const join of joins) {
    const colObjectParts = join.columns.map((col) => `'${col}', ${join.tableName}.${col}`).join(", ");

    selectParts.push(`jsonb_build_object(${colObjectParts}) as ${join.alias}`);
  }

  return selectParts.join(", ");
}

/**
 * Builds the JOIN clause(s) for a given source (table name or CTE alias).
 */
function buildJoinClause(source: string, joins: JoinConfig[]): string {
  let sql = "";

  for (const join of joins) {
    const joinType = join.isInner ? "INNER JOIN" : "LEFT JOIN";

    sql += ` ${joinType} ${join.tableName} ON ${source}.${join.foreignKey} = ${join.tableName}.id`;
  }

  return sql;
}

abstract class BaseConditionQuery<T extends BaseConditionQuery<T>> {
  protected readonly conditions: Condition[] = [];

  protected addCondition(column: string, value: QueryValue): T {
    this.conditions.push({ column, value });

    return this as unknown as T;
  }

  protected buildWhereClause(startParamIndex: number = 1): { sql: string; params: QueryValue[] } {
    const params: QueryValue[] = [];
    let paramIndex = startParamIndex;

    const whereClause = this.conditions
      .map(({ column, value }) => {
        params.push(value);

        return `${column} = $${paramIndex++}`;
      })
      .join(" AND ");

    return { sql: whereClause, params };
  }
}

class PostgresSelectQuery<T = RowData> implements SelectQuery<T> {
  private readonly standardColumns: string[];
  private readonly joins: JoinConfig[];
  private readonly conditions: Array<{ column: string; operator: string; values: QueryValue | QueryValue[] }> = [];
  private orderBy?: { column: string; ascending: boolean };
  private limitCount?: number;

  constructor(
    private readonly table: string,
    columns?: string,
  ) {
    const { standardColumns, joins } = parseColumns(columns);

    this.standardColumns = standardColumns;
    this.joins = joins;
  }

  eq(column: string, value: QueryValue): SelectQuery<T> {
    this.conditions.push({ column, operator: "=", values: value });

    return this;
  }

  neq(column: string, value: QueryValue): SelectQuery<T> {
    this.conditions.push({ column, operator: "!=", values: value });

    return this;
  }

  in(column: string, values: QueryValue[]): SelectQuery<T> {
    this.conditions.push({ column, operator: "IN", values });

    return this;
  }

  order(column: string, options: { ascending: boolean }): SelectQuery<T> {
    this.orderBy = { column, ascending: options.ascending };

    return this;
  }

  limit(count: number): SelectQuery<T> {
    this.limitCount = count;

    return this;
  }

  private buildWhereClauseForSelect(hasJoins: boolean): { sql: string; params: QueryValue[] } {
    const params: QueryValue[] = [];

    if (this.conditions.length === 0) {
      return { sql: "", params };
    }

    let paramIndex = 1;
    const sql = " WHERE " + this.conditions
      .map(({ column, operator, values }) => {
        const qualifiedColumn = hasJoins && !column.includes(".") ? `${this.table}.${column}` : column;

        if (operator === "IN" && Array.isArray(values)) {
          const placeholders = values.map((v) => {
            params.push(v);

            return `$${paramIndex++}`;
          });

          return `${qualifiedColumn} IN (${placeholders.join(", ")})`;
        }

        params.push(values as QueryValue);

        return `${qualifiedColumn} ${operator} $${paramIndex++}`;
      })
      .join(" AND ");

    return { sql, params };
  }

  private buildSql(): { sql: string; params: QueryValue[] } {
    const hasJoins = this.joins.length > 0;
    const selectList = buildSelectList(this.table, this.standardColumns, this.joins);
    const joinClause = buildJoinClause(this.table, this.joins);
    const { sql: whereClause, params } = this.buildWhereClauseForSelect(hasJoins);

    let sql = `SELECT ${selectList} FROM ${this.table}${joinClause}${whereClause}`;

    if (this.orderBy) {
      const qualifiedOrderColumn = hasJoins && !this.orderBy.column.includes(".")
        ? `${this.table}.${this.orderBy.column}`
        : this.orderBy.column;

      sql += ` ORDER BY ${qualifiedOrderColumn} ${this.orderBy.ascending ? "ASC" : "DESC"}`;
    }

    if (this.limitCount !== undefined) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    return { sql, params };
  }

  async maybeSingle(): Promise<{ data: T | null; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);
      const data = result.rows.length > 0 ? (result.rows[0] as T) : null;

      return { data, error: null };
    } catch (error) {
      return { data: null as unknown as T, error: error as Error };
    }
  }

  async single(): Promise<{ data: T; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);

      if (result.rows.length === 0) {
        return { data: null as unknown as T, error: new Error("No rows found") };
      }

      return { data: result.rows[0] as T, error: null };
    } catch (error) {
      return { data: null as unknown as T, error: error as Error };
    }
  }

  async execute(): Promise<{ data: T[]; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);

      return { data: result.rows as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  then<TResult1 = { data: T[]; error: QueryError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: QueryError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

/**
 * Represents an INSERT/UPDATE followed by a Supabase-style `.select()`, i.e. a mutation
 * that returns the affected rows. Without relation joins this maps to `... RETURNING <cols>`;
 * with joins the mutation is wrapped in a CTE so the returned rows can be joined.
 */
class PostgresReturningQuery<T = RowData> implements SelectQuery<T> {
  private readonly standardColumns: string[];
  private readonly joins: JoinConfig[];

  constructor(
    private readonly buildBaseSql: () => { sql: string; params: QueryValue[] },
    columns?: string,
  ) {
    const { standardColumns, joins } = parseColumns(columns);

    this.standardColumns = standardColumns;
    this.joins = joins;
  }

  // Filtering/ordering is applied on the insert()/update() builder before select();
  // once a mutation returns rows there is nothing further to filter (matches Supabase).
  eq(): SelectQuery<T> {
    return this;
  }

  neq(): SelectQuery<T> {
    return this;
  }

  in(): SelectQuery<T> {
    return this;
  }

  order(): SelectQuery<T> {
    return this;
  }

  limit(): SelectQuery<T> {
    return this;
  }

  private buildSql(): { sql: string; params: QueryValue[] } {
    const { sql: baseSql, params } = this.buildBaseSql();

    if (this.joins.length === 0) {
      return { sql: `${baseSql} RETURNING ${this.standardColumns.join(", ")}`, params };
    }

    const cte = "_mutation";
    const selectList = buildSelectList(cte, this.standardColumns, this.joins);
    const joinClause = buildJoinClause(cte, this.joins);

    return {
      sql: `WITH ${cte} AS (${baseSql} RETURNING *) SELECT ${selectList} FROM ${cte}${joinClause}`,
      params,
    };
  }

  async maybeSingle(): Promise<{ data: T | null; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);
      const data = result.rows.length > 0 ? (result.rows[0] as T) : null;

      return { data, error: null };
    } catch (error) {
      return { data: null as unknown as T, error: error as Error };
    }
  }

  async single(): Promise<{ data: T; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);

      if (result.rows.length === 0) {
        return { data: null as unknown as T, error: new Error("No rows found") };
      }

      return { data: result.rows[0] as T, error: null };
    } catch (error) {
      return { data: null as unknown as T, error: error as Error };
    }
  }

  async execute(): Promise<{ data: T[]; error: QueryError }> {
    try {
      const { sql, params } = this.buildSql();
      const result = await getPool().query(sql, params);

      return { data: result.rows as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  then<TResult1 = { data: T[]; error: QueryError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: QueryError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class PostgresInsertQuery<T = RowData> implements InsertQuery<T> {
  constructor(
    private readonly table: string,
    private readonly data: Record<string, QueryValue> | Record<string, QueryValue>[],
  ) {}

  private buildBaseSql(): { sql: string; params: QueryValue[] } {
    const dataArray = Array.isArray(this.data) ? this.data : [this.data];

    if (dataArray.length === 0) {
      throw new Error("No data to insert");
    }

    const firstRow = dataArray[0];
    const columns = Object.keys(firstRow);
    const placeholders = dataArray
      .map((_, i) => {
        const startIdx = i * columns.length + 1;
        const placeholderList = Array.from({ length: columns.length }, (_, j) => `$${startIdx + j}`);

        return `(${placeholderList.join(", ")})`;
      })
      .join(", ");

    const params = dataArray.flatMap((row) => columns.map((col) => row[col]));
    const sql = `INSERT INTO ${this.table} (${columns.join(", ")}) VALUES ${placeholders}`;

    return { sql, params };
  }

  select(columns?: string): SelectQuery<T> {
    return new PostgresReturningQuery<T>(() => this.buildBaseSql(), columns);
  }

  async execute(): Promise<{ data: T[]; error: QueryError }> {
    try {
      const { sql, params } = this.buildBaseSql();
      const result = await getPool().query(`${sql} RETURNING *`, params);

      return { data: result.rows as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  then<TResult1 = { data: T[]; error: QueryError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: QueryError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class PostgresUpdateQuery<T = RowData> extends BaseConditionQuery<PostgresUpdateQuery<T>> implements UpdateQuery<T> {
  constructor(
    private readonly table: string,
    private readonly data: Record<string, QueryValue>,
  ) {
    super();
  }

  eq(column: string, value: QueryValue): UpdateQuery<T> {
    return this.addCondition(column, value);
  }

  private buildBaseSql(): { sql: string; params: QueryValue[] } {
    if (this.conditions.length === 0) {
      throw new Error("Update requires at least one condition");
    }

    const dataColumns = Object.keys(this.data);
    const updateSet = dataColumns.map((col, i) => `${col} = $${i + 1}`).join(", ");

    const params: QueryValue[] = [...dataColumns.map((col) => this.data[col])];
    const { sql: whereClause, params: whereParams } = this.buildWhereClause(dataColumns.length + 1);

    params.push(...whereParams);

    const sql = `UPDATE ${this.table} SET ${updateSet} WHERE ${whereClause}`;

    return { sql, params };
  }

  select(columns?: string): SelectQuery<T> {
    return new PostgresReturningQuery<T>(() => this.buildBaseSql(), columns);
  }

  async execute(): Promise<{ data: T[]; error: QueryError }> {
    try {
      const { sql, params } = this.buildBaseSql();
      const result = await getPool().query(`${sql} RETURNING *`, params);

      return { data: result.rows as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  then<TResult1 = { data: T[]; error: QueryError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: QueryError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class PostgresDeleteQuery<T = RowData> extends BaseConditionQuery<PostgresDeleteQuery<T>> implements DeleteQuery<T> {
  constructor(private readonly table: string) {
    super();
  }

  eq(column: string, value: QueryValue): DeleteQuery<T> {
    return this.addCondition(column, value);
  }

  async execute(): Promise<{ data: T[]; error: QueryError }> {
    try {
      if (this.conditions.length === 0) {
        return { data: [], error: new Error("Delete requires at least one condition") };
      }

      const { sql: whereClause, params } = this.buildWhereClause();
      const sql = `DELETE FROM ${this.table} WHERE ${whereClause}`;

      const result = await getPool().query(sql, params);

      return { data: result.rows as T[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  then<TResult1 = { data: T[]; error: QueryError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: QueryError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class PostgresQueryBuilder<T = RowData> implements QueryBuilder<T> {
  constructor(private readonly table: string) {}

  select(columns?: string): SelectQuery<T> {
    return new PostgresSelectQuery<T>(this.table, columns);
  }

  insert(data: Record<string, QueryValue> | Record<string, QueryValue>[]): InsertQuery<T> {
    return new PostgresInsertQuery<T>(this.table, data);
  }

  update(data: Record<string, QueryValue>): UpdateQuery<T> {
    return new PostgresUpdateQuery<T>(this.table, data);
  }

  delete(): DeleteQuery<T> {
    return new PostgresDeleteQuery<T>(this.table);
  }
}

class PostgresClient implements DatabaseClient {
  from<T = RowData>(table: string): QueryBuilder<T> {
    return new PostgresQueryBuilder<T>(table);
  }

  async rpc<T = any>(functionName: string, args?: Record<string, any>): Promise<{ data: T; error: QueryError }> {
    const argNames = args ? Object.keys(args) : [];
    const argValues = args ? argNames.map((name) => args[name]) : [];
    const argPlaceholders = argNames.map((_, i) => `$${i + 1}`).join(", ");

    try {
      const sql = `SELECT * FROM ${functionName}(${argPlaceholders})`;
      const result = await getPool().query(sql, argValues);

      return { data: result.rows as unknown as T, error: null };
    } catch (error: any) {
      // Fallback for void functions: cannot be used in SELECT
      if (error?.code === '42601' && error?.message?.includes('query has no destination for result data')) {
        await getPool().query(`${functionName}(${argPlaceholders})`, argValues);

        return { data: null as unknown as T, error: null };
      }

      return { data: null as unknown as T, error: error as Error };
    }
  }
}

export const postgresClient: DatabaseClient = new PostgresClient();

export async function closePostgresConnection(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
