import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const documentsTable = pgTable('documents', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  title: varchar('title', {
    length: 255
  }).notNull(),
  originalFileName: varchar('original_file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
