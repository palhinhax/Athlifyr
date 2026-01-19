import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TestimonialStatsFormProps {
  statNumber: string;
  statLabel: string;
  quote: string;
  author: string;
  onStatNumberChange: (value: string) => void;
  onStatLabelChange: (value: string) => void;
  onQuoteChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
}

export function TestimonialStatsForm({
  statNumber,
  statLabel,
  quote,
  author,
  onStatNumberChange,
  onStatLabelChange,
  onQuoteChange,
  onAuthorChange,
}: TestimonialStatsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="statNumber">Stat Number (max 10 chars)</Label>
        <Input
          id="statNumber"
          value={statNumber}
          onChange={(e) => onStatNumberChange(e.target.value)}
          placeholder="1000+"
          maxLength={10}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {statNumber.length}/10 characters (e.g., &quot;1000+&quot;,
          &quot;95%&quot;, &quot;10K&quot;)
        </p>
      </div>

      <div>
        <Label htmlFor="statLabel">Stat Label (max 30 chars)</Label>
        <Input
          id="statLabel"
          value={statLabel}
          onChange={(e) => onStatLabelChange(e.target.value)}
          placeholder="EVENTOS DESCOBERTOS"
          maxLength={30}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {statLabel.length}/30 characters
        </p>
      </div>

      <div>
        <Label htmlFor="quote">Quote (optional, max 150 chars)</Label>
        <textarea
          id="quote"
          value={quote}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onQuoteChange(e.target.value)
          }
          placeholder="Add a testimonial or inspiring quote..."
          maxLength={150}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {quote.length}/150 characters
        </p>
      </div>

      <div>
        <Label htmlFor="author">Author (optional, max 30 chars)</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Nome do Atleta"
          maxLength={30}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {author.length}/30 characters
        </p>
      </div>
    </div>
  );
}
