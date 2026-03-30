"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

// â”€â”€â”€ Background videos (random on each load) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FORM_BACKGROUND_VIDEO = "/promo/lisboa.mp4";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface FormFieldData {
  id: string;
  label: string;
  placeholder: string | null;
  type: string;
  required: boolean;
  order: number;
  options: string[];
  section: string | null;
}

interface FormData {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  closesAt: string | null;
  fields: FormFieldData[];
}

// â”€â”€â”€ Country list (ISO) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// â”€â”€â”€ Video Background Shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FormPageShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={FORM_BACKGROUND_VIDEO} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">{children}</div>
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function PublicFormClient({ slug }: Readonly<{ slug: string }>) {
  const t = useTranslations("forms");
  const [form, setForm] = useState<FormData | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${slug}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || t("errors.loadFailed"));
          return;
        }
        const data: FormData = await res.json();
        setForm(data);

        // Initialize values
        const initial: Record<string, string> = {};
        for (const field of data.fields) {
          initial[field.id] = "";
        }
        setValues(initial);
      } catch {
        setError(t("errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [slug, t]);

  const updateValue = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form) return;

    // Client-side required validation
    for (const field of form.fields) {
      if (field.required && !values[field.id]?.trim()) {
        setError(t("errors.fieldRequired", { field: field.label }));
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("errors.submitFailed"));
        return;
      }

      setSubmitted(true);
    } catch {
      setError(t("errors.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <FormPageShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      </FormPageShell>
    );
  }

  if (error && !form) {
    return (
      <FormPageShell>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
          <p className="text-lg font-medium text-white">{error}</p>
        </div>
      </FormPageShell>
    );
  }

  if (submitted) {
    return (
      <FormPageShell>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <p className="text-2xl font-bold text-white">{t("submitSuccess")}</p>
          <p className="mt-3 text-white/70">{t("submitSuccessDescription")}</p>
        </div>
      </FormPageShell>
    );
  }

  if (!form) return null;

  // Group fields by section
  const sections = new Map<string, FormFieldData[]>();
  for (const field of form.fields) {
    const key = field.section || "__default__";
    if (!sections.has(key)) sections.set(key, []);
    const entry = sections.get(key);
    if (entry) {
      entry.push(field);
    }
  }

  return (
    <FormPageShell>
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/logo-removebg-preview.png"
          alt="Athlifyr"
          width={160}
          height={40}
          className="drop-shadow-lg"
          priority
        />
      </div>

      {/* Form Card â€” glassmorphism */}
      <div className="rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {form.title}
          </h1>
          {form.description && (
            <div className="prose prose-sm prose-invert mt-2 max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-primary prose-strong:text-white prose-li:text-white/70">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.description}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {Array.from(sections.entries()).map(
              ([sectionName, sectionFields]) => (
                <div key={sectionName} className="space-y-4">
                  {sectionName !== "__default__" && (
                    <h3 className="border-b border-white/20 pb-2 text-lg font-semibold text-white">
                      {sectionName}
                    </h3>
                  )}

                  {sectionFields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <Label htmlFor={field.id} className="text-white/90">
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-400">*</span>
                        )}
                      </Label>
                      <FieldInput
                        field={field}
                        value={values[field.id] ?? ""}
                        onChange={(val) => updateValue(field.id, val)}
                      />
                    </div>
                  ))}
                </div>
              )
            )}

            {error && (
              <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary text-lg font-semibold"
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {t("submit")}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer branding */}
      <p className="mt-4 text-center text-xs text-white/40">
        Powered by Athlifyr
      </p>
    </FormPageShell>
  );
}

// â”€â”€â”€ Field Input Renderer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FieldInput({
  field,
  value,
  onChange,
}: Readonly<{
  field: FormFieldData;
  value: string;
  onChange: (val: string) => void;
}>) {
  const inputClass =
    "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20";

  switch (field.type) {
    case "TEXT":
    case "URL":
      return (
        <Input
          id={field.id}
          type={field.type === "URL" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputClass}
        />
      );

    case "EMAIL":
      return (
        <Input
          id={field.id}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputClass}
        />
      );

    case "PHONE":
      return (
        <Input
          id={field.id}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputClass}
        />
      );

    case "NUMBER":
      return (
        <Input
          id={field.id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputClass}
        />
      );

    case "DATE":
      return (
        <Input
          id={field.id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className={inputClass}
        />
      );

    case "TIME":
      return (
        <Input
          id={field.id}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "HH:MM:SS"}
          required={field.required}
          className={inputClass}
        />
      );

    case "TEXTAREA":
      return (
        <Textarea
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          rows={3}
          className={inputClass}
        />
      );

    case "SELECT":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={field.id} className={inputClass}>
            <SelectValue placeholder={field.placeholder ?? ""} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "COUNTRY":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={field.id} className={inputClass}>
            <SelectValue placeholder={field.placeholder ?? ""} />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "RADIO":
      return (
        <div className="space-y-2">
          {field.options.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="h-4 w-4 border-white/30 text-primary accent-primary focus:ring-primary"
              />
              <span className="text-sm text-white/90">{opt}</span>
            </label>
          ))}
        </div>
      );

    case "CHECKBOX":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.id}
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
            className="border-white/30 data-[state=checked]:bg-primary"
          />
          <Label
            htmlFor={field.id}
            className="cursor-pointer text-sm text-white/90"
          >
            {field.placeholder || field.label}
          </Label>
        </div>
      );

    case "CHECKBOX_GROUP":
      return (
        <div className="space-y-2">
          {field.options.map((opt) => {
            const selected = value ? value.split(",") : [];
            const isChecked = selected.includes(opt);
            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const newSelected = checked
                      ? [...selected, opt]
                      : selected.filter((s) => s !== opt);
                    onChange(newSelected.join(","));
                  }}
                  className="border-white/30 data-[state=checked]:bg-primary"
                />
                <span className="text-sm text-white/90">{opt}</span>
              </label>
            );
          })}
        </div>
      );

    default:
      return (
        <Input
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          className={inputClass}
        />
      );
  }
}
