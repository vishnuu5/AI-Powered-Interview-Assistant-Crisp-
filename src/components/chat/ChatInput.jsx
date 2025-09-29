import { useState } from "react";

export default function ChatInput({
  onSend,
  placeholder = "Type a message...",
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="mt-3 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        onSend?.(t);
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-neutral-200 rounded-md px-3 py-2"
      />
      <button
        className="bg-primary text-white px-4 py-2 rounded-md"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
