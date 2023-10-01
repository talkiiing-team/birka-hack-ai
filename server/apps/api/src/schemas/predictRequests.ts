import { jsonb, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const predictRequestStatus = pgEnum('status', ['at_work', 'done', 'failed'] as const);

export const predictRequests = pgTable('predict_requests', {
    id: serial('id').primaryKey().notNull(),
    status: predictRequestStatus('status').default('at_work').notNull(),
    ts: timestamp('ts').defaultNow().notNull(),
    result: jsonb('result'),
});
