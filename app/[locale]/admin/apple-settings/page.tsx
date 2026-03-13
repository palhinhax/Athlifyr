"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Apple,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  Shield,
  Info,
} from "lucide-react";

export default function AdminAppleSettingsPage() {
  const t = useTranslations("admin.appleSettings");

  const [keyId, setKeyId] = useState("M2MVUK46V5");
  const [teamId, setTeamId] = useState("DKK4H2SAU4");
  const [clientId, setClientId] = useState("com.athlifyr.web");
  const [privateKey, setPrivateKey] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(180);

  const [generatedSecret, setGeneratedSecret] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError("");
    setGeneratedSecret("");
    setExpiresAt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/apple-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privateKey,
          keyId,
          teamId,
          clientId,
          expiresInDays,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("form.errors.generic"));
        return;
      }

      setGeneratedSecret(data.secret);
      setExpiresAt(data.expiresAt);
    } catch {
      setError(t("form.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{t("info.title")}</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{t("info.whatIsThis")}</p>
              <p>{t("info.whyNeeded")}</p>
              <p className="font-medium">{t("info.whereToFind")}</p>
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("security.title")}</AlertTitle>
            <AlertDescription>{t("security.description")}</AlertDescription>
          </Alert>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">{t("steps.title")}</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>{t("steps.step1")}</li>
              <li>{t("steps.step2")}</li>
              <li>{t("steps.step3")}</li>
              <li>{t("steps.step4")}</li>
              <li>{t("steps.step5")}</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Generator Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("form.title")}
          </CardTitle>
          <CardDescription>{t("form.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keyId">{t("form.keyId")}</Label>
              <Input
                id="keyId"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                placeholder="M2MVUK46V5"
              />
              <p className="text-xs text-muted-foreground">
                {t("form.keyIdHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamId">{t("form.teamId")}</Label>
              <Input
                id="teamId"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="DKK4H2SAU4"
              />
              <p className="text-xs text-muted-foreground">
                {t("form.teamIdHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">{t("form.clientId")}</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="com.athlifyr.web"
              />
              <p className="text-xs text-muted-foreground">
                {t("form.clientIdHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresInDays">{t("form.expiresInDays")}</Label>
              <Input
                id="expiresInDays"
                type="number"
                min={1}
                max={180}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                {t("form.expiresInDaysHint")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">{t("form.privateKey")}</Label>
            <Textarea
              id="privateKey"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder={`-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----`}
              rows={6}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              {t("form.privateKeyHint")}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGenerate}
            disabled={
              isLoading || !privateKey || !keyId || !teamId || !clientId
            }
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("form.generating")}
              </>
            ) : (
              t("form.generate")
            )}
          </Button>

          {generatedSecret && (
            <div className="space-y-3 rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-700 dark:text-green-400">
                  {t("result.title")}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {t("result.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      {t("result.copy")}
                    </>
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded bg-black/5 p-3 font-mono text-xs dark:bg-white/5">
                {generatedSecret}
              </pre>
              <p className="text-sm text-muted-foreground">
                {t("result.expiresAt")}{" "}
                <span className="font-medium">
                  {new Date(expiresAt).toLocaleDateString()}
                </span>
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{t("result.nextSteps")}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
