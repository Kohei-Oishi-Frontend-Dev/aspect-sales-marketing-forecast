"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Cancel01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import { useQuery, useMutation } from "@tanstack/react-query";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Add a typed message shape
type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

async function fetchChatResponse(): Promise<Post> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  return response.json();
}

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["chat"],
    queryFn: fetchChatResponse,
    enabled: open, // fetch only when chat is open
  });

  const mutation = useMutation<Post, Error, void>({
    mutationFn: async () => {
      const r = await fetch("https://jsonplaceholder.typicode.com/posts/1");
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return (await r.json()) as Post;
    },
    onSuccess: (data) =>
      setMessages((m) => [...m, { role: "bot", text: data.body ?? "No body" }]),
    onError: (err) =>
      setMessages((m) => [
        ...m,
        { role: "bot", text: `Error: ${String(err.message ?? err)}` },
      ]),
  });

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
  }, [messages, open]);

  const send = () => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    // push user message with role
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setText("");
    inputRef.current?.focus();
    mutation.mutate();
  };

  return (
    <>
      {/* Collapsed bubble in bottom-right */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 bg-aspect-blue"
        >
          <HugeiconsIcon icon={BubbleChatIcon} />
        </button>
      )}

      {/* Expanded full-width panel */}
      <div
        className={`fixed z-50 left-0 right-0 bottom-0 transition-all duration-300 px-4 sm:px-8 pt-6 ${
          open ? "h-[40vh] md:h-[35vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="h-full bg-white shadow-xl max-w-full mx-auto flex flex-col relative">
          {/* Absolute close button in top-right corner */}
          <div className="absolute top-3 right-3 z-50">
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-white/70 backdrop-blur-sm"
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </button>
          </div>

          {/* messages: prevent horizontal overflow, allow wrapping */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto px-6 py-6 text-sm text-gray-800 overflow-x-hidden"
          >
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-gray-400">No messages yet.</div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 flex mb-6 w-full ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`inline-block relative px-4 py-2 rounded-lg max-w-[80%] break-words whitespace-normal overflow-hidden shadow-md ${
                      m.role === "user"
                        ? "bg-aspect-blue text-white rounded-br-none"
                        : "bg-aspect-yellow text-black rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm leading-snug">{m.text}</div>
                    <span
                      className={`absolute bottom-0 w-3 h-3 transform rotate-45 ${
                        m.role === "user"
                          ? "right-[-6px] bg-aspect-blue shadow-md"
                          : "left-[-6px] bg-aspect-yellow shadow-sm"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bordered wrapper containing input and button:
              ensure flex children can shrink and input won't cause horizontal scroll */}
          <div className="px-6 py-4">
            <div className="w-full border rounded-lg flex items-center gap-2 px-3 py-2 min-w-0 border-[var(--color-secondary)]">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                placeholder="Hi stakeholders how can I help you today..."
              />
              <button
                onClick={send}
                className="text-white px-3 py-1 rounded text-sm flex items-center gap-2 bg-aspect-blue"
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
