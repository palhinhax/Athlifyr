import { google } from "googleapis";

/**
 * Decoded Play Integrity token payload.
 *
 * See: https://developer.android.com/google/play/integrity/verdict
 */
export interface IntegrityVerdict {
  requestDetails: {
    requestPackageName: string;
    nonce: string;
    timestampMillis: string;
  };
  appIntegrity: {
    appRecognitionVerdict:
      | "PLAY_RECOGNIZED"
      | "UNRECOGNIZED_VERSION"
      | "UNEVALUATED";
    packageName?: string;
    certificateSha256Digest?: string[];
    versionCode?: string;
  };
  deviceIntegrity: {
    deviceRecognitionVerdict: string[];
  };
  accountDetails: {
    appLicensingVerdict: "LICENSED" | "UNLICENSED" | "UNEVALUATED" | "ERROR";
  };
}

interface DecodeResponse {
  tokenPayloadExternal: IntegrityVerdict;
}

// Cache the auth client so we don't recreate it for every request
let cachedAuthClient: Awaited<
  ReturnType<typeof google.auth.GoogleAuth.prototype.getClient>
> | null = null;

/**
 * Get or create a Google Auth client from service account credentials.
 */
async function getAuthClient() {
  if (cachedAuthClient) {
    return cachedAuthClient;
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set"
    );
  }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/playintegrity"],
  });

  cachedAuthClient = await auth.getClient();
  return cachedAuthClient;
}

/**
 * Decode a Play Integrity token using the Google Play Integrity API.
 *
 * @param integrityToken - The token received from the mobile app
 * @returns The decoded integrity verdict
 */
export async function decodeIntegrityToken(
  integrityToken: string
): Promise<IntegrityVerdict> {
  const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME;
  if (!packageName) {
    throw new Error("GOOGLE_PLAY_PACKAGE_NAME environment variable is not set");
  }

  const authClient = await getAuthClient();

  const playintegrity = google.playintegrity({
    version: "v1",
    auth: authClient,
  });

  const response = await playintegrity.v1.decodeIntegrityToken({
    packageName,
    requestBody: {
      integrityToken,
    },
  });

  const data = response.data as unknown as DecodeResponse;

  if (!data?.tokenPayloadExternal) {
    throw new Error("Invalid response from Play Integrity API: no payload");
  }

  return data.tokenPayloadExternal;
}
