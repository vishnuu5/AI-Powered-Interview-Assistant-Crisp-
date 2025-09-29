import { useDispatch, useSelector } from "react-redux";
import ResumeUploader from "../components/interview/ResumeUploader";
import MissingFieldsPrompt from "../components/interview/MissingFieldsPrompt";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import Timer from "../components/chat/Timer";
import {
  selectSession,
  startInterview,
  submitAnswer,
  nextQuestion,
  autoSubmitCurrent,
  tickTimer,
  completeInterviewIfDone,
} from "../store/slices/sessionSlice";
import { useEffect } from "react";

export default function Interviewee() {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const { status, questions, questionIndex, timer } = session;
  const currentQuestion = questions[questionIndex] || null;

  // start ticking while in progress
  useEffect(() => {
    if (status !== "inProgress") return;
    const id = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);
    return () => clearInterval(id);
  }, [status, dispatch]);

  // when completed, snapshot to candidates list once
  useEffect(() => {
    if (status === "completed") {
      dispatch(completeInterviewIfDone());
    }
  }, [status, dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <div className="rounded-lg border border-neutral-200 p-4 bg-white">
          {status === "idle" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Upload your resume (PDF preferred, DOCX optional)
              </h2>
              <ResumeUploader />
              <p className="text-sm text-[var(--muted)]">
                We’ll extract your Name, Email, and Phone. If anything is
                missing, we’ll ask before starting.
              </p>
            </div>
          )}

          {status === "collect" && <MissingFieldsPrompt />}

          {status !== "idle" && (
            <>
              <div className="mb-4">
                <Timer
                  key={currentQuestion ? currentQuestion.id : "done"}
                  active={status === "inProgress"}
                  secondsRemaining={timer.secondsRemaining}
                  onElapsed={() => {
                    // auto-submit and move on when timer ends
                    dispatch(autoSubmitCurrent());
                    dispatch(nextQuestion());
                  }}
                />
              </div>
              <ChatWindow />
              {status === "inProgress" && currentQuestion ? (
                <ChatInput
                  placeholder="Type your answer..."
                  onSend={(text) => {
                    dispatch(submitAnswer({ text }));
                    dispatch(nextQuestion());
                  }}
                />
              ) : null}
            </>
          )}
        </div>
      </section>

      <aside className="lg:col-span-1">
        <div className="rounded-lg border border-neutral-200 p-4 bg-white">
          <h3 className="font-semibold mb-2">Interview Progress</h3>
          <div className="text-sm">
            <div>Questions: {Math.min(questionIndex, 6)} / 6</div>
            <div>
              Status: <span className="capitalize">{status}</span>
            </div>
          </div>
          {status === "collect" && (
            <button
              className="mt-4 w-full bg-primary text-white py-2 rounded-md disabled:opacity-50"
              onClick={() => dispatch(startInterview())}
              disabled
              title="Provide missing fields first"
            >
              Start Interview
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
