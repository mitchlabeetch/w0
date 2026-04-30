import type { InferSelectModel } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  varchar,
  timestamp,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type User = InferSelectModel<typeof users>

export const chatVisibilityEnum = pgEnum('chat_visibility', [
  'private',
  'unlisted',
  'public',
])

export const messageRoleEnum = pgEnum('message_role', [
  'system',
  'user',
  'assistant',
])

export const chats = pgTable(
  'chats',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }),
    parent_chat_id: varchar('parent_chat_id', { length: 255 }).references(
      (): AnyPgColumn => chats.id,
      { onDelete: 'set null' },
    ),
    visibility: chatVisibilityEnum('visibility').notNull().default('private'),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chats_user_id_idx').on(table.user_id),
    index('chats_parent_chat_id_idx').on(table.parent_chat_id),
  ],
)

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    chat_id: varchar('chat_id', { length: 255 })
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('messages_chat_id_created_at_idx').on(table.chat_id, table.created_at),
  ],
)

export const systemPrompts = pgTable(
  'system_prompts',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('system_prompts_user_id_idx').on(table.user_id)],
)

export const llmConfigurations = pgTable(
  'llm_configurations',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider_name: varchar('provider_name', { length: 64 }).notNull(),
    active_model: varchar('active_model', { length: 128 }).notNull(),
    api_key_encrypted: text('api_key_encrypted'),
    base_url: text('base_url'),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('llm_configurations_user_id_idx').on(table.user_id),
    uniqueIndex('llm_configurations_one_active_per_user_idx')
      .on(table.user_id)
      .where(sql`${table.is_active} = true`),
  ],
)

export const anonymous_chat_logs = pgTable('anonymous_chat_logs', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  ip_address: varchar('ip_address', { length: 45 }).notNull(), // IPv6 can be up to 45 chars
  v0_chat_id: varchar('v0_chat_id', { length: 255 }).notNull(), // v0 API chat ID
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Chat = InferSelectModel<typeof chats>
export type Message = InferSelectModel<typeof messages>
export type SystemPrompt = InferSelectModel<typeof systemPrompts>
export type LlmConfiguration = InferSelectModel<typeof llmConfigurations>
export type AnonymousChatLog = InferSelectModel<typeof anonymous_chat_logs>
