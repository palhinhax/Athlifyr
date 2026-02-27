import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Test-only endpoint – simulates Stripe payment confirmation or cancellation.
 *
 * This route is ONLY available in non-production environments.  It lets
 * Playwright E2E tests exercise the full registration lifecycle without a live
 * Stripe account.
 *
 * Query parameters:
 *   registrationId – the Registration.id to update
 *   action         – "success" (default) | "cancel"
 *   successUrl     – where to redirect after a successful simulation
 *   cancelUrl      – where to redirect after a cancelled simulation
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get("registrationId");
  const action = searchParams.get("action") ?? "success";
  const successUrl = searchParams.get("successUrl") ?? "/";
  const cancelUrl = searchParams.get("cancelUrl") ?? "/";

  if (!registrationId) {
    return NextResponse.json(
      { error: "registrationId is required" },
      { status: 400 }
    );
  }

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  if (action === "success") {
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "CONFIRMED" },
    });

    redirect(successUrl);
  } else {
    // cancel / failure – leave Registration as PENDING (do not confirm)
    redirect(cancelUrl);
  }
}
