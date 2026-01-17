import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventHeroFormProps {
  title: string;
  subtitle: string;
  metaLine: string;
  cta: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onMetaLineChange: (value: string) => void;
  onCtaChange: (value: string) => void;
}

export function EventHeroForm({
  title,
  subtitle,
  metaLine,
  cta,
  onTitleChange,
  onSubtitleChange,
  onMetaLineChange,
  onCtaChange,
}: EventHeroFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title *</Label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={40}
          placeholder="HYROX LISBOA"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{title.length}/40</p>
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          maxLength={30}
          placeholder="Singles • Doubles"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {subtitle.length}/30
        </p>
      </div>
      <div>
        <Label>Date/Location</Label>
        <Input
          value={metaLine}
          onChange={(e) => onMetaLineChange(e.target.value)}
          maxLength={30}
          placeholder="Mar 2026 • Lisboa"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {metaLine.length}/30
        </p>
      </div>
      <div>
        <Label>CTA</Label>
        <Input
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          maxLength={30}
          placeholder="Descobre na Athlifyr"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{cta.length}/30</p>
      </div>
    </div>
  );
}
