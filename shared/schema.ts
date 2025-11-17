import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const studentSessions = pgTable("student_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uid: text("uid").notNull(),
  branch: text("branch").notNull(),
  year: integer("year").notNull(),
  selectedSubject: text("selected_subject"),
});

export const generatedNotes = pgTable("generated_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  topics: jsonb("topics").$type<string[]>(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  subject: text("subject").notNull(),
  questions: jsonb("questions").$type<QuizQuestion[]>().notNull(),
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
});

export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: text("subject").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const insertStudentSessionSchema = createInsertSchema(studentSessions).omit({
  id: true,
});

export const insertGeneratedNotesSchema = createInsertSchema(generatedNotes).omit({
  id: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export type InsertStudentSession = z.infer<typeof insertStudentSessionSchema>;
export type StudentSession = typeof studentSessions.$inferSelect;

export type InsertGeneratedNotes = z.infer<typeof insertGeneratedNotesSchema>;
export type GeneratedNotes = typeof generatedNotes.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface Branch {
  id: string;
  name: string;
  description: string;
}

export interface YearInfo {
  year: number;
  title: string;
  description: string;
}

export interface Subject {
  code: string;
  name: string;
  year: number;
  branch: string;
}
