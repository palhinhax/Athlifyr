declare module "expo-app-integrity" {
  export function requestIntegrityVerdictAsync(hash: string): Promise<string>;
}
