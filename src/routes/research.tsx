import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Generate structured research briefs with key findings, trade-offs, next steps and claims to verify.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Structured research briefs with findings, trade-offs and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefs with findings, trade-offs and things to verify"
    >
      <ToolWorkspace
        tool="research"
        submitLabel="Create brief"
        fields={[
          {
            name: "topic",
            label: "Topic or question",
            type: "textarea",
            rows: 4,
            placeholder: "e.g. how do mid-size firms usually structure hybrid work policies?",
            required: true,
          },
          {
            name: "depth",
            label: "Depth",
            type: "select",
            options: ["Quick scan", "Standard", "In-depth"],
            defaultValue: "Standard",
          },
          {
            name: "perspective",
            label: "Perspective",
            type: "select",
            options: ["Business", "Technical", "Operations", "People & culture", "Financial"],
            defaultValue: "Business",
          },
        ]}
        tips={[
          "No live web access — treat findings as a starting point.",
          "Always check the 'Verify Before Use' section against primary sources.",
        ]}
      />
    </AppShell>
  );
}
