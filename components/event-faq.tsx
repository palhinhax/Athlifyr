"use client";

import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
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

function FAQItemComponent({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline">
        {item.question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pb-4 text-muted-foreground">{item.answer}</div>
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
    <section className="mt-12">
      <div className="mb-6 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{translations.title}</h2>
      </div>

      <div className="w-full">
        {visibleItems.map((item, index) => (
          <FAQItemComponent key={index} item={item} />
        ))}
      </div>

      {hasMoreItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {showAll ? (
            <>
              {translations.showLess} <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              {translations.showAll.replace("{count}", items.length.toString())}{" "}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
