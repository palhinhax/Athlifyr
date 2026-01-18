import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HookCtaFormProps {
  hook: string;
  body: string;
  cta: string;
  onHookChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onCtaChange: (value: string) => void;
}

export function HookCtaForm({
  hook,
  body,
  cta,
  onHookChange,
  onBodyChange,
  onCtaChange,
}: HookCtaFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hook">Hook - Attention Grabber (max 80 chars)</Label>
        <textarea
          id="hook"
          value={hook}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onHookChange(e.target.value)
          }
          placeholder="STOP SCROLLING"
          maxLength={80}
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {hook.length}/80 characters - Make it bold and attention-grabbing!
        </p>
      </div>

      <div>
        <Label htmlFor="body">Body - Main Content (max 120 chars)</Label>
        <textarea
          id="body"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onBodyChange(e.target.value)
          }
          placeholder="Discover 1000+ sports events in Portugal. All in one place."
          maxLength={120}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {body.length}/120 characters - Deliver value quickly
        </p>
      </div>

      <div>
        <Label htmlFor="cta">CTA - Call to Action (max 40 chars)</Label>
        <Input
          id="cta"
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          placeholder="DISCOVER NOW"
          maxLength={40}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {cta.length}/40 characters - Strong action verb!
        </p>
      </div>
    </div>
  );
}
