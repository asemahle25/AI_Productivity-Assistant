import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured prompts, tone control and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with tone control.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="Professional emails with the right tone, drafted in seconds"
    >
      <ToolWorkspace
        tool="email"
        submitLabel="Generate email"
        fields={[
          {
            name: "recipient",
            label: "Recipient",
            type: "input",
            placeholder: "e.g. Head of Finance, external client",
            required: true,
          },
          {
            name: "purpose",
            label: "Purpose",
            type: "input",
            placeholder: "e.g. request budget approval for Q3 tooling",
            required: true,
          },
          {
            name: "tone",
            label: "Tone",
            type: "select",
            options: ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"],
            defaultValue: "Professional",
          },
          {
            name: "length",
            label: "Length",
            type: "select",
            options: ["Short", "Medium", "Detailed"],
            defaultValue: "Medium",
          },
          {
            name: "context",
            label: "Key points & context",
            type: "textarea",
            rows: 6,
            placeholder: "Bullet the facts, deadlines and asks you want included.",
          },
        ]}
        tips={[
          "Give concrete facts — the assistant will not invent numbers.",
          "Switch tone and regenerate to compare drafts.",
        ]}
      />
    </AppShell>
  );
}
