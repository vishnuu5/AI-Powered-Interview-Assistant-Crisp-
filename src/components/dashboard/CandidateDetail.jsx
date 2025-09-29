export default function CandidateDetail({ candidate }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4">
        <div>
          <span className="text-[var(--muted)]">Name:</span>{" "}
          <span className="font-medium">{candidate.name}</span>
        </div>
        <div>
          <span className="text-[var(--muted)]">Email:</span>{" "}
          <span className="font-medium">{candidate.email}</span>
        </div>
        <div>
          <span className="text-[var(--muted)]">Phone:</span>{" "}
          <span className="font-medium">{candidate.phone}</span>
        </div>
        <div>
          <span className="text-[var(--muted)]">Final Score:</span>{" "}
          <span className="font-semibold">{candidate.finalScore}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">AI Summary</h4>
        <p className="text-sm">{candidate.summary}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Interview Transcript</h4>
        <ol className="space-y-2 list-decimal pl-5">
          {candidate.interview?.map((q, idx) => (
            <li key={q.id}>
              <div className="font-medium">
                Q{idx + 1} [{q.difficulty}] — {q.text}
              </div>
              <div className="text-sm">
                <span className="text-[var(--muted)]">Answer:</span>{" "}
                {q.answer?.text || "(no response)"}
              </div>
              <div className="text-sm">
                <span className="text-[var(--muted)]">Score:</span>{" "}
                {q.answer?.score ?? 0}/10
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
