import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = drizzle(postgres(process.env.DB_URI!, { max: 1 }));

export const db = drizzle(postgres(process.env.DB_URI!));

export const migrate = async () => {
    await drizzleMigrate(migrationClient, { migrationsFolder: 'migrations' });
};
