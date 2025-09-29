"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Cancel01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChartBarDefault } from "@/components/ui/BarChart";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// new: chart shape returned inside chat responses
type Chart = {
  type?: string; // e.g. "line" | "area" | "bar"
  title?: string;
  data?: unknown[]; // array of datapoints, keep generic or refine to your schema
  config?: Record<string, unknown> | null;
  aggregate_data?: unknown | null;
};

// Add chart to message shape
type ChatMessage = {
  role: "user" | "bot";
  text: string;
  chart?: Chart | null;
};

async function fetchChatResponse(): Promise<Post> {
  const response = await fetch("/chat.json");
  return response.json();
}

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // messages now may contain chart payloads
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // optional separate chart state can remain, but chart is now stored on messages
  const [chart, setChart] = useState<Chart | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["chat"],
    queryFn: fetchChatResponse,
    enabled: open, // fetch only when chat is open
  });

  const mutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const r = await fetch("/chat.json");
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return await r.json();
    },
    onSuccess: (data) => {
      const botText = String(data?.message ?? data?.body ?? "No body");

      // parse chart if present and split out aggregate_data (first item)
      const parsedChart: Chart | undefined =
        data?.chart && typeof data.chart === "object"
          ? (() => {
              const raw = Array.isArray(data.chart.data) ? data.chart.data : [];
              const aggregate = raw.length > 0 ? raw[0] : null;
              const items = raw.length > 1 ? raw.slice(1) : [];
              return {
                type: data.chart.type,
                title: data.chart.title,
                // only pass the rest (without the first index) to the chart renderer
                data: items,
                config: data.chart.config ?? null,
                aggregate_data: aggregate,
              } as Chart;
            })()
          : undefined;

      // append bot message with optional chart (chart.data now excludes the aggregate)
      setMessages((m) => [
        ...m,
        { role: "bot", text: botText, chart: parsedChart ?? null },
      ]);

      // keep separate quick-access chart state if you need it elsewhere
      if (parsedChart) setChart(parsedChart);
    },
    onError: (err) => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: `Error: ${String(err.message ?? err)}`, chart: null },
      ]);
    },
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
          open ? "h-[50vh] md:h-[60vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
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

          {/* messages: grow to fill available space, leave bottom padding for input */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto px-6 py-6 pb-28 text-sm text-gray-800 overflow-x-hidden"
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
                  key={`${i}-${m.role}`}
                  // use column layout so bubble stays aligned left/right but chart can expand full width
                  className={`mb-2 flex flex-col mb-6 w-full ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`inline-block relative px-4 py-2 rounded-lg w-fit max-w-[60%] break-words whitespace-normal overflow-hidden shadow-md ${
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

                  {/* chart: occupy 50% of the chat container, align to message side */}
                  {m.chart?.type === "bar" && Array.isArray(m.chart.data) && (
                    <div className={`mt-3 w-1/2 max-w-[50%] ${m.role === "user" ? "self-end" : "self-start"}`}>
                      <ChartBarDefault
                        data={m.chart.data as any[]}
                        title={m.chart.title}
                        aggregate={m.chart.aggregate_data ?? null}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input fixed to bottom of panel */}
          <div className="absolute left-0 right-0 bottom-0 px-6 py-4 bg-white shadow">
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
