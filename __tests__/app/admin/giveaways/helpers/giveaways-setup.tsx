import React from "react";

// ── Shared Mocks for AdminGiveawaysPage tests ────────────────────────────────

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock @prisma/client enums
jest.mock("@prisma/client", () => ({
  GiveawayStatus: {
    DRAFT: "DRAFT",
    SCHEDULED: "SCHEDULED",
    DRAWING: "DRAWING",
    DRAWN: "DRAWN",
    CANCELLED: "CANCELLED",
  },
  GiveawayPlatform: {
    ALL: "ALL",
    MOBILE: "MOBILE",
    ANDROID: "ANDROID",
    IOS: "IOS",
  },
  Language: {
    pt: "pt",
    en: "en",
    es: "es",
    fr: "fr",
    de: "de",
    it: "it",
  },
}));

// Mock @/lib/event-utils
jest.mock("@/lib/event-utils", () => ({
  formatDate: (date: Date) => date.toISOString().slice(0, 10),
}));

// Mock toast (module-level, not hook)
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
  useToast: () => ({ toast: mockToast }),
}));

// Mock shadcn UI components as simple HTML

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      {...rest}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    onClick,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="card" onClick={onClick} {...rest}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
    ...rest
  }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) => (
    <span data-variant={variant} {...rest}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...rest
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...rest}>{children}</label>
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dialog-footer">{children}</div>,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...rest}>{children}</button>
  ),
  AlertDialogAction: ({
    children,
    onClick,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/select", () => {
  const SelectContext = React.createContext<((v: string) => void) | undefined>(
    undefined
  );
  return {
    Select: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
      value?: string;
      disabled?: boolean;
    }) => (
      <SelectContext.Provider value={onValueChange}>
        <div data-testid="select" data-value={value}>
          {children}
        </div>
      </SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectValue: ({ placeholder }: { placeholder?: string }) => (
      <span>{placeholder}</span>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => {
      const onChange = React.useContext(SelectContext);
      return (
        <div data-value={value} onClick={() => onChange?.(value)}>
          {children}
        </div>
      );
    },
  };
});

// ── Shared Fixtures ──────────────────────────────────────────────────────────

interface MockGiveaway {
  id: string;
  eventId: string;
  status: string;
  platform: string;
  drawAt: string;
  prizeCount: number;
  secretHash: null;
  secretRevealed: null;
  event: { id: string; title: string; slug: string };
  translations: { lang: string; title: string; details: string }[];
  _count: { participations: number; winners: number };
}

export const MOCK_GIVEAWAY: MockGiveaway = {
  id: "g1",
  eventId: "e1",
  status: "DRAFT",
  platform: "ALL",
  drawAt: "2026-06-15T12:00:00Z",
  prizeCount: 3,
  secretHash: null,
  secretRevealed: null,
  event: { id: "e1", title: "Trail Run 2026", slug: "trail-run-2026" },
  translations: [
    { lang: "en", title: "Win a Prize!", details: "Enter now" },
    { lang: "pt", title: "Ganha um Prémio!", details: "Participa" },
  ],
  _count: { participations: 5, winners: 0 },
};

export const MOCK_SCHEDULED_GIVEAWAY: MockGiveaway = {
  ...MOCK_GIVEAWAY,
  id: "g2",
  status: "SCHEDULED",
  _count: { participations: 10, winners: 0 },
};

export const MOCK_DRAWN_GIVEAWAY: MockGiveaway = {
  ...MOCK_GIVEAWAY,
  id: "g3",
  status: "DRAWN",
  _count: { participations: 10, winners: 2 },
};

export const MOCK_EVENTS = [
  { id: "e1", title: "Trail Run 2026" },
  { id: "e2", title: "Road Race 2026" },
];

export { mockToast };
