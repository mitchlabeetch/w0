import 'server-only'

import { and, count, desc, eq, gte } from 'drizzle-orm'

import { users, chats, type User } from './schema'
import { generateUUID } from '../utils'
import { generateHashedPassword } from './utils'
import db from './connection'

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(users).where(eq(users.email, email))
  } catch (error) {
    console.error('Failed to get user from database')
    throw error
  }
}

export async function createUser(
  email: string,
  password: string,
): Promise<User[]> {
  try {
    const hashedPassword = generateHashedPassword(password)
    return await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning()
  } catch (error) {
    console.error('Failed to create user in database')
    throw error
  }
}

export async function createGuestUser(): Promise<User[]> {
  try {
    const guestId = generateUUID()
    const guestEmail = `guest-${guestId}@example.com`

    return await db
      .insert(users)
      .values({
        email: guestEmail,
        password: null,
      })
      .returning()
  } catch (error) {
    console.error('Failed to create guest user in database')
    throw error
  }
}

export async function createChatOwnership({
  v0ChatId,
  userId,
}: {
  v0ChatId: string
  userId: string
}) {
  try {
    return await db.insert(chats).values({
      id: v0ChatId,
      user_id: userId,
    })
  } catch (error) {
    console.error('Failed to create chat in database')
    throw error
  }
}

export async function getChatOwnership({ v0ChatId }: { v0ChatId: string }) {
  try {
    const [chat] = await db.select().from(chats).where(eq(chats.id, v0ChatId))
    return chat
  } catch (error) {
    console.error('Failed to get chat from database')
    throw error
  }
}

export async function getChatIdsByUserId({ userId }: { userId: string }): Promise<string[]> {
  try {
    const userChats = await db
      .select({ id: chats.id })
      .from(chats)
      .where(eq(chats.user_id, userId))
      .orderBy(desc(chats.created_at))

    return userChats.map((chat: { id: string }) => chat.id)
  } catch (error) {
    console.error('Failed to get chat IDs by user from database')
    throw error
  }
}

export async function deleteChatOwnership({ v0ChatId }: { v0ChatId: string }) {
  try {
    return await db.delete(chats).where(eq(chats.id, v0ChatId))
  } catch (error) {
    console.error('Failed to delete chat from database')
    throw error
  }
}

export async function getChatCountByUserId({
  userId,
  differenceInHours,
}: {
  userId: string
  differenceInHours: number
}): Promise<number> {
  try {
    const hoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000)

    const [stats] = await db
      .select({ count: count(chats.id) })
      .from(chats)
      .where(and(eq(chats.user_id, userId), gte(chats.created_at, hoursAgo)))

    return stats?.count || 0
  } catch (error) {
    console.error('Failed to get chat count by user from database')
    throw error
  }
}

export async function getChatCountByIP({
  ipAddress,
  differenceInHours,
}: {
  ipAddress: string
  differenceInHours: number
}): Promise<number> {
  void ipAddress
  void differenceInHours
  return 0
}

export async function createAnonymousChatLog({
  ipAddress,
  v0ChatId,
}: {
  ipAddress: string
  v0ChatId: string
}) {
  void ipAddress
  void v0ChatId
  return
}
