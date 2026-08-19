import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — More Productive Workday" },
      {
        name: "description",
        content:
          "Turn a goal into a prioritised, time-boxed task plan with effort estimates, risks and quick wins.",
      },
      { property: "og:title", content: "AI Task Planner — More Productive Workday" },
      {
        property: "og:description",
        content: "Prioritised task plans with effort estimates, risks and quick wins.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell
      title="AI Task Planner"
      description="From goal to prioritised, time-boxed plan"
    >
      <ToolWorkspace
        tool="planner"
        submitLabel="Build plan"
        fields={[
          {
            name: "goal",
            label: "Goal or deliverable",
            type: "textarea",
            rows: 4,
            placeholder: "e.g. launch the customer onboarding revamp",
            required: true,
          },
          {
            name: "timeframe",
            label: "Timeframe",
            type: "select",
            options: ["Today", "This week", "Two weeks", "This month", "This quarter"],
            defaultValue: "This week",
          },
          {
            name: "capacity",
            label: "Available capacity",
            type: "input",
            placeholder: "e.g. 10 focused hours per week",
          },
          {
            name: "constraints",
            label: "Constraints & dependencies",
            type: "textarea",
            rows: 5,
            placeholder: "Blockers, approvals needed, people involved, fixed dates.",
          },
        ]}
        tips={[
          "State real capacity so estimates stay realistic.",
          "Edit the generated table before moving it into your tracker.",
        ]}
      />
    </AppShell>
  );
}
