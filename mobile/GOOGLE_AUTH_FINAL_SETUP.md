# ✅ Google Sign-In - Configuração Final Completa

## 📋 Resumo da Configuração

### 1. ✅ Google Cloud Console

**OAuth Client ID criado:**

- **Tipo:** Android
- **Nome:** Athlifyr Android (Production)
- **Package name:** `com.athlifyr.app`
- **SHA-1 fingerprint:** Do keystore EAS (configurado corretamente)
- **Client ID:** `849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq.apps.googleusercontent.com`

**Web Client ID (para fallback):**

- **Client ID:** `849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9.apps.googleusercontent.com`

---

### 2. ✅ Variáveis de Ambiente

**Arquivo `.env`:**

```env
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9.apps.googleusercontent.com
```

**Arquivo `eas.json`:**

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://www.athlifyr.com",
        "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9.apps.googleusercontent.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://www.athlifyr.com",
        "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq.apps.googleusercontent.com",
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9.apps.googleusercontent.com"
      }
    }
  }
}
```

---

### 3. ✅ Código Corrigido

**`src/hooks/useGoogleAuth.ts`:**

```typescript
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId, // ✅ Usa o Android Client ID correto
  iosClientId,
  webClientId,
  redirectUri: "athlifyr://",
});
```

**❌ ANTES (ERRADO):**

```typescript
// ERRADO - estava a usar webClientId para tudo
androidClientId: webClientId,
iosClientId: webClientId,
```

**✅ AGORA (CORRETO):**

```typescript
// CORRETO - usa o androidClientId específico
androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
```

---

## 🚀 Fazer Novo Build

Agora que o código está corrigido, faz um novo build:

```bash
# Preview (para testes)
eas build --platform android --profile preview

# OU Production
eas build --platform android --profile production
```

---

## 🧪 Como Testar

### 1. Instalar o APK no telemóvel

- Escaneia o QR code quando o build terminar
- OU acede ao link no telemóvel

### 2. Abrir a app e tentar Google Sign-In

- Clica no botão "Continue with Google"
- Deve abrir o seletor de contas Google
- Seleciona a tua conta
- A app deve fazer login com sucesso

### 3. Verificar nos logs (opcional)

Se tiveres `adb` instalado:

```bash
adb logcat | grep -i "google"
```

Deves ver:

```
Google Auth Config: {
  androidClientId: "849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq...",
  webClientId: "849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9...",
  ...
}
```

---

## ⚠️ Notas Importantes

### Expo Go vs Standalone Build

| Ambiente                | Funciona? | Porquê                                     |
| ----------------------- | --------- | ------------------------------------------ |
| **Expo Go**             | ❌ NÃO    | Package name diferente, SHA-1 diferente    |
| **Preview Build (APK)** | ✅ SIM    | Package name correto, SHA-1 do EAS correto |
| **Production Build**    | ✅ SIM    | Package name correto, SHA-1 do EAS correto |

### Profiles diferentes = SHA-1 diferentes?

**NÃO!** O EAS usa o **mesmo keystore** para todos os profiles (preview, production) por padrão.

Portanto:

- ✅ O mesmo OAuth Client ID funciona para `preview` e `production`
- ✅ Não precisas criar 2 OAuth clients separados

---

## 🐛 Troubleshooting

### ❌ Erro: `DEVELOPER_ERROR`

**Causas possíveis:**

1. Client ID errado no código
2. SHA-1 fingerprint não corresponde ao keystore
3. Package name errado no Google Console

**Solução:**

- Confirma que o Client ID no `.env` está correto
- Confirma que criaste o OAuth Client como tipo "Android"
- Confirma que o SHA-1 está correto no Google Console

### ❌ Erro: `redirect_uri_mismatch`

**Causa:**
O `redirectUri` não está configurado corretamente.

**Solução:**
No código, deve ser:

```typescript
redirectUri: "athlifyr://";
```

Não precisa configurar redirect URIs no Google Console para Android apps nativas.

### ❌ Não abre o seletor de contas

**Causa:**
Provavelmente estás no Expo Go.

**Solução:**
Usa um build standalone (preview ou production).

---

## ✅ Checklist Final

Antes de fazer o build, confirma:

- [ ] OAuth Client ID Android criado no Google Console
- [ ] SHA-1 fingerprint correto no Google Console
- [ ] Package name `com.athlifyr.app` no Google Console
- [ ] `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` no `.env` e `eas.json`
- [ ] `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` no `.env` e `eas.json`
- [ ] Código corrigido em `useGoogleAuth.ts` (usa `androidClientId` correto)
- [ ] Build feito com `eas build --platform android --profile preview`

---

## 📱 Estado Atual

### Último Build

- **Profile:** preview
- **Link:** https://expo.dev/accounts/joaomduart/projects/athlifyr/builds/e99c1208-ef5d-4a13-9bca-356ab126d2ad
- **Status:** ✅ Completo (mas com código antigo - precisa novo build)

### Próximo Build (com código corrigido)

```bash
eas build --platform android --profile preview
```

---

## 🎯 Resultado Esperado

Quando instalares o próximo APK e tentares fazer Google Sign-In:

1. ✅ Clicas em "Continue with Google"
2. ✅ Abre o seletor de contas Google
3. ✅ Selecionas a tua conta
4. ✅ A app faz login automaticamente
5. ✅ És redirecionado para a home da app (feed)

**Sem erros de `DEVELOPER_ERROR` ou `redirect_uri_mismatch`!** 🎉

---

## 📚 Recursos

- [Expo Auth Session - Google](https://docs.expo.dev/guides/authentication/#google)
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
