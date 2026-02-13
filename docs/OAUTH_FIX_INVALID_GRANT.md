# Fix: Google OAuth "invalid_grant" Error

## 🔴 Problema

```
CallbackRouteError: nY: server responded with an error in the response body
[auth][details]: {
  "error": "invalid_grant",
  "error_description": "Bad Request",
  "provider": "google"
}
```

**Causa:** O fluxo OAuth está a mudar de host (`athlifyr.com` → `www.athlifyr.com`) durante a callback, o que invalida o authorization code da Google.

---

## ✅ Solução Implementada

### 1. Middleware Fix (CRÍTICO)

Adicionado skip explícito para `/api/auth/*` no `middleware.ts`:

```ts
// CRITICAL: Skip middleware for ALL /api/auth/* routes to prevent OAuth breaks
// OAuth flow must happen on the SAME host without redirects
if (pathname.startsWith("/api/auth")) {
  return NextResponse.next();
}
```

**Porquê:** Garante que NENHUM redirect (301/302/307) acontece durante o fluxo OAuth.

### 2. Auth.js Config Fix

Adicionado `redirect_uri` explícito no Google provider (`lib/auth.ts`):

```ts
Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
      // Explicitly set redirect_uri to ensure it always uses www
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    },
  },
});
```

**Porquê:** Force o redirect_uri a usar sempre `https://www.athlifyr.com`, mesmo que o utilizador comece em `athlifyr.com`.

---

## 🔧 Configuração Necessária

### A. Vercel Environment Variables (OBRIGATÓRIO)

No Vercel Dashboard → Project Settings → Environment Variables, adicionar:

```bash
# Domínio canónico (COM www)
NEXTAUTH_URL=https://www.athlifyr.com

# Secret (gerar novo)
NEXTAUTH_SECRET=<gerar-com-openssl-rand-base64-32>

# Google OAuth
GOOGLE_CLIENT_ID=849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<copiar-do-google-console>

# Database
DATABASE_URL=<neon-pooled-connection-string>
DIRECT_URL=<neon-direct-connection-string>

# Outros
RESEND_API_KEY=<resend-api-key>
NEXT_PUBLIC_MAPBOX_TOKEN=<mapbox-token>
NEXT_PUBLIC_GA_MEASUREMENT_ID=<ga-measurement-id>
```

**Gerar NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### B. Vercel Domain Configuration

1. **Domain primário:** `www.athlifyr.com`
2. **Apex domain:** `athlifyr.com` deve fazer redirect para `www` **a nível de DNS/Edge** (Vercel faz isto automaticamente)

**Verificar:**

- Vai a Vercel Dashboard → Domains
- Confirma que `www.athlifyr.com` está listado como domínio principal
- `athlifyr.com` deve estar como "Redirect to www.athlifyr.com"

### C. Google Cloud Console (OBRIGATÓRIO)

Vai a: https://console.cloud.google.com/apis/credentials

**Cliente OAuth → Web Application:**

**Authorized JavaScript origins:**

```
https://www.athlifyr.com
```

**Authorized redirect URIs:**

```
https://www.athlifyr.com/api/auth/callback/google
```

⚠️ **IMPORTANTE:**

- **NÃO adicionar** `https://athlifyr.com` (sem www) aos redirect URIs
- Isto força tudo a acontecer em `www`
- Se adicionares ambos, o problema pode voltar

---

## 🧪 Validação (Passo a Passo)

### 1. Verificar Network Tab

1. Abre DevTools → Network tab
2. Clica "Sign in with Google"
3. Verifica que o fluxo é:

```
✅ https://www.athlifyr.com/api/auth/signin/google
     ↓
✅ https://accounts.google.com/o/oauth2/v2/auth?...
     ↓
✅ https://www.athlifyr.com/api/auth/callback/google (SEM redirects 301/302/307)
     ↓
✅ Login bem-sucedido
```

❌ **NÃO deve haver:**

```
❌ https://athlifyr.com/api/auth/callback/google
     ↓ 301/307
❌ https://www.athlifyr.com/api/auth/callback/google
     ↓
❌ invalid_grant
```

### 2. Verificar Environment Variables

No terminal da Vercel:

```bash
vercel env ls
```

Confirmar que `NEXTAUTH_URL` está definido como `https://www.athlifyr.com`.

### 3. Testar Localmente

```bash
# .env local
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

pnpm dev
```

Testar login em `http://localhost:3000` (sem www, ok em dev).

---

## 📝 Checklist Final

Antes de fazer deploy:

- [ ] Middleware tem skip explícito para `/api/auth`
- [ ] `lib/auth.ts` tem `redirect_uri` explícito
- [ ] `.env` local tem `NEXTAUTH_URL=https://www.athlifyr.com`
- [ ] Vercel tem `NEXTAUTH_URL=https://www.athlifyr.com`
- [ ] Vercel tem `NEXTAUTH_SECRET` gerado
- [ ] Vercel tem `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- [ ] Google Console tem redirect URI `https://www.athlifyr.com/api/auth/callback/google`
- [ ] Google Console tem origin `https://www.athlifyr.com`
- [ ] Vercel domain config tem `www.athlifyr.com` como primário
- [ ] Testado em produção (Network tab sem 301/307 durante callback)

---

## 🚀 Deploy

```bash
git add .
git commit -m "fix(auth): prevent host changes during OAuth callback"
git push origin main
```

Vercel vai fazer auto-deploy. Aguardar ~2 minutos e testar.

---

## 🐛 Troubleshooting

### "invalid_grant" ainda aparece

**Causa 1:** Cookies antigos no browser

**Fix:**

1. Abre DevTools → Application → Cookies
2. Apaga TODOS os cookies de `athlifyr.com` e `www.athlifyr.com`
3. Tenta login novamente

**Causa 2:** Environment variables antigas no Vercel

**Fix:**

```bash
# Forçar re-deploy
vercel --force --prod
```

**Causa 3:** Google Console tem redirect URI errado

**Fix:**

1. Vai a Google Console
2. Verifica que o redirect URI é EXATAMENTE: `https://www.athlifyr.com/api/auth/callback/google`
3. Sem trailing slash
4. Com www
5. Com https

**Causa 4:** NEXTAUTH_SECRET diferente entre deployments

**Fix:**

1. Gera novo secret: `openssl rand -base64 32`
2. Define no Vercel para **TODOS** os environments (Production, Preview, Development)
3. Deve ser SEMPRE o mesmo valor

---

## 📚 Referências

- [Auth.js: OAuth Configuration](https://authjs.dev/reference/core/providers/oauth)
- [Google OAuth 2.0: Redirect URI Mismatch](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation)
- [NextAuth: Redirect URI Issues](https://next-auth.js.org/errors#redirect_uri_mismatch)
- [Vercel: Environment Variables](https://vercel.com/docs/environment-variables)

---

## ✅ Estado Atual

- [x] Middleware fix implementado
- [x] Auth config atualizado
- [ ] **Falta:** Configurar environment variables no Vercel
- [ ] **Falta:** Verificar Google Console redirect URIs
- [ ] **Falta:** Fazer deploy e testar
