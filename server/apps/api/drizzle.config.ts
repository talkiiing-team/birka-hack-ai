import type { Config } from 'drizzle-kit';

export default {
    schema: './src/schemas/*.ts',
    out: './migrations',
} satisfies Config;
