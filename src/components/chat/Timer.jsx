import { useEffect, useRef, useState } from "react";

export default function Timer({ active, secondsRemaining, onElapsed }) {
  const [seconds, setSeconds] = useState(secondsRemaining || 0);
  const timerRef = useRef(null);

  useEffect(() => setSeconds(secondsRemaining || 0), [secondsRemaining]);

  useEffect(() => {
    if (!active) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          onElapsed?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active, onElapsed]);

  if (!active) return null;

  return (
    <div
      className="w-full bg-neutral-200 rounded-md h-2"
      role="status"
      aria-label="Question timer"
    >
      <div
        className="h-2 rounded-md bg-accent transition-all"
        style={{
          width: `${Math.max(
            0,
            (seconds / Math.max(1, secondsRemaining)) * 100
          )}%`,
        }}
      />
      <div className="mt-1 text-xs text-[var(--muted)]">
        {seconds}s remaining
      </div>
    </div>
  );
}
