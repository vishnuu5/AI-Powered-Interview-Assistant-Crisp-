# Crisp — AI-Powered Interview Assistant

A modern AI-powered interview assistant with dual-pane interface for conducting structured interviews and managing candidate data.

## Features

### Core Functionality

- **Resume Upload**: Drag & drop PDF/DOCX files with automatic field extraction
- **Interview Flow**: 6 structured questions (2 Easy → 2 Medium → 2 Hard) with timers
- **Dual Interface**:
  - **Interviewee Tab**: Upload resume, answer questions, view progress
  - **Interviewer Tab**: Dashboard with candidate management and scoring
- **Data Persistence**: All progress saved locally with session recovery
- **Modern UI**: Beautiful Tailwind CSS design with responsive layout

### Interview Structure

- **Easy Questions**: 20 seconds each (2 questions)
- **Medium Questions**: 60 seconds each (2 questions)
- **Hard Questions**: 120 seconds each (2 questions)
- **Auto-advance**: Timer automatically submits and moves to next question
- **Scoring**: AI-powered answer evaluation with final summary

## Tech Stack

- **Frontend**: Vite + React 18 (JavaScript)
- **State Management**: Redux Toolkit + redux-persist
- **Styling**: Tailwind CSS with custom design system
- **File Processing**: pdfjs-dist + mammoth for PDF/DOCX parsing
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Deplyoment

**Project Demo**

[View Project Demo]()

## Installation & Setup

```bash
git clone https://github.com/vishnuu5/AI-Powered-Interview-Assistant-Crisp-.git
cd ai-powered_interview_assistant_crisp_swipe

npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Common Problems & Solutions

### 1. PDF.js Worker Import Error

**Problem**:

```
Failed to resolve import "pdfjs-dist/build/pdf.worker.min.js?url"
```

**Solution**:
Update the import path in `src/utils/parseResume.js`:

```javascript
// Old (causes error)
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

// New (works with pdfjs-dist v5.4+)
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
```

**Why**: Newer versions of pdfjs-dist use `.mjs` files instead of `.js` files.

### 2. Tailwind CSS Not Working

**Problem**: Tailwind classes not being applied or detected.

**Solution**: Fix the content paths in `tailwind.config.js`:

```javascript
// Old (incorrect paths)
content: ["./index.html", "./src/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],

// New (correct paths)
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
```

**Additional Fix**: Update CSS variables in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}
```

### 3. Data Persistence Issues

**Problem**: Data not persisting between sessions or localStorage errors.

**Solution**: Use the built-in clear data functionality:

```javascript
// Method 1: Use the Clear Data button in the UI
// Located in the navigation bar

// Method 2: Programmatically clear data
import { clearAllData } from "./src/utils/clearData";
clearAllData();

// Method 3: Manual browser cleanup
// F12 → Application → Local Storage → Delete "crisp-ai" key
```

### 4. File Upload Not Working

**Problem**: File upload component not responding or showing errors.

**Solution**: Check file validation in `src/components/interview/ResumeUploader.jsx`:

```javascript
// Ensure proper file type validation
if (!/pdf|docx$/i.test(file.name)) {
  setError("Invalid file type. Please upload a PDF or DOCX.");
  return;
}

// Check file size limit
if (file.size > 10 * 1024 * 1024) {
  setError("File too large. Max 10MB.");
  return;
}
```

## UI Components

### Resume Uploader

- **Drag & Drop**: Modern file upload with visual feedback
- **File Validation**: Automatic PDF/DOCX validation
- **Progress States**: Loading, success, and error states
- **File Info**: Displays file name and size

### Interview Interface

- **Timer Component**: Countdown with auto-submit
- **Chat Window**: Question display and answer input
- **Progress Tracking**: Visual progress indicators

### Dashboard

- **Candidate Table**: Sortable list with scores
- **Search Functionality**: Filter candidates by name/email
- **Detail View**: Full interview transcript and scoring

## License

This project is licensed under the MIT License.
