"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const scrollToBottom = (smooth = false) => {
    const el = messagesRef.current;
    if (!el) return;
    if (smooth && "scrollTo" in el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (open) scrollToBottom(false);
  }, [messages, open]);

  useEffect(() => {
    if (open) scrollToBottom(true);
  }, [messages]);

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
          style={{ backgroundColor: "var(--color-primary)" }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200"
        >
          <HugeiconsIcon icon={BubbleChatIcon} />
        </button>
      )}

      {/* Expanded full-width panel */}
      <div
        className={`fixed z-50 left-0 right-0 bottom-0 transition-all duration-300 px-4 sm:px-8 pt-6 ${
          open
            ? "h-[40vh] md:h-[35vh] opacity-100"
            : "h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
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

          {/* messages: prevent horizontal overflow, allow wrapping */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto px-6 py-6 text-sm text-gray-800 overflow-x-hidden"
          >
            {messages.length === 0 ? (
              <div className="text-gray-400">No messages yet.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="mb-2">
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded max-w-full break-words whitespace-normal overflow-hidden">
                    {m}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bordered wrapper containing input and button:
              ensure flex children can shrink and input won't cause horizontal scroll */}
          <div className="px-6 py-4">
            <div
              className="w-full border rounded-lg flex items-center gap-2 px-3 py-2 min-w-0"
              style={{ borderColor: "var(--color-secondary)" }}
            >
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                placeholder="Ask anything..."
              />
              <button
                onClick={send}
                className="text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                <HugeiconsIcon icon={Sent02Icon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
