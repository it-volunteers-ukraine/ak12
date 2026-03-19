import { Pool, PoolConfig } from 'pg';
import { logger } from '@/lib/logger';

if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is not set');
  throw new Error('DATABASE_URL environment variable is not set');
}

const isProduction = process.env.NODE_ENV === 'production';

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ...(isProduction && {
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000,
    max: 20,
  }),
};

export const pool = new Pool(config);

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle client');
});

process.on('SIGTERM', () => {
  pool.end(() => {
    logger.info('Database pool closed');
    process.exit(0);
  });
});
