import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into a clean summary with decisions, owners and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Summaries with decisions, owners and action items from raw notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Decisions, owners and action items extracted from raw notes"
    >
      <ToolWorkspace
        tool="meeting"
        submitLabel="Summarize notes"
        fields={[
          {
            name: "meetingType",
            label: "Meeting type",
            type: "select",
            options: [
              "Team stand-up",
              "Project review",
              "Client meeting",
              "1:1",
              "Workshop",
              "Board / leadership",
            ],
            defaultValue: "Project review",
          },
          {
            name: "audience",
            label: "Summary audience",
            type: "input",
            placeholder: "e.g. attendees, leadership, the wider team",
          },
          {
            name: "notes",
            label: "Raw notes or transcript",
            type: "textarea",
            rows: 14,
            placeholder: "Paste your meeting notes or transcript here.",
            required: true,
          },
        ]}
        tips={[
          "Only what appears in the notes is used — nothing is invented.",
          "Include names next to points so owners are assigned correctly.",
        ]}
      />
    </AppShell>
  );
}
