export function withTimestamp<T extends Record<string, unknown>>(data: T) {
  return {
    ...data,
    updatedAt: new Date().toISOString(), 
  };
}
