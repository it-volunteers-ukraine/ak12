// Jest runs under jest-environment-jsdom, where importing the real `server-only`
// package throws ("cannot be imported from a Client Component"). This stub neutralizes
// it so modules guarded by `import "server-only"` can be exercised in tests. The real
// guard still applies during `next build`.
export {};
