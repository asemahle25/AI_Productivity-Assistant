import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { CHAT_MODEL, getGateway } from "./ai-gateway.server";
import { buildToolPrompt, ToolInputSchema } from "./ai-prompts";

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInputSchema.parse(input))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { system, prompt } = buildToolPrompt(data);

    try {
      const result = streamText({
        model: gateway(CHAT_MODEL),
        system,
        prompt,
        temperature: 0.6,
      });
      return { text: await result.text };
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      const message =
        status === 429
          ? "The assistant is rate limited right now. Please try again in a moment."
          : status === 402
            ? "AI credits are exhausted for this workspace. Add credits in Lovable to continue."
            : status === 403
              ? "AI access is blocked by workspace policy."
              : ((error as Error)?.message ?? "The assistant could not complete this request.");
      throw new Error(message);
    }
  });

export type RunAssistantInput = z.infer<typeof ToolInputSchema>;
