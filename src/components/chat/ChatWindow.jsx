import { useSelector } from "react-redux";
import { selectSession } from "../../store/slices/sessionSlice";
import clsx from "classnames";

export default function ChatWindow() {
  const { chat } = useSelector(selectSession);
  return (
    <div className="h-[420px] overflow-y-auto border border-neutral-200 rounded-md p-3 bg-[var(--card)]">
      <ul className="space-y-2">
        {chat.map((m) => (
          <li
            key={m.id}
            className={clsx("max-w-[80%] rounded-lg p-2", {
              "bg-white ml-auto border border-neutral-200": m.role === "user",
              "bg-primary text-white": m.role === "system",
            })}
          >
            <div className="whitespace-pre-wrap text-sm">{m.text}</div>
            <div
              className={clsx("mt-1 text-[10px] opacity-80", {
                "text-white": m.role === "system",
                "text-[var(--muted)]": m.role === "user",
              })}
            >
              {new Date(m.ts).toLocaleTimeString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
