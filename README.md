# 📄 CVInsight — AI Resume Screening & Candidate Analysis

CVInsight is a modern resume screening platform that helps recruiters analyze multiple resumes against a job description. Recruiters can upload resumes, provide a job title and job description, and receive candidate match scores, matched/missing skills, and improvement suggestions through a clean analytics dashboard.

---

## ✨ Features

- 📤 Upload multiple resumes for batch analysis
- 💼 Analyze resumes against a Job Description (JD)
- 🎯 Candidate match score generation
- ✅ Matched and missing skills detection
- 💡 Resume improvement suggestions
- 📊 Recruiter dashboard with candidate analytics
- 🏆 Top candidates ranking
- 🔍 Search, filter, and sort candidates
- ⚖️ Side-by-side candidate comparison
- ⏳ Loading overlay during analysis
- ☁️ Supabase Edge Function integration

---

## 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Supabase Edge Functions |
| Database | Supabase |
| API | Fetch API + FormData |

---

## 🏗 Architecture

```
┌──────────────┐
│ React + Vite │
└──────┬───────┘
       │
 Upload Resumes + JD
       │
       ▼
 Supabase Edge Function
       │
 Resume Processing
 Candidate Scoring
 Skill Matching
 Suggestions
       │
       ▼
 Analysis Results
       │
       ▼
 Analytics Dashboard
```

---

## 📂 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── AnalyticsPanel.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── CandidateComparison.tsx
│   │   ├── JobDescriptionInput.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopCandidates.tsx
│   │   └── UploadZone.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── supabase.ts
│   │   └── types.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── vite.config.ts
```

---

## 🚀 Workflow

1. Upload one or more resumes.
2. Enter the Job Title and Job Description.
3. Resumes are sent to a Supabase Edge Function.
4. The backend analyzes each resume.
5. Candidate scores, matched skills, missing skills, and suggestions are returned.
6. Results are displayed with analytics, rankings, filters, and comparison tools.

---

## 📊 Candidate Analysis

Each analyzed candidate includes:

- Overall Match Score
- Matched Skills
- Missing Skills
- Improvement Suggestions
- Resume File Name
- Candidate Name

---

## 📈 Dashboard Features

- Analytics Overview
- Top Candidates
- Candidate Cards
- Search Candidates
- Sort by Score, Name, or Skills
- Filter by Match Score
- Candidate Comparison

---

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ▶️ Running Locally

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

Preview production

```bash
npm run preview
```

---

## 📦 Future Improvements

- User Authentication
- Resume History
- Interview Recommendation Engine
- Recruiter Dashboard Persistence
- PDF Report Export
- Candidate Shortlisting
- AI Chat Assistant
- Advanced Analytics

---

## 📄 License

This project is intended for educational and portfolio purposes.
