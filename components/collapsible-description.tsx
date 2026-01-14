"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CollapsibleDescriptionProps {
  description: string;
  maxHeight?: number; // in pixels
}

export function CollapsibleDescription({
  description,
  maxHeight = 300,
}: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if description needs collapsing (more than ~400 characters or multiple paragraphs)
  const needsCollapsing =
    description.length > 400 || description.split("\n\n").length > 3;

  if (!needsCollapsing) {
    return (
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "" : "relative"
        }`}
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
        }}
      >
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              Ver menos
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Ver mais
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
