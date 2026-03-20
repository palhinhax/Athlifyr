import React from "react";

// ── Shared Mocks for AdminUsersContent tests ─────────────────────────────────

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock toast
export const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
  useToast: () => ({ toast: mockToast }),
}));

// Mock useDebounce to return value immediately (no delay)
jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: <T,>(value: T) => value,
}));

// Mock AdminPushNotificationDialog
jest.mock("@/components/admin/admin-push-notification-dialog", () => ({
  AdminPushNotificationDialog: ({
    open,
    targetUser,
  }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    targetUser: { id: string; name: string } | null;
  }) =>
    open ? (
      <div data-testid="push-dialog">
        {targetUser ? `Push to ${targetUser.name}` : "Push to all"}
      </div>
    ) : null,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
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

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
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
    }) => (
      <SelectContext.Provider value={onValueChange}>
        <div data-testid="select" data-value={value}>
          {children}
        </div>
      </SelectContext.Provider>
    ),
    SelectTrigger: ({
      children,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div>{children}</div>,
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
        <button
          type="button"
          data-value={value}
          onClick={() => onChange?.(value)}
        >
          {children}
        </button>
      );
    },
  };
});

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown">{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({
    children,
  }: {
    children: React.ReactNode;
    align?: string;
  }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
  }) => (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

// ── Shared Fixtures ──────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  locale: string | null;
  createdAt: string;
  isBanned?: boolean;
  emailVerified?: boolean;
  emailNotifications?: boolean;
  pushNotificationsEnabled?: boolean;
  devices?: {
    web: number;
    mobile: number;
    total: number;
  };
  _count?: {
    posts: number;
    comments: number;
  };
}

export const MOCK_USER: MockUser = {
  id: "user-1",
  name: "João Silva",
  email: "joao@example.com",
  image: "https://example.com/avatar.jpg",
  role: "USER",
  locale: "pt",
  createdAt: "2025-01-15T10:00:00Z",
  isBanned: false,
  emailVerified: true,
  emailNotifications: true,
  pushNotificationsEnabled: true,
  devices: { web: 1, mobile: 1, total: 2 },
  _count: { posts: 5, comments: 10 },
};

export const MOCK_ADMIN: MockUser = {
  ...MOCK_USER,
  id: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  role: "ADMIN",
};

export const MOCK_BANNED_USER: MockUser = {
  ...MOCK_USER,
  id: "user-banned",
  name: "Banned User",
  email: "banned@example.com",
  isBanned: true,
};

export const MOCK_USER_NO_DEVICES: MockUser = {
  ...MOCK_USER,
  id: "user-no-devices",
  name: "No Devices User",
  email: "nodevices@example.com",
  pushNotificationsEnabled: false,
  devices: { web: 0, mobile: 0, total: 0 },
};

export const MOCK_USER_NO_NAME: MockUser = {
  ...MOCK_USER,
  id: "user-no-name",
  name: null,
  image: null,
  locale: null,
};

export const MOCK_PAGINATION = {
  totalPages: 3,
  totalCount: 50,
  page: 1,
  limit: 20,
};

export function createMockFetchResponse(
  users: MockUser[] = [MOCK_USER],
  pagination = MOCK_PAGINATION
) {
  return {
    ok: true,
    json: async () => ({ users, pagination }),
  };
}

export function createMockFailedResponse() {
  return {
    ok: false,
    json: async () => ({ error: "Something went wrong" }),
  };
}
