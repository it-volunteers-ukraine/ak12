export type QueryValue = string | number | boolean | null | undefined;
export type QueryError = Error | null;
export type RowData = Record<string, QueryValue>;

export interface DatabaseClient {
  from<T = any>(table: string): QueryBuilder<T>;
  rpc<T = any>(functionName: string, args?: Record<string, any>): PromiseLike<{ data: T; error: QueryError }>;
}

export interface QueryBuilder<T = any> {
  select(columns?: string): SelectQuery<T>;
  insert(data: RowData | RowData[]): InsertQuery<T>;
  update(data: RowData): UpdateQuery<T>;
  delete(): DeleteQuery<T>;
}

export interface SelectQuery<T = any> extends PromiseLike<{ data: T[]; error: QueryError }> {
  eq(column: string, value: QueryValue): SelectQuery<T>;
  neq(column: string, value: QueryValue): SelectQuery<T>;
  in(column: string, values: QueryValue[]): SelectQuery<T>;
  order(column: string, options: { ascending: boolean }): SelectQuery<T>;
  limit(count: number): SelectQuery<T>;
  maybeSingle(): Promise<{ data: T | null; error: QueryError }>;
  single(): Promise<{ data: T; error: QueryError }>;
  execute(): Promise<{ data: T[]; error: QueryError }>;
}

export interface InsertQuery<T = any> extends PromiseLike<{ data: T[]; error: QueryError }> {
  select(columns?: string): SelectQuery<T>;
  execute(): Promise<{ data: T[]; error: QueryError }>;
}

export interface UpdateQuery<T = any> extends PromiseLike<{ data: T[]; error: QueryError }> {
  eq(column: string, value: QueryValue): UpdateQuery<T>;
  select(columns?: string): SelectQuery<T>;
  execute(): Promise<{ data: T[]; error: QueryError }>;
}

export interface DeleteQuery<T = any> extends PromiseLike<{ data: T[]; error: QueryError }> {
  eq(column: string, value: QueryValue): DeleteQuery<T>;
  execute(): Promise<{ data: T[]; error: QueryError }>;
}
