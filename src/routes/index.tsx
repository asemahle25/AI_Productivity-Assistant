import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarCheck, Mail, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday work: draft emails, summarise meetings, plan tasks, run research and chat with an AI assistant built for professionals.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan tasks and research faster with one AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Professional drafts with controlled tone, length and key points.",
  },
  {
    to: "/meetings",
    icon: CalendarCheck,
    title: "Meeting Notes Summarizer",
    description: "Decisions, owners and action items pulled from raw notes.",
  },
  {
    to: "/planner",
    icon: Sparkles,
    title: "AI Task Planner",
    description: "Prioritised, time-boxed plans that respect your real capacity.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Structured briefs with trade-offs and claims worth verifying.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    description: "Open-ended help for anything else on your plate.",
  },
] as const;

const stats = [
  { label: "Workflows available", value: "5" },
  { label: "Outputs", value: "Fully editable" },
  { label: "Setup required", value: "None" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks"
    >
      <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-panel)] md:p-10">
        <p className="text-xs font-medium uppercase tracking-widest text-brand">
          Workplace automation
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold md:text-4xl">
          Spend less time writing, summarising and planning.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Five focused AI workflows with structured prompts, so you get usable, editable output on
          the first try — not a blank chat box.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Open the chatbot
          </Link>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 font-display text-lg font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Workflows
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-panel)]">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="size-4" />
                </span>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AiDisclaimer className="mt-8" />
    </AppShell>
  );
}
