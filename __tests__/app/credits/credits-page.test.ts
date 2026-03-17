/**
 * @jest-environment node
 */

import { generateMetadata } from "@/app/[locale]/credits/page";
import WalletPage from "@/app/[locale]/credits/page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn().mockResolvedValue({ user: { id: "u1" } }),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string): string => key),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/credits/wallet-page-client", () => ({
  WalletPageClient: () => null,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("WalletPage metadata", () => {
  it("generates metadata with title and description", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
  });
});

describe("WalletPage", () => {
  it("redirects to login when not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);

    await WalletPage({ params: Promise.resolve({ locale: "pt" }) });

    expect(redirect).toHaveBeenCalledWith("/pt/auth/login");
  });

  it("redirects when session has no user id", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: {} });

    await WalletPage({ params: Promise.resolve({ locale: "en" }) });

    expect(redirect).toHaveBeenCalledWith("/en/auth/login");
  });

  it("renders WalletPageClient when authenticated", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } });

    const result = await WalletPage({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(result).toBeDefined();
  });
});
