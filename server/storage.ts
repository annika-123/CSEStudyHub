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
  getNotesBySubject(subject: string): Promise<GeneratedNotes | undefined>;
  
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizBySubject(subject: string): Promise<Quiz | undefined>;
  
  createFAQ(faq: InsertFaq): Promise<Faq>;
  getFAQsBySubject(subject: string): Promise<Faq[]>;
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
    this.notes.set(notes.subject, notes);
    return notes;
  }

  async getNotesBySubject(subject: string): Promise<GeneratedNotes | undefined> {
    return this.notes.get(subject);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(quiz.subject, quiz);
    return quiz;
  }

  async getQuizBySubject(subject: string): Promise<Quiz | undefined> {
    return this.quizzes.get(subject);
  }

  async createFAQ(insertFaq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const faq: Faq = { ...insertFaq, id };
    this.faqs.set(faq.id, faq);
    return faq;
  }

  async getFAQsBySubject(subject: string): Promise<Faq[]> {
    return Array.from(this.faqs.values()).filter((faq) => faq.subject === subject);
  }
}

export const storage = new MemStorage();
