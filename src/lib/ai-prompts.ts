import { z } from "zod";

export const ToolInputSchema = z.object({
  tool: z.enum(["email", "meeting", "planner", "research"]),
  fields: z.record(z.string()),
});

export type ToolInput = z.infer<typeof ToolInputSchema>;

const BASE_SYSTEM =
  "You are an AI workplace productivity assistant for busy professionals. " +
  "You write clear, concise, well-structured business output in markdown. " +
  "Never invent facts, names, figures, or citations; if information is missing, " +
  "state the assumption explicitly in an 'Assumptions' line. Keep a professional tone.";

export function buildToolPrompt(input: ToolInput): { system: string; prompt: string } {
  const f = input.fields;

  switch (input.tool) {
    case "email":
      return {
        system: `${BASE_SYSTEM} You specialise in professional email writing.`,
        prompt: [
          "Write a workplace email.",
          `Recipient: ${f.recipient || "unspecified"}`,
          `Purpose: ${f.purpose || "unspecified"}`,
          `Tone: ${f.tone || "professional"}`,
          `Length: ${f.length || "medium"}`,
          `Key points to include: ${f.context || "none provided"}`,
          "",
          "Return: a suggested subject line (as a bold first line), then the email body,",
          "then a short list of 2 alternative subject lines.",
        ].join("\n"),
      };
    case "meeting":
      return {
        system: `${BASE_SYSTEM} You specialise in summarising meetings.`,
        prompt: [
          "Summarise the following meeting notes or transcript.",
          `Meeting type: ${f.meetingType || "team meeting"}`,
          `Audience for the summary: ${f.audience || "the whole team"}`,
          "",
          "Return these markdown sections: '## Summary' (3-5 bullets),",
          "'## Decisions', '## Action Items' (a markdown table with Owner, Action, Due date),",
          "and '## Open Questions'. Only use information present in the notes.",
          "",
          "Notes:",
          f.notes || "",
        ].join("\n"),
      };
    case "planner":
      return {
        system: `${BASE_SYSTEM} You specialise in planning and prioritisation.`,
        prompt: [
          "Create an actionable task plan.",
          `Goal: ${f.goal || "unspecified"}`,
          `Timeframe: ${f.timeframe || "1 week"}`,
          `Working hours available: ${f.capacity || "unspecified"}`,
          `Known constraints or dependencies: ${f.constraints || "none provided"}`,
          "",
          "Return: '## Plan Overview' (2-3 sentences), '## Prioritised Tasks'",
          "(markdown table: Priority, Task, Estimated effort, Suggested day/slot),",
          "'## Risks' and '## Quick Wins'.",
        ].join("\n"),
      };
    case "research":
      return {
        system: `${BASE_SYSTEM} You specialise in structured research briefs. You have no live web access, so rely on general knowledge and flag anything that needs verification.`,
        prompt: [
          "Produce a research brief.",
          `Topic / question: ${f.topic || "unspecified"}`,
          `Depth: ${f.depth || "standard"}`,
          `Perspective: ${f.perspective || "business"}`,
          "",
          "Return: '## Key Findings' (bullets), '## Detail' (short sections),",
          "'## Considerations & Trade-offs', '## Suggested Next Steps',",
          "and '## Verify Before Use' listing claims that need a primary source.",
        ].join("\n"),
      };
  }
}
