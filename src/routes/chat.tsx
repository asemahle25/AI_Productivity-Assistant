import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Loader2, Send, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant — More Productive Workday" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant to draft, plan, summarise and think through work problems.",
      },
      { property: "og:title", content: "AI Chatbot Assistant — More Productive Workday" },
      {
        property: "og:description",
        content: "Chat with an AI assistant built for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

const suggestions = [
  "Help me reply to a client asking for a discount",
  "Turn these bullet points into a status update",
  "What should I prioritise this week if I only have 8 hours?",
  "Explain our new policy in simple language for the team",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <AppShell
      title="AI Chatbot"
      description="Ask anything about your day-to-day work"
    >
      <div className="grid gap-4">
        <Card className="flex h-[62vh] flex-col overflow-hidden p-0 shadow-[var(--shadow-panel)]">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
            {messages.length === 0 && (
              <div className="mx-auto max-w-lg py-8 text-center">
                <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Bot className="size-5" />
                </span>
                <h2 className="text-base font-semibold">How can I help with your work today?</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-lg border border-border bg-background p-3 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as { text: string }).text)
                .join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
                  {!isUser && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Bot className="size-4" />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <article className="prose-output max-w-none">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </article>
                    )}
                  </div>
                  {isUser && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <User className="size-4" />
                    </span>
                  )}
                </div>
              );
            })}

            {status === "submitted" && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Thinking…
              </p>
            )}
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {error.message || "The assistant is unavailable right now. Please try again."}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-border bg-background p-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Ask about emails, meetings, planning or research…"
              className="min-h-[52px] resize-none"
            />
            <Button type="submit" disabled={busy || !input.trim()} size="icon" className="size-11">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </form>
        </Card>
        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
