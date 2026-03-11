# Google OAuth — Guia Completo de Configuração

Este documento explica como configurar o login com Google no Athlifyr para **Web**, **Android** e **iOS**.

---

## Índice

1. [Arquitetura Geral](#1-arquitetura-geral)
2. [Credenciais Necessárias no Google Cloud Console](#2-credenciais-necessárias-no-google-cloud-console)
3. [Criar Web Client 1 — NextAuth (Site Web)](#3-criar-web-client-1--nextauth-site-web)
4. [Criar Web Client 2 — Mobile (Expo Go / Web)](#4-criar-web-client-2--mobile-expo-go--web)
5. [Criar Android Client](#5-criar-android-client)
6. [Criar iOS Client](#6-criar-ios-client)
7. [Onde Colocar Cada Variável](#7-onde-colocar-cada-variável)
8. [Mapa de Correspondência Mobile ↔ Backend](#8-mapa-de-correspondência-mobile--backend)
9. [Fluxo de Autenticação](#9-fluxo-de-autenticação)
10. [SHA-1 Fingerprints (Android)](#10-sha-1-fingerprints-android)
11. [Resolução de Problemas](#11-resolução-de-problemas)

---

## 1. Arquitetura Geral

O Athlifyr usa dois fluxos de autenticação Google distintos:

| Plataforma        | Fluxo                         | Endpoint Backend            |
| ----------------- | ----------------------------- | --------------------------- |
| **Web** (browser) | NextAuth.js (session cookies) | `/api/auth/callback/google` |
| **Mobile** (Expo) | PKCE Authorization Code → JWT | `/api/auth/google/exchange` |

O login web usa o NextAuth.js com cookies de sessão. O login mobile usa um fluxo PKCE onde a app obtém um código de autorização, envia-o ao backend, e o backend troca-o por tokens diretamente com a Google.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  App Mobile  │────>│    Google    │────>│  App Mobile  │
│  (Expo)      │     │  OAuth 2.0   │     │  (redirect)  │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │  code + codeVerifier                    │
       └─────────────────┬───────────────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Backend Next.js │
                │  /api/auth/      │
                │  google/exchange │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Google Token    │
                │  Endpoint        │
                │  (server-to-     │
                │   server)        │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  BD (Prisma)     │
                │  Criar/Encontrar │
                │  Utilizador      │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  JWT Token       │
                │  → App Mobile    │
                └──────────────────┘
```

---

## 2. Credenciais Necessárias no Google Cloud Console

Vai a: **https://console.cloud.google.com/apis/credentials**

Precisas de criar **4 OAuth 2.0 Client IDs**:

| #   | Tipo            | Nome Sugerido             | Para quê                            |
| --- | --------------- | ------------------------- | ----------------------------------- |
| 1   | Web application | `Athlifyr Web (NextAuth)` | Login no site web                   |
| 2   | Web application | `Athlifyr Mobile Web`     | Login mobile (Expo Go + web builds) |
| 3   | Android         | `Athlifyr Android`        | Login nativo Android                |
| 4   | iOS             | `Athlifyr iOS`            | Login nativo iOS                    |

> **Nota:** Os clientes 1 e 2 são ambos do tipo "Web application", mas com redirect URIs diferentes. Podes usar o mesmo se preferires, mas separar é mais limpo e seguro.

---

## 3. Criar Web Client 1 — NextAuth (Site Web)

**Google Console → Create OAuth Client ID → Web application**

- **Nome:** `Athlifyr Web (NextAuth)`
- **Authorized JavaScript origins:**
  - `https://www.athlifyr.com`
  - `http://localhost:3000` (desenvolvimento)
- **Authorized redirect URIs:**
  - `https://www.athlifyr.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)

Depois de criar, vais obter:

- **Client ID** → usa como `GOOGLE_CLIENT_ID`
- **Client Secret** → usa como `GOOGLE_CLIENT_SECRET`

> **CRÍTICO:** O redirect URI tem de incluir `www.` se o teu `NEXTAUTH_URL` usa `www.athlifyr.com`. Se não coincidir, o login web falha com `redirect_uri_mismatch`.

---

## 4. Criar Web Client 2 — Mobile (Expo Go / Web)

**Google Console → Create OAuth Client ID → Web application**

- **Nome:** `Athlifyr Mobile Web`
- **Authorized JavaScript origins:**
  - `https://www.athlifyr.com`
  - `http://localhost:3000`
- **Authorized redirect URIs:**
  - `https://auth.expo.io/@athlifyr/athlifyr` (Expo Go)

> **Nota:** Quando usas Expo Go em desenvolvimento, o `expo-auth-session` gera um redirect URI dinâmico (ex: `exp://192.168.1.x:8081/--/redirect`). Este URI é tratado como proxy via Expo. Para builds de desenvolvimento/produção, o redirect é gerido pelo deep link nativo (`athlifyr://oauth2redirect`).

Depois de criar, vais obter:

- **Client ID** → usa como `GOOGLE_MOBILE_WEB_CLIENT_ID` (backend) E `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (mobile)
- **Client Secret** → usa como `GOOGLE_MOBILE_WEB_CLIENT_SECRET` (backend apenas)

---

## 5. Criar Android Client

**Google Console → Create OAuth Client ID → Android**

- **Nome:** `Athlifyr Android`
- **Package name:** `com.athlifyr.app`
- **SHA-1 certificate fingerprint:** (ver [secção 10](#10-sha-1-fingerprints-android))

Depois de criar, vais obter:

- **Client ID** → usa como `GOOGLE_ANDROID_CLIENT_ID` (backend) E `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` (mobile)

> **Não existe client secret para Android** — a Google valida a app automaticamente através do package name + SHA-1 fingerprint. A segurança é garantida pelo PKCE (code_verifier).

---

## 6. Criar iOS Client

**Google Console → Create OAuth Client ID → iOS**

- **Nome:** `Athlifyr iOS`
- **Bundle ID:** `com.athlifyr.app`
- **App Store ID:** (opcional, preenche quando publicares na App Store)
- **Team ID:** (o teu Apple Developer Team ID)

Depois de criar, vais obter:

- **Client ID** → usa como `GOOGLE_IOS_CLIENT_ID` (backend) E `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (mobile)

> **Não existe client secret para iOS** — a Google valida a app pelo Bundle ID. A segurança é garantida pelo PKCE.

---

## 7. Onde Colocar Cada Variável

### 7.1 Vercel (Backend Next.js)

**Vercel Dashboard → Projeto Athlifyr → Settings → Environment Variables**

Adiciona estas variáveis para **Production**, **Preview** e **Development**:

| Variável                          | Valor                         | Origem   | Notas                              |
| --------------------------------- | ----------------------------- | -------- | ---------------------------------- |
| `GOOGLE_CLIENT_ID`                | Client ID do Web Client 1     | Secção 3 | Para NextAuth (login web)          |
| `GOOGLE_CLIENT_SECRET`            | Client Secret do Web Client 1 | Secção 3 | Para NextAuth (login web)          |
| `GOOGLE_MOBILE_WEB_CLIENT_ID`     | Client ID do Web Client 2     | Secção 4 | Para exchange mobile (web/Expo Go) |
| `GOOGLE_MOBILE_WEB_CLIENT_SECRET` | Client Secret do Web Client 2 | Secção 4 | Para exchange mobile               |
| `GOOGLE_ANDROID_CLIENT_ID`        | Client ID do Android Client   | Secção 5 | Para validar tokens Android        |
| `GOOGLE_IOS_CLIENT_ID`            | Client ID do iOS Client       | Secção 6 | Para validar tokens iOS            |

### 7.2 Mobile (ficheiro `mobile/.env`)

Cria ou edita o ficheiro `mobile/.env` (nunca fazer commit — está no `.gitignore`):

```env
# Google OAuth — Estes valores DEVEM ser iguais aos do Vercel
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-abc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=123456789-def.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123456789-ghi.apps.googleusercontent.com
```

### 7.3 EAS Build (se usas EAS para builds de produção)

Se fazes build com `eas build`, as variáveis `EXPO_PUBLIC_*` são lidas do ficheiro `mobile/.env` localmente ou podes configurá-las no `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "123456789-abc.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "123456789-def.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "123456789-ghi.apps.googleusercontent.com"
      }
    }
  }
}
```

Ou usa **EAS Secrets** para não expor valores no repositório:

```bash
eas secret:create --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "123456789-abc.apps.googleusercontent.com"
eas secret:create --name EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID --value "123456789-def.apps.googleusercontent.com"
eas secret:create --name EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID --value "123456789-ghi.apps.googleusercontent.com"
```

---

## 8. Mapa de Correspondência Mobile ↔ Backend

**REGRA CRÍTICA:** O client ID que a app mobile usa para pedir o código de autorização **TEM de ser exatamente o mesmo** que o backend usa para trocar esse código com a Google.

```
┌─────────────────────────────────────────────────────────────────┐
│                     PARES QUE DEVEM COINCIDIR                    │
│                                                                   │
│  Mobile (.env)                          Vercel (backend)          │
│  ─────────────                          ──────────────            │
│  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID   ══> GOOGLE_MOBILE_WEB_CLIENT_ID  │
│  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ══> GOOGLE_ANDROID_CLIENT_ID    │
│  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID   ══> GOOGLE_IOS_CLIENT_ID         │
│                                                                   │
│  Se estes pares NÃO forem iguais → Google rejeita com            │
│  "unauthorized_client" ou "invalid_grant"                         │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama completo de onde vai cada credencial:

```
┌─────────────────────────────────────────────────────────────┐
│               Google Cloud Console                           │
│                                                              │
│  ┌─ Web Client 1 (NextAuth) ──────────────────────────┐    │
│  │                                                      │    │
│  │  Client ID ──────────> Vercel: GOOGLE_CLIENT_ID      │    │
│  │  Client Secret ──────> Vercel: GOOGLE_CLIENT_SECRET  │    │
│  │                                                      │    │
│  │  Só para login WEB (browser)                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Web Client 2 (Mobile) ────────────────────────────┐    │
│  │                                                      │    │
│  │  Client ID ──────────> Vercel: GOOGLE_MOBILE_WEB_CLIENT_ID    │
│  │               ──────> Mobile: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID│
│  │               (MESMO VALOR nos dois sítios!)         │    │
│  │                                                      │    │
│  │  Client Secret ──────> Vercel: GOOGLE_MOBILE_WEB_CLIENT_SECRET│
│  │               (NÃO vai para o mobile — só backend)   │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Android Client ──────────────────────────────────┐      │
│  │                                                    │      │
│  │  Client ID ──────────> Vercel: GOOGLE_ANDROID_CLIENT_ID     │
│  │             ──────────> Mobile: EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID│
│  │             (MESMO VALOR nos dois sítios!)         │      │
│  │                                                    │      │
│  │  Sem secret — validação por package + SHA-1        │      │
│  └────────────────────────────────────────────────────┘      │
│                                                              │
│  ┌─ iOS Client ──────────────────────────────────────┐      │
│  │                                                    │      │
│  │  Client ID ──────────> Vercel: GOOGLE_IOS_CLIENT_ID │      │
│  │             ──────────> Mobile: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID│
│  │             (MESMO VALOR nos dois sítios!)         │      │
│  │                                                    │      │
│  │  Sem secret — validação por Bundle ID              │      │
│  └────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Fluxo de Autenticação

### 9.1 Login Web (NextAuth)

```
Utilizador → Clica "Login com Google" no site
  → NextAuth redireciona para Google (GOOGLE_CLIENT_ID)
  → Utilizador autentica no Google
  → Google redireciona para /api/auth/callback/google
  → NextAuth valida, cria sessão com cookie
  → Utilizador autenticado ✅
```

### 9.2 Login Mobile (PKCE)

```
Utilizador → Clica "Login com Google" na app
  → expo-auth-session abre browser seguro
  → Envia pedido ao Google com:
      - client_id (Android/iOS/Web conforme plataforma)
      - redirect_uri (athlifyr://oauth2redirect ou com.athlifyr.app:/oauth2redirect)
      - code_challenge (PKCE)
      - scopes: openid, profile, email
  → Utilizador autentica no Google
  → Google redireciona de volta à app com authorization code
  → App envia ao backend:
      - code
      - codeVerifier (PKCE)
      - redirectUri
      - platform (ios/android/web)
  → Backend (POST /api/auth/google/exchange):
      - Seleciona o client_id correto para a plataforma
      - Troca o code com a Google (server-to-server)
      - Valida o ID token
      - Cria/encontra utilizador na BD
      - Gera JWT próprio do Athlifyr
  → App recebe JWT e guarda no SecureStore
  → Utilizador autenticado ✅
```

### 9.3 Seleção de Client ID por Plataforma

O backend seleciona automaticamente o client ID correto para a troca de código:

| Plataforma      | Client ID usado na troca      | Secret necessário?                      |
| --------------- | ----------------------------- | --------------------------------------- |
| `web` (Expo Go) | `GOOGLE_MOBILE_WEB_CLIENT_ID` | Sim (`GOOGLE_MOBILE_WEB_CLIENT_SECRET`) |
| `android`       | `GOOGLE_ANDROID_CLIENT_ID`    | Não (PKCE apenas)                       |
| `ios`           | `GOOGLE_IOS_CLIENT_ID`        | Não (PKCE apenas)                       |

Para Android e iOS, a troca é feita diretamente via `fetch` ao endpoint `https://oauth2.googleapis.com/token` sem client secret, enviando apenas o `code_verifier` como prova de origem.

---

## 10. SHA-1 Fingerprints (Android)

O client Android do Google Cloud Console precisa de ter os SHA-1 fingerprints corretos. Sem eles, o login Android falha **silenciosamente**.

### Como obter cada SHA-1:

#### Debug (desenvolvimento local)

```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android
```

#### EAS Build (development/preview builds)

```bash
# Ver as credenciais do projeto
eas credentials -p android

# Ou durante o build, o SHA-1 aparece nos logs
eas build -p android --profile preview
```

#### Play Store Signing (produção)

```
Google Play Console → App → Setup → App signing → SHA-1 certificate fingerprint
```

### Onde adicionar:

**Google Cloud Console → OAuth Client Android → SHA-1 certificate fingerprint**

Adiciona **todos os SHA-1** que usas:

1. Debug keystore (para desenvolvimento)
2. Upload key (a tua keystore de produção)
3. App signing key (a key que o Google Play usa — pode ser diferente da upload key)

> **ATENÇÃO:** Se usas o Google Play App Signing (recomendado), o Google gera uma key própria para assinar a app na Play Store. O SHA-1 desta key é diferente da tua upload key. Tens de adicionar **ambos**.

---

## 11. Resolução de Problemas

### Erro: `unauthorized_client`

**Causa:** O client ID que a app usou para pedir o código não coincide com o que o backend usou para trocar.

**Solução:** Verifica que os pares coincidem (ver [secção 8](#8-mapa-de-correspondência-mobile--backend)).

### Erro: `redirect_uri_mismatch`

**Causa:** O redirect URI enviado na troca não coincide com o registado no Google Console.

**Solução:**

1. Vê nos logs do mobile o redirect URI real: `[GoogleAuth] { redirectUri: "..." }`
2. Adiciona esse URI exacto no Google Console → OAuth Client → Authorized redirect URIs

### Erro: `invalid_grant`

**Causa:** Código de autorização expirado (dura ~5 minutos) ou já foi usado.

**Solução:** Tenta novamente — o código só pode ser usado uma vez.

### Erro: `Error 400: invalid_request` (Android)

**Causa:** O redirect URI do Android tem formato errado. Android OAuth clients esperam `scheme:/path` (um slash), mas `makeRedirectUri()` gera `scheme://path` (dois slashes).

**Solução:** O código já trata isto — para Android standalone usa o literal `com.athlifyr.app:/oauth2redirect`.

### Login falha silenciosamente no Android

**Causa provável:** SHA-1 fingerprint em falta no Google Console.

**Solução:**

1. Corre `eas credentials -p android` para ver o SHA-1 atual
2. Adiciona-o no Google Console → Android OAuth Client
3. Espera ~5 minutos para propagar

### Login falha no iOS

**Causa provável:** Bundle ID incorreto no Google Console.

**Solução:** Confirma que o Bundle ID no iOS OAuth Client é `com.athlifyr.app` (idêntico ao `app.json` → `ios.bundleIdentifier`).

### Google Sign-In não funciona no Expo Go

**Esperado.** O Expo Go não suporta deep links personalizados como `athlifyr://`. O login Google só funciona em:

- Development builds (`eas build --profile development`)
- Preview builds (`eas build --profile preview`)
- Production builds

A app mostra um aviso nos logs: `[GoogleAuth] Google Sign-In is not supported in Expo Go`.

---

## Ficheiros Relevantes no Código

| Ficheiro                                | Descrição                                            |
| --------------------------------------- | ---------------------------------------------------- |
| `mobile/src/hooks/useGoogleAuth.ts`     | Hook PKCE — pede código ao Google e envia ao backend |
| `mobile/app/login.tsx`                  | Ecrã de login que usa o hook                         |
| `mobile/app/oauth2redirect.tsx`         | Rota de deep link para o redirect do Google          |
| `app/api/auth/google/exchange/route.ts` | Backend: troca código por tokens, cria utilizador    |
| `app/api/auth/google-mobile/route.ts`   | Legacy: verificação de ID token (referência)         |
| `app/api/auth/[...nextauth]/route.ts`   | NextAuth: login web com Google                       |
| `mobile/app.json`                       | Config Expo: scheme `athlifyr` e `com.athlifyr.app`  |
| `mobile/.env`                           | Variáveis Google OAuth para a app mobile             |
| `.env`                                  | Variáveis Google OAuth para o backend (Vercel)       |
