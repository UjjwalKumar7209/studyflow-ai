# StudyFlow AI

StudyFlow AI is a full-stack study assistant that converts PDF study materials into AI-generated learning tools. It combines a Bun-powered backend with a Next.js frontend to provide PDF parsing, topic extraction, markdown notes, flashcards, quizzes, and performance diagnostics.

## Project structure

- `backend/` – Bun + Express API server, Drizzle ORM database access, PDF parsing, OpenAI integration, and authentication.
- `frontend/` – Next.js 16.2.7 application built with React 19 and Tailwind CSS, providing the public landing page and authenticated study dashboard.
- `docs/` – design and documentation notes for architecture, API design, and database structure.

## Website overview

The website homepage is designed as a study-focused landing page with a strong hero section and feature-first presentation.

Key visual elements from the homepage include:

- A hero banner that presents the product promise: "Turn any PDF into custom AI study tools."
- Primary calls to action for signing up and accessing the dashboard.
- A four-item feature highlight grid showing core capabilities like PDF parsing, markdown summaries, active recall flashcards, and learning gap diagnostics.
- A three-column feature section describing Smart PDF Upload, Topic Extractor, Interactive Flashcards, Timed Quiz Engine, Weakness Diagnostics, and Document Chatbot.
- A closing call-to-action section that reinforces free access, instant setup, and student-focused outcomes.

This homepage presentation serves as the website photo explanation in the documentation.

## Backend

The backend is located in `backend/` and includes:

- `bun` runtime with support for modern JavaScript and fast startup.
- Express-style routing and controllers.
- `drizzle-orm` for database workflows and migration files.
- `pdf-parse` for extracting text from uploaded PDF documents.
- OpenAI SDK integration for generating summaries, flashcards, and quiz content.
- PostgreSQL and Redis dependencies for persistent storage and caching.

### Backend install and run

```bash
cd backend
bun install
bun run src/app.ts
```

## Frontend

The frontend lives in `frontend/` and includes:

- `Next.js` application using the App Router.
- `react` and `lucide-react` for UI and icons.
- Tailwind CSS for styling.
- Login and registration flows, plus pages for notes, flashcards, quizzes, revisions, and analytics.

### Frontend install and run

```bash
cd frontend
bun install
bun --bun next dev
```

## Local development

1. Install dependencies in both `backend/` and `frontend/`.
2. Configure environment variables for backend services, database connection, OpenAI key, and any file storage settings.
3. Start the backend server.
4. Start the frontend application.
5. Open `http://localhost:3000` to view the website and homepage.

## Notes

- The repository currently includes a landing-page-style website with a study productivity theme and AI-driven workspace features.
- The root README documents the application flow and explains the website homepage layout as the visual reference.
