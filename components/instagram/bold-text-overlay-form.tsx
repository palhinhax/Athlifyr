import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BoldTextOverlayFormProps {
  mainText: string;
  subText: string;
  emoji: string;
  onMainTextChange: (value: string) => void;
  onSubTextChange: (value: string) => void;
  onEmojiChange: (value: string) => void;
}

export function BoldTextOverlayForm({
  mainText,
  subText,
  emoji,
  onMainTextChange,
  onSubTextChange,
  onEmojiChange,
}: BoldTextOverlayFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mainText">Main Text (max 60 chars)</Label>
        <Input
          id="mainText"
          value={mainText}
          onChange={(e) => onMainTextChange(e.target.value)}
          placeholder="YOUR BOLD STATEMENT"
          maxLength={60}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {mainText.length}/60 characters
        </p>
      </div>

      <div>
        <Label htmlFor="subText">Sub Text (optional, max 40 chars)</Label>
        <Input
          id="subText"
          value={subText}
          onChange={(e) => onSubTextChange(e.target.value)}
          placeholder="Supporting text"
          maxLength={40}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {subText.length}/40 characters
        </p>
      </div>

      <div>
        <Label htmlFor="emoji">Emoji (optional, single emoji)</Label>
        <Input
          id="emoji"
          value={emoji}
          onChange={(e) => onEmojiChange(e.target.value)}
          placeholder="🔥"
          maxLength={2}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Add a single emoji for extra impact
        </p>
      </div>
    </div>
  );
}
