export default function CandidateTable({ rows, onSelect }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--card)]">
          <tr>
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2">Email</th>
            <th className="text-left px-3 py-2">Phone</th>
            <th className="text-left px-3 py-2">Final Score</th>
            <th className="text-left px-3 py-2">Summary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-t border-neutral-200 hover:bg-neutral-50 cursor-pointer"
              onClick={() => onSelect?.(r.id)}
            >
              <td className="px-3 py-2">{r.name || "-"}</td>
              <td className="px-3 py-2">{r.email || "-"}</td>
              <td className="px-3 py-2">{r.phone || "-"}</td>
              <td className="px-3 py-2 font-medium">{r.finalScore ?? "-"}</td>
              <td className="px-3 py-2 truncate max-w-[320px]">
                {r.summary || "-"}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-3 py-6 text-center text-[var(--muted)]"
              >
                No candidates yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
