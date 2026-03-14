/**
 * @jest-environment node
 */

/**
 * Tests for autoLinkOAuthAccount (lib/auth.ts)
 *
 * Covers:
 * - No-op when email is empty
 * - No-op when no existing user found
 * - No-op when account is already linked
 * - Creates account link and sets user.id when not linked
 * - Uses profile.email over user.email
 * - Handles case-insensitive email matching
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: jest.fn(),
  })),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("next-auth/providers/apple", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: jest.fn(() => ({})),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    account: { create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

import { autoLinkOAuthAccount } from "@/lib/auth";
import type { User, Account, Profile } from "next-auth";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "new-user-id",
    email: "user@example.com",
    name: "Test User",
    role: "USER",
    ...overrides,
  };
}

function makeAccount(overrides: Partial<Account> = {}): Account {
  return {
    provider: "apple",
    providerAccountId: "apple-123",
    type: "oauth",
    access_token: "at",
    refresh_token: "rt",
    expires_at: 9999999999,
    token_type: "bearer",
    scope: "openid email",
    id_token: "id-token",
    session_state: null,
    ...overrides,
  } as Account;
}

const EXISTING_USER = {
  id: "existing-user-id",
  email: "user@example.com",
  accounts: [{ provider: "google", providerAccountId: "google-456" }],
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("autoLinkOAuthAccount", () => {
  it("does nothing when email is empty", async () => {
    const user = makeUser({ email: "" });
    const account = makeAccount();

    await autoLinkOAuthAccount(user, account, undefined);

    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.account.create).not.toHaveBeenCalled();
  });

  it("does nothing when no existing user found", async () => {
    const user = makeUser();
    const account = makeAccount();

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await autoLinkOAuthAccount(user, account, undefined);

    expect(prisma.account.create).not.toHaveBeenCalled();
    expect(user.id).toBe("new-user-id");
  });

  it("does nothing when account is already linked", async () => {
    const user = makeUser();
    const account = makeAccount({ provider: "google" });

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(EXISTING_USER);

    await autoLinkOAuthAccount(user, account, undefined);

    expect(prisma.account.create).not.toHaveBeenCalled();
    expect(user.id).toBe("new-user-id"); // unchanged
  });

  it("creates account link and sets user.id when not linked", async () => {
    const user = makeUser();
    const account = makeAccount({ provider: "apple" });

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(EXISTING_USER);
    (prisma.account.create as jest.Mock).mockResolvedValue({});

    await autoLinkOAuthAccount(user, account, undefined);

    expect(prisma.account.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "existing-user-id",
        provider: "apple",
        providerAccountId: "apple-123",
      }),
    });
    expect(user.id).toBe("existing-user-id");
  });

  it("uses profile.email over user.email", async () => {
    const user = makeUser({ email: "old@example.com" });
    const account = makeAccount({ provider: "apple" });
    const profile = { email: "Profile@Example.COM" } as Profile;

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await autoLinkOAuthAccount(user, account, profile);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: { equals: "profile@example.com", mode: "insensitive" } },
      include: { accounts: true },
    });
  });

  it("normalizes email to lowercase", async () => {
    const user = makeUser({ email: "USER@EXAMPLE.COM" });
    const account = makeAccount({ provider: "apple" });

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(EXISTING_USER);
    (prisma.account.create as jest.Mock).mockResolvedValue({});

    await autoLinkOAuthAccount(user, account, undefined);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: { equals: "user@example.com", mode: "insensitive" } },
      include: { accounts: true },
    });
    expect(prisma.account.create).toHaveBeenCalled();
  });
});
