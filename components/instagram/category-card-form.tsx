import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CategoryCardFormProps {
  categoryTitle: string;
  chips: string;
  tagline: string;
  onCategoryTitleChange: (value: string) => void;
  onChipsChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
}

export function CategoryCardForm({
  categoryTitle,
  chips,
  tagline,
  onCategoryTitleChange,
  onChipsChange,
  onTaglineChange,
}: CategoryCardFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Category Title *</Label>
        <Input
          value={categoryTitle}
          onChange={(e) => onCategoryTitleChange(e.target.value)}
          maxLength={20}
          placeholder="TRAIL"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {categoryTitle.length}/20
        </p>
      </div>
      <div>
        <Label>Keywords (comma separated, 2-4 items) *</Label>
        <Input
          value={chips}
          onChange={(e) => onChipsChange(e.target.value)}
          placeholder="20K, 50K, Ultra, XL"
        />
      </div>
      <div>
        <Label>Tagline *</Label>
        <Input
          value={tagline}
          onChange={(e) => onTaglineChange(e.target.value)}
          maxLength={40}
          placeholder="Encontra eventos perto de ti"
        />
      </div>
    </div>
  );
}
