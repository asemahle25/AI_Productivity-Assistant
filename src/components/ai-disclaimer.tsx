import { ShieldAlert } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground ${className}`}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong className="font-medium text-foreground">Responsible AI:</strong> generated content
        can be inaccurate or incomplete. Always review, edit and verify facts before sharing, and
        avoid entering confidential or personal data.
      </span>
    </p>
  );
}
