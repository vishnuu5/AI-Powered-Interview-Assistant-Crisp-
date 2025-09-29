import { createSlice, nanoid } from "@reduxjs/toolkit";
import {
  buildInterviewPlan,
  scoreAnswer,
  summarizeCandidate,
} from "../../utils/aiEngine";
import { upsertCandidate } from "./candidatesSlice";

const initialState = {
  status: "idle", // idle | collect | inProgress | completed
  profile: { name: "", email: "", phone: "" },
  chat: [],
  questions: [],
  questionIndex: 0,
  timer: {
    deadline: 0,
    secondsRemaining: 0,
  },
  currentCandidateId: null,
};

const pushSystem = (state, text) => {
  state.chat.push({ id: nanoid(), role: "system", text, ts: Date.now() });
};
const pushUser = (state, text) => {
  state.chat.push({ id: nanoid(), role: "user", text, ts: Date.now() });
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setExtractedProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setStatusCollect: (state) => {
      state.status = "collect";
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    startInterview: (state) => {
      const { name, email, phone } = state.profile;
      if (!name || !email || !phone) return;
      state.questions = buildInterviewPlan();
      state.questionIndex = 0;
      state.status = "inProgress";
      state.currentCandidateId = nanoid();
      // Start first question
      const q = state.questions[0];
      pushSystem(state, `Q1 [${q.difficulty}]: ${q.text}`);
      const now = Date.now();
      state.timer.deadline = now + q.timeLimit * 1000;
      state.timer.secondsRemaining = Math.ceil(
        (state.timer.deadline - now) / 1000
      );
    },
    tickTimer: (state) => {
      if (state.status !== "inProgress") return;
      const rem = Math.max(
        0,
        Math.ceil((state.timer.deadline - Date.now()) / 1000)
      );
      state.timer.secondsRemaining = rem;
    },
    submitAnswer: (state, action) => {
      if (state.status !== "inProgress") return;
      const q = state.questions[state.questionIndex];
      const text = (action.payload?.text || "").trim();
      if (!text) return;
      pushUser(state, text);
      const score = scoreAnswer(q, text);
      q.answer = { text, score, auto: false };
    },
    autoSubmitCurrent: (state) => {
      if (state.status !== "inProgress") return;
      const q = state.questions[state.questionIndex];
      if (q.answer) return; // already answered
      const text = ""; // empty auto-submission
      pushUser(state, "(Time up — auto submitted)");
      const score = scoreAnswer(q, text);
      q.answer = { text, score, auto: true };
    },
    nextQuestion: (state) => {
      if (state.status !== "inProgress") return;
      const nextIdx = state.questionIndex + 1;
      if (nextIdx >= state.questions.length) {
        // finish
        const finalScore = Math.round(
          state.questions.reduce((a, q) => a + (q.answer?.score ?? 0), 0)
        );
        const summary = summarizeCandidate(
          state.profile,
          state.questions,
          finalScore
        );
        pushSystem(state, `Interview complete. Final Score: ${finalScore}`);
        state.status = "completed";
        state.timer.deadline = 0;
        state.timer.secondsRemaining = 0;
        // snapshot interview for dashboard
        // will be dispatched by thunk via completeInterview
      } else {
        state.questionIndex = nextIdx;
        const q = state.questions[nextIdx];
        pushSystem(state, `Q${nextIdx + 1} [${q.difficulty}]: ${q.text}`);
        const now = Date.now();
        state.timer.deadline = now + q.timeLimit * 1000;
        state.timer.secondsRemaining = Math.ceil(
          (state.timer.deadline - now) / 1000
        );
      }
    },
    resumeSession: (state) => {
      if (state.status !== "inProgress") return;
      // timer will recalibrate by tickTimer in UI
    },
    resetSession: () => initialState,
    clearAllData: () => initialState,
  },
});

export const {
  setExtractedProfile,
  setStatusCollect,
  updateProfile,
  startInterview,
  tickTimer,
  submitAnswer,
  autoSubmitCurrent,
  nextQuestion,
  resumeSession,
  resetSession,
  clearAllData,
} = sessionSlice.actions;

export const selectSession = (s) => s.session;
export const selectUnfinishedSession = (s) =>
  s.session.status === "inProgress" || s.session.status === "collect";

export default sessionSlice.reducer;

// Thunks
export const completeInterviewIfDone = () => (dispatch, getState) => {
  const s = getState().session;
  if (s.status !== "completed") return;
  const finalScore = Math.round(
    s.questions.reduce((a, q) => a + (q.answer?.score ?? 0), 0)
  );
  const summary = summarizeCandidate(s.profile, s.questions, finalScore);
  dispatch(
    upsertCandidate({
      id: s.currentCandidateId,
      name: s.profile.name,
      email: s.profile.email,
      phone: s.profile.phone,
      finalScore,
      summary,
      interview: s.questions.map((q) => ({
        id: q.id,
        difficulty: q.difficulty,
        text: q.text,
        answer: q.answer,
      })),
    })
  );
};
