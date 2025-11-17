import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateStudyNotes(subject: string, code: string): Promise<{ content: string; topics: string[] }> {
  try {
    const prompt = `Generate comprehensive study notes for the engineering subject "${subject}" (${code}).

Include the following:
1. Overview and importance of the subject
2. Key concepts and theories
3. Important formulas (if applicable)
4. Real-world applications
5. Study tips and best practices

Format the response ONLY as a JSON object with this exact structure (no markdown, no code fences):
{
  "content": "HTML formatted content here using <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul>/<ol> for lists",
  "topics": ["Topic 1", "Topic 2", "Topic 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert engineering educator. You MUST respond ONLY with valid JSON, no markdown formatting, no code fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 4096,
    });

    let messageContent = response.choices[0].message?.content || "{}";
    
    messageContent = messageContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const result = JSON.parse(messageContent);
    return {
      content: result.content || "<p>Failed to generate notes.</p>",
      topics: result.topics || [],
    };
  } catch (error) {
    console.error("Error generating study notes:", error);
    throw new Error("Failed to generate study notes");
  }
}

export async function generateQuizQuestions(subject: string, code: string): Promise<any[]> {
  try {
    const prompt = `Generate 10 multiple-choice quiz questions for the engineering subject "${subject}" (${code}).

Each question should:
- Test understanding of key concepts
- Have 4 options
- Have exactly one correct answer (index 0-3)
- Be clear and unambiguous
- Cover different difficulty levels

Respond ONLY with valid JSON (no markdown, no code fences) in this exact structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert engineering educator. You MUST respond ONLY with valid JSON, no markdown formatting, no code fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 4096,
    });

    let messageContent = response.choices[0].message?.content || "{}";
    
    messageContent = messageContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const result = JSON.parse(messageContent);
    return result.questions || [];
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function generateFAQs(subject: string, code: string): Promise<any[]> {
  try {
    const prompt = `Generate 10 frequently asked questions and detailed answers for the engineering subject "${subject}" (${code}).

Questions should cover:
- Fundamental concepts
- Common misconceptions
- Practical applications
- Exam preparation tips
- Career relevance

Respond ONLY with valid JSON (no markdown, no code fences) in this exact structure:
{
  "faqs": [
    {
      "question": "What is...?",
      "answer": "Detailed answer here..."
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert engineering educator. You MUST respond ONLY with valid JSON, no markdown formatting, no code fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 4096,
    });

    let messageContent = response.choices[0].message?.content || "{}";
    
    messageContent = messageContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const result = JSON.parse(messageContent);
    return result.faqs || [];
  } catch (error) {
    console.error("Error generating FAQs:", error);
    throw new Error("Failed to generate FAQs");
  }
}
