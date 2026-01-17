import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MinimalQuoteFormProps {
  quote: string;
  footer: string;
  onQuoteChange: (value: string) => void;
  onFooterChange: (value: string) => void;
}

export function MinimalQuoteForm({
  quote,
  footer,
  onQuoteChange,
  onFooterChange,
}: MinimalQuoteFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Quote *</Label>
        <textarea
          value={quote}
          onChange={(e) => onQuoteChange(e.target.value)}
          maxLength={200}
          placeholder="Your motivational quote..."
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">{quote.length}/200</p>
      </div>
      <div>
        <Label>Footer</Label>
        <Input
          value={footer}
          onChange={(e) => onFooterChange(e.target.value)}
          maxLength={20}
          placeholder="Athlifyr"
        />
      </div>
    </div>
  );
}
