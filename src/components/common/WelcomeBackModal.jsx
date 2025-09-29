import { useDispatch, useSelector } from "react-redux";
import {
  selectUnfinishedSession,
  resumeSession,
  resetSession,
} from "../../store/slices/sessionSlice";
import { useEffect, useState } from "react";

export default function WelcomeBackModal({ onContinue }) {
  const unfinished = useSelector(selectUnfinishedSession);
  const [open, setOpen] = useState(!!unfinished);
  const dispatch = useDispatch();

  useEffect(() => setOpen(!!unfinished), [unfinished]);

  if (!open || !unfinished) return null;

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold">Welcome Back</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You have an unfinished interview in progress. Would you like to
          resume?
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 rounded-md border border-neutral-200"
            onClick={() => {
              setOpen(false);
            }}
          >
            Dismiss
          </button>
          <button
            className="px-3 py-2 rounded-md bg-primary text-white"
            onClick={() => {
              dispatch(resumeSession());
              setOpen(false);
              onContinue?.();
            }}
          >
            Continue
          </button>
          <button
            className="px-3 py-2 rounded-md bg-red-600 text-white"
            onClick={() => {
              dispatch(resetSession());
              setOpen(false);
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
