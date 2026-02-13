# Como Obter Google OAuth Credentials

## 🎯 Objetivo

Obter `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` para configurar Google Sign-In.

---

## 📋 Passo a Passo

### 1. Aceder Google Cloud Console

Vai a: https://console.cloud.google.com/

### 2. Selecionar/Criar Projeto

- Se já tens projeto "Athlifyr", seleciona-o
- Se não, clica em "New Project" → nome: "Athlifyr" → Create

### 3. Ativar Google+ API (se ainda não estiver)

1. Menu lateral → "APIs & Services" → "Enabled APIs & services"
2. Clica "+ ENABLE APIS AND SERVICES"
3. Pesquisa "Google+ API"
4. Clica "Enable"

### 4. Ir para Credentials

Menu lateral → "APIs & Services" → "Credentials"

### 5. Criar OAuth Consent Screen (se for primeira vez)

1. Clica "OAuth consent screen" (no menu lateral)
2. Tipo: **External**
3. Preenche:
   - **App name:** Athlifyr
   - **User support email:** teu email
   - **Developer contact:** teu email
4. **Scopes:** Adiciona:
   - `…/auth/userinfo.email`
   - `…/auth/userinfo.profile`
5. **Test users:** Adiciona teu email (para testar antes de publicar)
6. Clica "Save and Continue"

### 6. Criar OAuth Client ID

1. Volta a "Credentials"
2. Clica "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Athlifyr Web Client` (ou o que quiseres)

**Authorized JavaScript origins:**

```
https://www.athlifyr.com
http://localhost:3000
```

**Authorized redirect URIs:**

```
https://www.athlifyr.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

5. Clica "Create"

### 7. Copiar Credentials

Vai aparecer um modal com:

- **Client ID:** `849323427488-xxx...xxx.apps.googleusercontent.com`
- **Client secret:** `GOCSPX-xxx...xxx`

**COPIA ambos** (vais precisar deles).

---

## 🔐 Guardar em Segurança

### Local (.env)

```bash
# .env (NÃO fazer commit!)
GOOGLE_CLIENT_ID="849323427488-xxx...xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx...xxx"
```

### Vercel (Production)

```bash
# Via CLI
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# Ou via Dashboard:
# Vercel → Project → Settings → Environment Variables → Add
```

---

## ⚠️ Segurança

- **NUNCA** fazer commit do `.env` com secrets
- `.env` está no `.gitignore` (verificar!)
- `GOOGLE_CLIENT_SECRET` é PRIVADO (só backend)
- `GOOGLE_CLIENT_ID` pode ser público (aparece no frontend)

---

## 🧪 Verificar se Está a Funcionar

### Testar Localmente

```bash
# .env tem as credentials
pnpm dev

# Abre http://localhost:3000
# Clica "Sign in with Google"
# Deve funcionar ✅
```

### Testar em Produção

1. Faz deploy
2. Abre https://www.athlifyr.com
3. Clica "Sign in with Google"
4. Deve funcionar ✅

---

## 🐛 Se Não Funcionar

### "invalid_client"

**Causa:** `GOOGLE_CLIENT_ID` ou `GOOGLE_CLIENT_SECRET` errados

**Fix:** Copia novamente do Google Console (pode ter mudado)

### "redirect_uri_mismatch"

**Causa:** O redirect URI não está autorizado

**Fix:**

1. Vai a Google Console → Credentials
2. Clica no teu OAuth Client
3. Verifica "Authorized redirect URIs"
4. Deve ter EXATAMENTE: `https://www.athlifyr.com/api/auth/callback/google`
5. Sem trailing slash, com www, com https

### "invalid_grant"

**Causa:** Host está a mudar durante OAuth (athlifyr.com → www.athlifyr.com)

**Fix:** Ver [OAUTH_FIX_INVALID_GRANT.md](./OAUTH_FIX_INVALID_GRANT.md)

---

## 📚 Links Úteis

- **Google Console:** https://console.cloud.google.com/apis/credentials
- **OAuth Playground (testar API):** https://developers.google.com/oauthplayground
- **Google Identity Docs:** https://developers.google.com/identity/protocols/oauth2

---

## ✅ Checklist

- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API ativada
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client ID criado (Web application)
- [ ] Redirect URIs corretos (`https://www.athlifyr.com/api/auth/callback/google`)
- [ ] JavaScript origins corretos (`https://www.athlifyr.com`)
- [ ] `GOOGLE_CLIENT_ID` copiado
- [ ] `GOOGLE_CLIENT_SECRET` copiado
- [ ] Credentials adicionados ao `.env` local
- [ ] Credentials adicionados ao Vercel (production)
- [ ] Testado localmente ✅
- [ ] Testado em produção ✅
