import type { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  pgEnum,
  boolean,
  unique,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export type User = InferSelectModel<typeof users>

export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant', 'system'])

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  parent_chat_id: uuid('parent_chat_id'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

export type Chat = InferSelectModel<typeof chats>

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chat_id: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  role: chatRoleEnum('role').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export type Message = InferSelectModel<typeof messages>

export const llmConfigurations = pgTable(
  'llm_configurations',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider_name: varchar('provider_name', { length: 64 }).notNull(),
    api_key: text('api_key').notNull(),
    base_url: text('base_url'),
    active_model: varchar('active_model', { length: 128 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    unique_active_per_user: unique().on(table.user_id, table.is_active),
  }),
)

export type LlmConfiguration = InferSelectModel<typeof llmConfigurations>
