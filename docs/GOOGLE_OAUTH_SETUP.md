# Google OAuth Setup Guide

Este guia explica como configurar a autenticação Google OAuth para a aplicação Athlifyr.

## Pré-requisitos

- Conta Google
- Acesso à [Google Cloud Console](https://console.cloud.google.com)

## Passos para Configuração

### 1. Criar Projeto na Google Cloud Console

1. Acede a https://console.cloud.google.com
2. Clica em **"Select a Project"** → **"New Project"**
3. Nome do projeto: `Athlifyr` (ou o nome que preferires)
4. Clica em **"Create"**

### 2. Ativar a Google+ API

1. No menu lateral, vai a **"APIs & Services"** → **"Library"**
2. Procura por **"Google+ API"** ou **"Google People API"**
3. Clica em **"Enable"**

### 3. Configurar OAuth Consent Screen

1. No menu lateral, vai a **"APIs & Services"** → **"OAuth consent screen"**
2. Seleciona **"External"** (a menos que tenhas Google Workspace)
3. Clica em **"Create"**

#### Informação da Aplicação

- **App name**: `Athlifyr`
- **User support email**: O teu email
- **App logo**: (Opcional) Podes adicionar o logo da aplicação
- **Application home page**: `http://localhost:3000` (para desenvolvimento)
- **Authorized domains**:
  - Para produção: adiciona o teu domínio (ex: `athlifyr.com`)
  - Para desenvolvimento: deixa vazio ou adiciona `localhost`
- **Developer contact email**: O teu email

4. Clica em **"Save and Continue"**

#### Scopes

1. Clica em **"Add or Remove Scopes"**
2. Adiciona os seguintes scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
3. Clica em **"Update"** e depois **"Save and Continue"**

#### Test Users (apenas para ambiente de desenvolvimento)

1. Clica em **"Add Users"**
2. Adiciona os emails que vão testar a aplicação
3. Clica em **"Save and Continue"**

### 4. Criar Credenciais OAuth

1. No menu lateral, vai a **"APIs & Services"** → **"Credentials"**
2. Clica em **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: `Web application`
4. **Name**: `Athlifyr Web Client`

#### Authorized JavaScript origins

Para desenvolvimento:

```
http://localhost:3000
```

Para produção:

```
https://seudominio.com
```

#### Authorized redirect URIs

**IMPORTANTE**: Deves adicionar TODOS os URIs onde a aplicação vai correr.

Para desenvolvimento local:

```
http://localhost:3000/api/auth/callback/google
```

Para produção (Vercel):

```
https://seudominio.com/api/auth/callback/google
https://seudominio.vercel.app/api/auth/callback/google
```

**Nota**: Se estiveres a usar Vercel, adiciona também o preview deployment:

```
https://*.vercel.app/api/auth/callback/google
```

⚠️ **Atenção**: O Google não aceita wildcards no domínio principal, tens que adicionar cada URL específica.

5. Clica em **"Create"**

### 5. Copiar as Credenciais

Após criar, vais ver uma modal com:

- **Client ID**: Uma string longa como `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Uma string como `GOCSPX-abc123def456`

**⚠️ IMPORTANTE**: Guarda estas credenciais num local seguro!

### 6. Configurar as Variáveis de Ambiente

1. Abre o ficheiro `.env` na raiz do projeto
2. Adiciona as credenciais:

```env
GOOGLE_CLIENT_ID="o-teu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="o-teu-client-secret"
```

3. **NUNCA faças commit do ficheiro `.env`** com credenciais reais!

### 7. Testar a Autenticação

1. Inicia a aplicação:

```bash
pnpm dev
```

2. Acede a `http://localhost:3000/auth/signin`
3. Clica no botão **"Continuar com Google"**
4. Deves ver a página de consentimento do Google
5. Após autorizar, serás redirecionado de volta para a aplicação

## Ambiente de Produção

Para produção, precisas de:

1. **Publicar a aplicação no OAuth Consent Screen**:
   - Vai a **"OAuth consent screen"**
   - Clica em **"Publish App"**
   - Se a app requerer verificação do Google, pode demorar alguns dias

2. **Atualizar as URIs**:
   - Adiciona o domínio de produção às **Authorized JavaScript origins**
   - Adiciona o callback de produção às **Authorized redirect URIs**

3. **Atualizar variáveis de ambiente**:
   - No teu servidor de produção (Vercel, etc.), adiciona as variáveis:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `NEXTAUTH_URL` (URL de produção)
     - `NEXTAUTH_SECRET` (gera um novo com `openssl rand -base64 32`)

## Troubleshooting

### Erro: "redirect_uri_mismatch"

- Verifica que o redirect URI na Google Console corresponde exatamente a:
  - Desenvolvimento: `http://localhost:3000/api/auth/callback/google`
  - Produção: `https://teudominio.com/api/auth/callback/google`
- Nota: `http://` vs `https://` e `localhost` vs `127.0.0.1` são diferentes!

### Erro: "Access blocked: This app's request is invalid"

- Verifica que adicionaste os scopes corretos no OAuth Consent Screen
- Certifica-te que a aplicação está publicada (ou que adicionaste test users)

### Erro: "Invalid client"

- Verifica que o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos no `.env`
- Confirma que não há espaços extra antes/depois das credenciais

### O botão Google não aparece

- Verifica que as variáveis de ambiente estão configuradas
- Reinicia o servidor Next.js após alterar o `.env`
- Verifica a consola do browser para erros

## Recursos Úteis

- [Google Cloud Console](https://console.cloud.google.com)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Segurança

⚠️ **Boas práticas**:

1. **NUNCA** faças commit de credenciais no repositório
2. Usa `.env.local` para desenvolvimento local (está no `.gitignore`)
3. Em produção, usa variáveis de ambiente do hosting (Vercel, Railway, etc.)
4. Roda as credenciais se suspeitares que foram expostas
5. Limita os scopes apenas ao necessário (email, profile)
6. Adiciona domínios autorizados para evitar phishing

## Notas

- O Google OAuth permite que users façam login/signup sem password
- Users que fazem login com Google NÃO precisam de password na base de dados
- O campo `password` no modelo User é opcional (`String?`) para suportar OAuth
- Users podem ter múltiplos providers (Google + Password) ligados à mesma conta
