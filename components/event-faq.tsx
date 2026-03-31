"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface EventFAQProps {
  items: FAQItem[];
  translations: {
    title: string;
    showAll: string;
    showLess: string;
  };
}

function FAQItemComponent({
  item,
  defaultOpen = false,
}: {
  item: FAQItem;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-xl bg-muted/50"
    >
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between p-5 text-left font-bold transition-colors hover:text-primary sm:p-6">
        {item.question}
        <ChevronDown
          className={cn(
            "ml-4 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="px-5 pb-5 text-muted-foreground sm:px-6 sm:pb-6">
          {item.answer}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function EventFAQ({ items, translations }: EventFAQProps) {
  const [showAll, setShowAll] = useState(false);

  if (items.length === 0) return null;

  // Show first 3 by default, or all if showAll is true
  const visibleItems = showAll ? items : items.slice(0, 3);
  const hasMoreItems = items.length > 3;

  return (
    <section className="mb-8">
      <h2 className="mb-6 text-2xl font-extrabold sm:text-3xl">
        {translations.title}
      </h2>

      <div className="space-y-3">
        {visibleItems.map((item, index) => (
          <FAQItemComponent key={index} item={item} defaultOpen={index === 0} />
        ))}
      </div>

      {hasMoreItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 flex items-center gap-1 text-sm font-bold text-primary transition-all hover:underline"
        >
          {showAll ? (
            <>
              {translations.showLess} <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              {translations.showAll} <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
