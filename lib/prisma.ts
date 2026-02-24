import { Prisma, PrismaClient } from "@prisma/client";

/** Error codes that indicate a stale/reset connection (Neon serverless). */
const RETRYABLE_ERROR_CODES = new Set(["P1017", "P1001", "P2024"]);

/** How many times to retry a query on a transient connection error. */
const MAX_RETRIES = 2;

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Extend with a query middleware that retries on connection-reset errors
  // emitted by Neon serverless (OS error 10054 / P1017).
  return client.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        let attempts = 0;
        while (true) {
          try {
            return await query(args);
          } catch (error) {
            attempts++;
            const isKnown =
              error instanceof Prisma.PrismaClientKnownRequestError;
            const isInit =
              error instanceof Prisma.PrismaClientInitializationError;
            const code =
              isKnown || isInit
                ? ((error as { errorCode?: string; code?: string }).errorCode ??
                  (error as { code?: string }).code)
                : undefined;

            const isRetryable =
              (isKnown || isInit) && code && RETRYABLE_ERROR_CODES.has(code);

            if (isRetryable && attempts <= MAX_RETRIES) {
              console.warn(
                `[Prisma] Transient connection error ${code} on ${model}.${operation}. ` +
                  `Retrying (attempt ${attempts}/${MAX_RETRIES})…`
              );
              try {
                await client.$disconnect();
                await client.$connect();
              } catch {
                // Ignore reconnect errors – Prisma will reconnect lazily
              }
              continue;
            }

            throw error;
          }
        }
      },
    },
  }) as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Gracefully disconnect on process termination
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
