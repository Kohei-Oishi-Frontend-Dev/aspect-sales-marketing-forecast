"use client";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Cancel01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, text.trim()]);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Collapsed bubble in bottom-right */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200"
        >
          <HugeiconsIcon icon={BubbleChatIcon} />
          <span className="text-sm font-medium">
            Investigate in more details
          </span>
        </button>
      )}

      {/* Expanded full-width panel */}
      <div
        className={`fixed z-50 left-0 right-0 bottom-0 transition-all duration-300 px-8 pt-6 rounded-lg ${
          open
            ? "h-[40vh] md:h-[35vh] opacity-50"
            : "h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* make this container relative so absolute close button overlays */}
        <div className="h-full bg-white shadow-xl max-w-full mx-auto flex flex-col relative">
          {/* Absolute close button in top-right corner */}
          <div className="absolute top-3 right-3 z-50">
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded bg-white/80 backdrop-blur-sm"
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-800">
            {messages.length === 0 ? (
              <div className="text-gray-400">No messages yet.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="mb-2">
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded">
                    {m}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 flex gap-2 items-center">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 border rounded px-3 py-2 text-sm shadow-sm"
              placeholder="Type a message..."
            />
            <button
              onClick={send}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              <HugeiconsIcon icon={Sent02Icon} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
