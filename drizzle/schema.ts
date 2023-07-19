import { InferModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
 
export var sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  passCode: text('pass_code', { length: 15 }),
  scoreKeeperUserName: text('score_keeper_user_name', { length: 320 }).references(() => users.username),
});

export var users = sqliteTable('users', {
  username: text('user_name', { length: 320 }).unique().primaryKey(),
  name: text('name').notNull(),
});

export type User = InferModel<typeof users> // return type when queried
export type InsertUser = InferModel<typeof users, 'insert'> // insert type

export type Session = InferModel<typeof sessions> // return type when queried
export type InsertSession = InferModel<typeof sessions, 'insert'> // insert type