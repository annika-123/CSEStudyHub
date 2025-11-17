import {
  type StudentSession,
  type InsertStudentSession,
  type GeneratedNotes,
  type InsertGeneratedNotes,
  type Quiz,
  type InsertQuiz,
  type Faq,
  type InsertFaq,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSession(session: InsertStudentSession): Promise<StudentSession>;
  getSession(uid: string): Promise<StudentSession | undefined>;
  
  createNotes(notes: InsertGeneratedNotes): Promise<GeneratedNotes>;
  getNotesBySessionAndSubject(sessionId: string, subject: string): Promise<GeneratedNotes | undefined>;
  
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizBySessionAndSubject(sessionId: string, subject: string): Promise<Quiz | undefined>;
  
  createFAQ(faq: InsertFaq): Promise<Faq>;
  getFAQsBySessionAndSubject(sessionId: string, subject: string): Promise<Faq[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, StudentSession>;
  private notes: Map<string, GeneratedNotes>;
  private quizzes: Map<string, Quiz>;
  private faqs: Map<string, Faq>;

  constructor() {
    this.sessions = new Map();
    this.notes = new Map();
    this.quizzes = new Map();
    this.faqs = new Map();
  }

  async createSession(insertSession: InsertStudentSession): Promise<StudentSession> {
    const id = randomUUID();
    const session: StudentSession = { ...insertSession, id };
    this.sessions.set(session.uid, session);
    return session;
  }

  async getSession(uid: string): Promise<StudentSession | undefined> {
    return this.sessions.get(uid);
  }

  async createNotes(insertNotes: InsertGeneratedNotes): Promise<GeneratedNotes> {
    const id = randomUUID();
    const notes: GeneratedNotes = { ...insertNotes, id };
    const key = `${notes.sessionId}:${notes.subject}`;
    this.notes.set(key, notes);
    return notes;
  }

  async getNotesBySessionAndSubject(sessionId: string, subject: string): Promise<GeneratedNotes | undefined> {
    const key = `${sessionId}:${subject}`;
    return this.notes.get(key);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = { ...insertQuiz, id };
    const key = `${quiz.sessionId}:${quiz.subject}`;
    this.quizzes.set(key, quiz);
    return quiz;
  }

  async getQuizBySessionAndSubject(sessionId: string, subject: string): Promise<Quiz | undefined> {
    const key = `${sessionId}:${subject}`;
    return this.quizzes.get(key);
  }

  async createFAQ(insertFaq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const faq: Faq = { ...insertFaq, id };
    const key = `${faq.sessionId}:${faq.subject}:${faq.id}`;
    this.faqs.set(key, faq);
    return faq;
  }

  async getFAQsBySessionAndSubject(sessionId: string, subject: string): Promise<Faq[]> {
    const prefix = `${sessionId}:${subject}:`;
    return Array.from(this.faqs.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([, faq]) => faq);
  }
}

export const storage = new MemStorage();
