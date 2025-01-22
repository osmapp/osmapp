import { Client } from 'pg';

if (!global.db) {
  global.db = { pool: false };
}

export async function getClient() {
  if (!global.db.pool) {
    const client = new Client({
      user: 'tvgiad',
      password: 'xau_E0h76BAWwiiGCOqEYZsRoCUQqXEQ3jpM',
      host: 'us-east-1.sql.xata.sh',
      port: 5432,
      database: 'db_with_direct_access:main',
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    global.db.pool = client;
  }
  return global.db.pool;
}
