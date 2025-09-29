const POOL = {
  easy: [
    "Explain the difference between var, let, and const in JavaScript.",
    "What is JSX and how does it relate to React?",
    "How do you manage component state in React?",
    "What is npm and what is package.json used for?",
  ],
  medium: [
    "Describe how React hooks like useEffect and useMemo work and when to use them.",
    "How would you structure a REST API in Node.js with Express for basic CRUD?",
    "Explain how to optimize React rendering and avoid unnecessary re-renders.",
    "How do you handle authentication (sessions/JWT) in a Node/Express app?",
  ],
  hard: [
    "Design a full-stack app architecture for a real-time chat using React and Node (WebSockets).",
    "Explain Horizontal vs Vertical scaling in Node and how to make it resilient.",
    "How do you implement server-side pagination and filtering efficiently?",
    "Compare SSR, CSR, and SSG. When would you choose each?",
  ],
};

const LIMITS = { easy: 20, medium: 60, hard: 120 };

export function buildInterviewPlan() {
  // 2 easy → 2 medium → 2 hard
  function pickTwo(arr) {
    const copy = [...arr];
    copy.sort(() => Math.random() - 0.5);
    return copy.slice(0, 2);
  }
  const plan = [
    ...pickTwo(POOL.easy).map((text) => ({
      id: cryptoRandomId(),
      difficulty: "easy",
      text,
      timeLimit: LIMITS.easy,
    })),
    ...pickTwo(POOL.medium).map((text) => ({
      id: cryptoRandomId(),
      difficulty: "medium",
      text,
      timeLimit: LIMITS.medium,
    })),
    ...pickTwo(POOL.hard).map((text) => ({
      id: cryptoRandomId(),
      difficulty: "hard",
      text,
      timeLimit: LIMITS.hard,
    })),
  ];
  return plan;
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// naive keyword-based scoring
export function scoreAnswer(question, answerText) {
  const text = (answerText || "").toLowerCase();
  const diffBase = { easy: 3, medium: 6, hard: 10 }[question.difficulty] || 5;

  let score = 0;
  const keywords = pickKeywords(question.text);
  keywords.forEach((k) => {
    if (text.includes(k)) score += Math.ceil(diffBase / keywords.length);
  });
  if (text.length > 40) score += 1;
  if (text.includes("example") || text.includes("for instance")) score += 1;
  score = Math.min(10, Math.max(0, score));
  return score;
}

function pickKeywords(qtext) {
  const map = [
    {
      match: "var, let, and const",
      keys: ["var", "let", "const", "scope", "hoist"],
    },
    { match: "JSX", keys: ["jsx", "babel", "react element", "transpile"] },
    { match: "state", keys: ["state", "useState", "props", "lift state"] },
    { match: "hooks", keys: ["useeffect", "usememo", "deps", "memoization"] },
    { match: "express", keys: ["express", "crud", "router", "middleware"] },
    {
      match: "optimize React",
      keys: ["memo", "usememo", "usecallback", "re-render"],
    },
    { match: "authentication", keys: ["jwt", "session", "cookie", "oauth"] },
    { match: "websockets", keys: ["websocket", "socket.io", "real-time"] },
    {
      match: "scaling",
      keys: ["cluster", "horizontal", "vertical", "load balanc"],
    },
    { match: "pagination", keys: ["limit", "offset", "cursor", "filter"] },
    { match: "SSR, CSR, and SSG", keys: ["ssr", "csr", "ssg", "hydration"] },
  ];
  const lower = qtext.toLowerCase();
  for (const m of map) {
    if (lower.includes(m.match.toLowerCase())) return m.keys;
  }
  return ["react", "node", "state", "api"];
}

export function summarizeCandidate(profile, questions, finalScore) {
  const strengths = [];
  const weaknesses = [];
  questions.forEach((q) => {
    const s = q.answer?.score ?? 0;
    if (s >= 7) strengths.push(q.difficulty);
    if (s <= 3) weaknesses.push(q.difficulty);
  });
  return `${profile.name || "Candidate"} scored ${finalScore}/60. Strengths: ${
    uniq(strengths).join(", ") || "—"
  }. Needs improvement: ${uniq(weaknesses).join(", ") || "—"}.`;
}

function uniq(arr) {
  return [...new Set(arr)];
}
