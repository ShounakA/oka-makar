import { InferModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
 
export var sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scoreKeeperUserName: text('score_keeper_user_name', { length: 320 }).references(() => users.username),
  passCode: text('pass_code', { length: 15 }),
  currentlyPlaying: text('currently_playing', { length: 255 }),
  joinable: integer('joinable', { mode: 'boolean' }).notNull().default(true),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
});

export var scores = sqliteTable('scores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  session: integer('session').references(() => sessions.id).notNull(),
  player: text('player').notNull(),
  score: integer('score').notNull(),
});

export var users = sqliteTable('users', {
  username: text('user_name', { length: 320 }).unique().primaryKey(),
  name: text('name').notNull(),
});

export type User = InferModel<typeof users> // return type when queried
export type InsertUser = InferModel<typeof users, 'insert'> // insert type

export type Session = InferModel<typeof sessions> // return type when queried
export type InsertSession = InferModel<typeof sessions, 'insert'> // insert type

export type Score = InferModel<typeof scores> // return type when queried
export type InsertScore = InferModel<typeof scores, 'insert'> // insert type