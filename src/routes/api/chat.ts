import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { CHAT_MODEL, getGateway } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages: UIMessage[] };

        try {
          const gateway = getGateway();
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system:
              "You are the AI Workplace Productivity Assistant. You help professionals draft " +
              "emails, summarise meetings, plan work, and think through workplace problems. " +
              "Answer in clear markdown, be concise, and never invent facts, figures, or " +
              "citations — flag anything that needs human verification.",
            messages: convertToModelMessages(body.messages),
          });
          return result.toUIMessageStreamResponse();
        } catch (error) {
          const status = (error as { statusCode?: number })?.statusCode ?? 500;
          return new Response(
            JSON.stringify({ error: (error as Error).message ?? "Assistant unavailable" }),
            { status, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
