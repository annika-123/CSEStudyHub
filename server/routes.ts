import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStudyNotes, generateQuizQuestions, generateFAQs } from "./openai";
import { insertGeneratedNotesSchema, insertQuizSchema, insertFaqSchema } from "@shared/schema";
import { z } from "zod";

const generateNotesRequestSchema = z.object({
  subject: z.string(),
  code: z.string(),
  uid: z.string().min(1, "UID is required"),
});

const generateQuizRequestSchema = z.object({
  subject: z.string(),
  code: z.string(),
  uid: z.string().min(1, "UID is required"),
});

const generateFAQRequestSchema = z.object({
  subject: z.string(),
  code: z.string(),
  uid: z.string().min(1, "UID is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/notes/generate", async (req, res) => {
    try {
      const { subject, code, uid } = generateNotesRequestSchema.parse(req.body);
      
      const { content, topics } = await generateStudyNotes(subject, code);
      
      const notes = await storage.createNotes({
        sessionId: uid,
        subject: code,
        content,
        topics,
      });
      
      res.json(notes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating notes:", error);
      res.status(500).json({ error: "Failed to generate notes" });
    }
  });

  app.get("/api/notes/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const uid = req.query.uid as string;
      
      if (!uid) {
        return res.status(400).json({ error: "UID is required" });
      }
      
      const notes = await storage.getNotesBySessionAndSubject(uid, code);
      
      if (!notes) {
        return res.status(404).json({ error: "Notes not found" });
      }
      
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/quiz/generate", async (req, res) => {
    try {
      const { subject, code, uid } = generateQuizRequestSchema.parse(req.body);
      
      const questions = await generateQuizQuestions(subject, code);
      
      const quiz = await storage.createQuiz({
        sessionId: uid,
        subject: code,
        questions,
        score: null,
        totalQuestions: questions.length,
      });
      
      res.json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating quiz:", error);
      res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  app.get("/api/quiz/questions/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const uid = req.query.uid as string;
      
      if (!uid) {
        return res.status(400).json({ error: "UID is required" });
      }
      
      const quiz = await storage.getQuizBySessionAndSubject(uid, code);
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      res.json(quiz.questions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  });

  app.post("/api/faq/generate", async (req, res) => {
    try {
      const { subject, code, uid } = generateFAQRequestSchema.parse(req.body);
      
      const faqData = await generateFAQs(subject, code);
      
      const faqs = [];
      for (const item of faqData) {
        const faq = await storage.createFAQ({
          sessionId: uid,
          subject: code,
          question: item.question,
          answer: item.answer,
        });
        faqs.push(faq);
      }
      
      res.json(faqs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating FAQs:", error);
      res.status(500).json({ error: "Failed to generate FAQs" });
    }
  });

  app.get("/api/faq/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const uid = req.query.uid as string;
      
      if (!uid) {
        return res.status(400).json({ error: "UID is required" });
      }
      
      const faqs = await storage.getFAQsBySessionAndSubject(uid, code);
      
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
