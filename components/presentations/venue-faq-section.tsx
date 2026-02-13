"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import Script from "next/script";

export function VenueFAQSection() {
  const t = useTranslations("presentation.faq");

  // FAQ items for the section
  const faqItems = [
    {
      question: t("q1"),
      answer: t("a1"),
    },
    {
      question: t("q2"),
      answer: t("a2"),
    },
    {
      question: t("q3"),
      answer: t("a3"),
    },
    {
      question: t("q4"),
      answer: t("a4"),
    },
    {
      question: t("q5"),
      answer: t("a5"),
    },
    {
      question: t("q6"),
      answer: t("a6"),
    },
    {
      question: t("q7"),
      answer: t("a7"),
    },
    {
      question: t("q8"),
      answer: t("a8"),
    },
  ];

  // Generate FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
      {/* FAQPage structured data */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 gap-1" variant="secondary">
            <HelpCircle className="h-3 w-3" />
            {t("badge")}
          </Badge>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border bg-background px-4 shadow-sm sm:px-6"
              >
                <AccordionTrigger className="flex gap-4 py-4 text-left text-sm font-medium hover:no-underline sm:py-6 sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground sm:pb-6 sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
