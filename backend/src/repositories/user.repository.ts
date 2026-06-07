import { eq } from 'drizzle-orm'
import { db } from '../db/index'
import { usersTable } from '../db/schema'

async function findUserByEmail(email: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  return user[0] ?? null
}

async function findUserById(id: number) {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id))
  return user[0] ?? null
}

// createUser()
async function createUser(name: string, email: string, passwordHash: string) {
  const user = await db
    .insert(usersTable)
    .values({
      name,
      email,
      passwordHash
    })
    .returning()
  return user[0]
}

// findUserByEmail()

// findUserById()

const userRepository = {
  createUser,
  findUserByEmail,
  findUserById
}

export default userRepository
