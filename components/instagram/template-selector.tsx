import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TemplateKey, type InstagramFormat } from "@/types/instagram";

interface TemplateSelectorProps {
  templateKey: TemplateKey;
  format: InstagramFormat;
  onTemplateChange: (template: TemplateKey) => void;
  onFormatChange: (format: InstagramFormat) => void;
}

export function TemplateSelector({
  templateKey,
  format,
  onTemplateChange,
  onFormatChange,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Template & Format</h2>

      {/* Template Selector */}
      <div>
        <Label>Template</Label>
        <Select
          value={templateKey}
          onValueChange={(v) => onTemplateChange(v as TemplateKey)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="T1">T1: Event Hero</SelectItem>
            <SelectItem value="T2">T2: Category Card</SelectItem>
            <SelectItem value="T3">T3: Weekly Picks</SelectItem>
            <SelectItem value="T4">T4: Minimal Quote</SelectItem>
            <SelectItem value="T5">T5: Monthly Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Format Selector */}
      <div>
        <Label>Format</Label>
        <Select
          value={format}
          onValueChange={(v) => onFormatChange(v as InstagramFormat)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SQUARE">Square (1:1)</SelectItem>
            <SelectItem value="PORTRAIT">Portrait (4:5)</SelectItem>
            <SelectItem value="STORY">Story (9:16)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
