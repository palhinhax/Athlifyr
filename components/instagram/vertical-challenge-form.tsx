import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface VerticalChallengeFormProps {
  challengeTitle: string;
  steps: string[];
  hashtag: string;
  cta: string;
  onChallengeTitleChange: (value: string) => void;
  onStepsChange: (steps: string[]) => void;
  onHashtagChange: (value: string) => void;
  onCtaChange: (value: string) => void;
}

export function VerticalChallengeForm({
  challengeTitle,
  steps,
  hashtag,
  cta,
  onChallengeTitleChange,
  onStepsChange,
  onHashtagChange,
  onCtaChange,
}: VerticalChallengeFormProps) {
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    onStepsChange(newSteps);
  };

  const addStep = () => {
    if (steps.length < 5) {
      onStepsChange([...steps, ""]);
    }
  };

  const removeStep = (index: number) => {
    if (steps.length > 3) {
      const newSteps = steps.filter((_, i) => i !== index);
      onStepsChange(newSteps);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="challengeTitle">Challenge Title (max 40 chars)</Label>
        <Input
          id="challengeTitle"
          value={challengeTitle}
          onChange={(e) => onChallengeTitleChange(e.target.value)}
          placeholder="30-DAY CHALLENGE"
          maxLength={40}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {challengeTitle.length}/40 characters
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Steps (3-5 items, max 50 chars each)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            disabled={steps.length >= 5}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Step
          </Button>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <textarea
                  value={step}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleStepChange(index, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                  maxLength={50}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.length}/50 characters
                </p>
              </div>
              {steps.length > 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="hashtag">Hashtag (optional, max 30 chars)</Label>
        <Input
          id="hashtag"
          value={hashtag}
          onChange={(e) => onHashtagChange(e.target.value)}
          placeholder="AthlifyrChallenge"
          maxLength={30}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {hashtag.length}/30 characters (without #)
        </p>
      </div>

      <div>
        <Label htmlFor="cta">CTA (optional, max 30 chars)</Label>
        <Input
          id="cta"
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          placeholder="Join Now"
          maxLength={30}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {cta.length}/30 characters
        </p>
      </div>
    </div>
  );
}
