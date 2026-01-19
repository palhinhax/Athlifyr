import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SplitScreenFormProps {
  leftTitle: string;
  leftSubtitle: string;
  rightTitle: string;
  rightSubtitle: string;
  vsText: string;
  onLeftTitleChange: (value: string) => void;
  onLeftSubtitleChange: (value: string) => void;
  onRightTitleChange: (value: string) => void;
  onRightSubtitleChange: (value: string) => void;
  onVsTextChange: (value: string) => void;
}

export function SplitScreenForm({
  leftTitle,
  leftSubtitle,
  rightTitle,
  rightSubtitle,
  vsText,
  onLeftTitleChange,
  onLeftSubtitleChange,
  onRightTitleChange,
  onRightSubtitleChange,
  onVsTextChange,
}: SplitScreenFormProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Left Side</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="leftTitle">Title (max 30 chars)</Label>
            <Input
              id="leftTitle"
              value={leftTitle}
              onChange={(e) => onLeftTitleChange(e.target.value)}
              placeholder="OPTION A"
              maxLength={30}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {leftTitle.length}/30 characters
            </p>
          </div>

          <div>
            <Label htmlFor="leftSubtitle">
              Subtitle (optional, max 40 chars)
            </Label>
            <Input
              id="leftSubtitle"
              value={leftSubtitle}
              onChange={(e) => onLeftSubtitleChange(e.target.value)}
              placeholder="Description"
              maxLength={40}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {leftSubtitle.length}/40 characters
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="vsText">VS Text (max 5 chars)</Label>
        <Input
          id="vsText"
          value={vsText}
          onChange={(e) => onVsTextChange(e.target.value)}
          placeholder="VS"
          maxLength={5}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Right Side</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="rightTitle">Title (max 30 chars)</Label>
            <Input
              id="rightTitle"
              value={rightTitle}
              onChange={(e) => onRightTitleChange(e.target.value)}
              placeholder="OPTION B"
              maxLength={30}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {rightTitle.length}/30 characters
            </p>
          </div>

          <div>
            <Label htmlFor="rightSubtitle">
              Subtitle (optional, max 40 chars)
            </Label>
            <Input
              id="rightSubtitle"
              value={rightSubtitle}
              onChange={(e) => onRightSubtitleChange(e.target.value)}
              placeholder="Description"
              maxLength={40}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {rightSubtitle.length}/40 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
