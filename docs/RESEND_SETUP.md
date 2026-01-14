# Resend Email Setup

Este guia explica como configurar o Resend para enviar emails transacionais (recuperação de password, verificação de email, etc.) na Athlifyr.

## 📋 O que é o Resend?

[Resend](https://resend.com) é uma plataforma moderna de envio de emails para developers, oferecendo:

- API simples e intuitiva
- Templates HTML responsivos
- Deliverability otimizado
- Tier gratuito generoso (100 emails/dia, 3000/mês)
- Suporte para domínios personalizados

## 🚀 Setup Rápido

### 1. Criar conta no Resend

1. Acede a [resend.com](https://resend.com)
2. Clica em "Sign Up" no canto superior direito
3. Cria a tua conta com email ou GitHub

### 2. Obter API Key

1. Após login, vai para [resend.com/api-keys](https://resend.com/api-keys)
2. Clica em "Create API Key"
3. Dá um nome (ex: "Athlifyr Production")
4. Seleciona as permissões:
   - ✅ **Sending access** (obrigatório)
5. Clica em "Create"
6. **IMPORTANTE**: Copia a API key imediatamente (só é mostrada uma vez)

### 3. Configurar no projeto

Adiciona a API key ao ficheiro `.env`:

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

⚠️ **Nunca commits a API key no Git!** O ficheiro `.env` está no `.gitignore`.

## 📧 Domínio de Email

### Opção 1: Usar domínio padrão (desenvolvimento)

Por padrão, os emails são enviados de `onboarding@resend.dev`. Perfeito para desenvolvimento e testes.

**Limitação**: 100 emails/dia, pode cair em spam.

### Opção 2: Configurar domínio personalizado (produção)

Para produção, recomenda-se usar um domínio próprio:

#### Passo 1: Adicionar domínio

1. No dashboard Resend, vai a [Domains](https://resend.com/domains)
2. Clica em "Add Domain"
3. Introduz o teu domínio (ex: `athlifyr.com`)

#### Passo 2: Configurar DNS

O Resend vai fornecer registos DNS para adicionar no teu provider:

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

**Providers comuns**:

- **Cloudflare**: DNS → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **GoDaddy**: DNS Management → Add Record

#### Passo 3: Verificar

1. Adiciona os 3 registos DNS fornecidos:
   - **TXT** (DKIM) - Autenticação
   - **MX** (opcional) - Receber emails
   - **TXT** (SPF) - Anti-spam
2. Aguarda propagação (pode demorar até 48h, geralmente < 1h)
3. Clica em "Verify DNS Records" no Resend

✅ Status: **Verified** → Podes enviar emails!

## 🎨 Emails Enviados

### Password Reset Email

Template usado: `/app/api/auth/forgot-password/route.ts`

**Conteúdo**:

- Header com branding Athlifyr
- Botão call-to-action para reset
- Link alternativo (fallback)
- Aviso de expiração (1 hora)
- Footer com informações

**Preview**:

```
🔐 Recuperação de Password

Recebemos um pedido para recuperar a password da tua conta Athlifyr.

[Botão: Recuperar Password]

Link alternativo: https://athlifyr.com/auth/reset-password?token=...

⚠️ Este link expira em 1 hora.
```

## 🔧 Personalizar Emails

Para personalizar os templates de email:

1. Edita o ficheiro `/app/api/auth/forgot-password/route.ts`
2. Modifica a secção `html:` dentro de `resend.emails.send()`
3. Usa HTML inline (não suporta CSS externo)
4. Testa com diferentes clientes de email

**Boas práticas**:

- Usa tabelas para layout (compatibilidade)
- Inline CSS (não usa classes externas)
- Imagens hospedadas externamente
- Testa no [Litmus](https://litmus.com) ou similar

## 📊 Monitorização

### Dashboard Resend

1. Acede a [resend.com/emails](https://resend.com/emails)
2. Vê todos os emails enviados
3. Status: **Delivered**, **Bounced**, **Complained**
4. Click tracking (opcional)

### Logs

Os logs de envio estão em:

```
/app/api/auth/forgot-password/route.ts
/app/api/auth/reset-password/route.ts
```

## 🐛 Troubleshooting

### Email não chega

1. **Verifica spam**: Pede ao utilizador para verificar
2. **API Key**: Confirma que está correta no `.env`
3. **Quota**: Verifica se não excedeste o limite (100/dia no free tier)
4. **Logs**: Verifica o terminal do servidor Next.js

### Email vai para spam

**Soluções**:

- Usa domínio verificado (não `resend.dev`)
- Configura SPF, DKIM, DMARC corretamente
- Aquece o domínio (envia gradualmente)
- Evita palavras spam no subject/body

### Erro: "Invalid API key"

1. Confirma que a key começa com `re_`
2. Recria a API key no dashboard
3. Atualiza o `.env` e reinicia o servidor

### Erro: "Domain not verified"

1. Vai a [Domains](https://resend.com/domains)
2. Clica no domínio
3. Verifica se os registos DNS estão corretos
4. Aguarda propagação (pode demorar até 48h)

## 💰 Planos e Limites

### Free Tier

- ✅ 100 emails/dia
- ✅ 3,000 emails/mês
- ✅ 1 domínio
- ✅ API access

### Pro ($20/mês)

- ✅ 50,000 emails/mês
- ✅ Domínios ilimitados
- ✅ Email analytics
- ✅ Priority support

### Enterprise (custom)

- ✅ Volumes altos
- ✅ Dedicated IPs
- ✅ SLA garantido

## 🔐 Segurança

### Boas práticas

1. **Nunca commits a API key**: Usa `.env` (já está no `.gitignore`)
2. **Rotate keys**: Cria novas keys periodicamente
3. **Permissions mínimas**: Só "Sending access" se não precisares de mais
4. **Separate keys**: Usa keys diferentes para dev/staging/prod
5. **Monitor usage**: Verifica logs de envio regularmente

### Em produção

```bash
# Variável de ambiente (Vercel, Railway, etc.)
RESEND_API_KEY="re_prod_xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## 📚 Recursos

- [Resend Docs](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [React Email](https://react.email) - Templates avançados
- [Resend Status](https://status.resend.com)

## 🆘 Suporte

- **Resend Support**: support@resend.com
- **Discord**: [discord.gg/resend](https://discord.gg/resend)
- **Twitter**: [@resendlabs](https://twitter.com/resendlabs)

---

✅ Setup completo! Agora podes enviar emails transacionais com o Resend.
