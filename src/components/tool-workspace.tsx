import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { runAssistant } from "@/lib/ai.functions";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export type Field = {
  name: string;
  label: string;
  type: "input" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  required?: boolean;
  rows?: number;
};

export function ToolWorkspace({
  tool,
  fields,
  submitLabel,
  tips,
}: {
  tool: "email" | "meeting" | "planner" | "research";
  fields: Field[];
  submitLabel: string;
  tips: string[];
}) {
  const run = useServerFn(runAssistant);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
  );
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => run({ data: { tool, fields: values } }),
    onSuccess: (res) => setOutput(res.text),
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const missing = fields.filter((f) => f.required && !values[f.name]?.trim());

  const submit = () => {
    if (missing.length) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    mutation.mutate();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool}-output.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <Card className="h-fit shadow-[var(--shadow-panel)]">
        <CardHeader>
          <CardTitle className="text-base">Structured prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? <span className="text-destructive"> *</span> : null}
              </Label>
              {f.type === "input" && (
                <Input
                  id={f.name}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "textarea" && (
                <Textarea
                  id={f.name}
                  rows={f.rows ?? 5}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "select" && (
                <Select value={values[f.name] ?? ""} onValueChange={(v) => set(f.name, v)}>
                  <SelectTrigger id={f.name}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options ?? []).map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          <Button onClick={submit} disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> {submitLabel}
              </>
            )}
          </Button>

          <ul className="space-y-1 text-xs text-muted-foreground">
            {tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="shadow-[var(--shadow-panel)]">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Output</CardTitle>
            {output && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={download}>
                  <Download className="size-4" /> .md
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={submit}
                  disabled={mutation.isPending}
                  aria-label="Regenerate"
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {output ? (
              <Tabs defaultValue="edit">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <article className="prose-output max-w-none text-sm">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </article>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {mutation.isPending
                  ? "Working on it…"
                  : "Fill in the prompt fields and generate. The result is fully editable here."}
              </p>
            )}
          </CardContent>
        </Card>
        <AiDisclaimer />
      </div>
    </div>
  );
}
