// import { text } from 'drizzle-orm/gel-core'
import { integer, pgTable, timestamp, varchar, text } from 'drizzle-orm/pg-core'

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

// document content schema
export const documentContentsTable = pgTable('document_contents', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  documentId: integer('document_id')
    .references(() => documentsTable.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// topic table
export const topicsTable = pgTable('topics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  documentId: integer('document_id')
    .references(() => documentsTable.id)
    .notNull(),
  name: varchar('name', {
    length: 255
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const notesTable = pgTable('notes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const flashcardsTable = pgTable('flashcards', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const quizzesTable = pgTable('quizzes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  question: text('question').notNull(),
  optionA: text('option_a').notNull(),
  optionB: text('option_b').notNull(),
  optionC: text('option_c').notNull(),
  optionD: text('option_d').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const quizAttemptsTable = pgTable('quiz_attempts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  score: integer('score').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const weakTopicsTable = pgTable('weak_topics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  averageScore: integer('average_score').notNull(),
  weaknessScore: integer('weakness_score').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const revisionsTable = pgTable('revisions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  topicId: integer('topic_id')
    .references(() => topicsTable.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const chatsTable = pgTable('chats', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  documentId: integer('document_id')
    .references(() => documentsTable.id)
    .notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const metricsTable = pgTable('metrics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  key: varchar('key', {
    length: 100
  })
    .notNull()
    .unique(),
  value: integer('value').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
