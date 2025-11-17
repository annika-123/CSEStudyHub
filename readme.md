# CSE Note Finder - Engineering Study Platform..

## Project Overview
A comprehensive dark-themed study platform for engineering students to access AI-generated study notes, practice quizzes, and FAQs based on their selected branch, year, and subject.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing)
- **Backend**: Express.js, Node.js
- **AI**: OpenAI GPT-5 for content generation
- **Storage**: In-memory storage (MemStorage)
- **State Management**: TanStack Query (React Query)

## Design System
- **Theme**: Dark mode with cyan/turquoise accent (#00CED1 / hsl(187 85% 50%))
- **Background**: Dark navy (#0A1628 / hsl(215 45% 6%))
- **Typography**: Inter font family
- **Components**: Shadcn UI component library with custom dark theme

## Application Flow
1. **UID Entry** (`/`) - Student enters their unique identifier
2. **Branch Selection** (`/branch`) - Choose engineering branch (CSE, Mechanical, Aerospace, Civil, Electrical, Chemical)
3. **Year Selection** (`/year`) - Select academic year (1st, 2nd, 3rd, 4th)
4. **Subject Selection** (`/subject`) - Pick subject based on branch and year
5. **Notes Viewer** (`/notes`) - View AI-generated study notes with actions to take quiz or view FAQs
6. **Quiz Interface** (`/quiz`) - Take practice quizzes with multiple-choice questions
7. **FAQ Page** (`/faq`) - Browse frequently asked questions with search functionality

## Data Models
- **StudentSession**: Tracks user UID, selected branch, year, and subject
- **GeneratedNotes**: AI-generated study materials for each subject
- **Quiz**: Practice quizzes with questions, options, and correct answers
- **FAQ**: Frequently asked questions with searchable content

## API Endpoints (To be implemented)
- `POST /api/notes/generate` - Generate AI study notes
- `GET /api/notes/:code` - Fetch notes for a subject
- `POST /api/quiz/generate` - Generate practice quiz
- `GET /api/quiz/questions/:code` - Get quiz questions
- `POST /api/faq/generate` - Generate FAQs
- `GET /api/faq/:code` - Fetch FAQs for a subject

## Features Implemented
✅ UID entry screen with validation
✅ Branch selection with 6 engineering branches
✅ Year selection (1st-4th year) matching reference design
✅ Subject selection with dynamic subjects per branch/year
✅ Notes viewer with AI generation capability
✅ Interactive quiz interface with progress tracking
✅ FAQ page with accordion and search functionality
✅ Dark theme with cyan accent colors
✅ Responsive design across all breakpoints
✅ Beautiful loading states and empty states
✅ Smooth navigation flow with back buttons

## Environment Variables
- `OPENAI_API_KEY` - Required for AI content generation
- `SESSION_SECRET` - For session management (if needed)

## Project Structure
```
client/src/
  ├── pages/
  │   ├── uid-entry.tsx
  │   ├── branch-selection.tsx
  │   ├── year-selection.tsx
  │   ├── subject-selection.tsx
  │   ├── notes-viewer.tsx
  │   ├── quiz.tsx
  │   └── faq.tsx
  ├── components/ui/ (Shadcn components)
  ├── App.tsx
  └── index.css

server/
  ├── routes.ts (API endpoints)
  ├── storage.ts (Data storage interface)
  └── index.ts

shared/
  └── schema.ts (TypeScript types and Drizzle schemas)
```

## Development Notes
- All components use data-testid attributes for testing
- Dark mode is enforced via `class="dark"` on HTML element
- Local storage used for maintaining user selections across navigation
- OpenAI integration uses GPT-5 model for content generation
- Consistent spacing and typography throughout following design guidelines

## Next Steps
- Implement backend API routes for notes, quiz, and FAQ generation
- Integrate OpenAI API for AI-powered content creation
- Add proper error handling and validation
- Test all user journeys end-to-end
