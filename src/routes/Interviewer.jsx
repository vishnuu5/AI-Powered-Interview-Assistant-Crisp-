import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCandidates } from "../store/slices/candidatesSlice";
import CandidateTable from "../components/dashboard/CandidateTable";
import CandidateDetail from "../components/dashboard/CandidateDetail";

export default function Interviewer() {
  const candidates = useSelector(selectCandidates);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("scoreDesc");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = candidates.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      if (sort === "scoreAsc") return (a.finalScore ?? 0) - (b.finalScore ?? 0);
      return (b.finalScore ?? 0) - (a.finalScore ?? 0);
    });
    return list;
  }, [candidates, query, sort]);

  const selected = candidates.find((c) => c.id === selectedId) || null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          className="w-full sm:max-w-xs border border-neutral-200 rounded-md px-3 py-2"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border border-neutral-200 rounded-md px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="scoreDesc">Score: High → Low</option>
          <option value="scoreAsc">Score: Low → High</option>
        </select>
      </div>

      <CandidateTable rows={filtered} onSelect={setSelectedId} />

      {selected ? (
        <div className="rounded-lg border border-neutral-200 p-4 bg-white">
          <CandidateDetail candidate={selected} />
        </div>
      ) : null}
    </div>
  );
}
