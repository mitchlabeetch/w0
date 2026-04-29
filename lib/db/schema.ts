import type { InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
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

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parent_chat_id: uuid('parent_chat_id').references((): AnyPgColumn => chats.id, {
    onDelete: 'set null',
  }),
  title: varchar('title', { length: 255 }),
  visibility: chatVisibilityEnum('visibility').notNull().default('private'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chat_id: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const systemPrompts = pgTable('system_prompts', {
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
})

export const llmConfigurations = pgTable('llm_configurations', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  provider_name: varchar('provider_name', { length: 64 }).notNull(),
  active_model: varchar('active_model', { length: 120 }).notNull(),
  api_key: text('api_key').notNull(),
  base_url: text('base_url'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.user_id],
    references: [users.id],
  }),
  parent: one(chats, {
    fields: [chats.parent_chat_id],
    references: [chats.id],
    relationName: 'chat_lineage',
  }),
  children: many(chats, { relationName: 'chat_lineage' }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
}))

export type User = InferSelectModel<typeof users>
export type Chat = InferSelectModel<typeof chats>
export type Message = InferSelectModel<typeof messages>
export type SystemPrompt = InferSelectModel<typeof systemPrompts>
export type LlmConfiguration = InferSelectModel<typeof llmConfigurations>
