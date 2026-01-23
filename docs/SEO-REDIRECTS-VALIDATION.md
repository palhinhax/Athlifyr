# SEO Redirects Validation Guide

## 🎯 Objetivo

Garantir que todas as URLs redirecionam corretamente para o domínio canónico `https://www.athlifyr.com` com prefixo de idioma, usando apenas **301 redirects** (nunca 307/308).

## ✅ Validação de Redirects

### 1. Host Normalization (www)

Testar que URLs sem `www` redirecionam para `www`:

```bash
# Deve redirecionar: athlifyr.com → www.athlifyr.com
curl -I https://athlifyr.com

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt
```

### 2. Locale Prefix Required

Testar que URLs sem idioma redirecionam para `/pt/`:

```bash
# Deve redirecionar: /events → /pt/events
curl -I https://www.athlifyr.com/events

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt/events
```

```bash
# Deve redirecionar: /sports/trail → /pt/sports/trail
curl -I https://www.athlifyr.com/sports/trail

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt/sports/trail
```

```bash
# Deve redirecionar: /feed → /pt/feed
curl -I https://www.athlifyr.com/feed

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt/feed
```

### 3. Combined Redirect (www + locale)

Testar que URLs sem `www` E sem idioma fazem **apenas 1 redirect 301**:

```bash
# Deve redirecionar DIRETO: athlifyr.com/events → www.athlifyr.com/pt/events
curl -I https://athlifyr.com/events

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt/events
#
# ❌ NÃO PODE ACONTECER: 301 → www.athlifyr.com/events → 301 → /pt/events (2 redirects)
```

```bash
# Deve redirecionar DIRETO: athlifyr.com/sports/trail → www.athlifyr.com/pt/sports/trail
curl -I https://athlifyr.com/sports/trail

# Resposta esperada:
# HTTP/2 301
# location: https://www.athlifyr.com/pt/sports/trail
```

### 4. Final URLs Return 200

Testar que URLs canónicas devolvem **200 OK** (sem redirect):

```bash
# Deve devolver 200 OK (sem redirect)
curl -I https://www.athlifyr.com/pt

# Resposta esperada:
# HTTP/2 200
```

```bash
# Deve devolver 200 OK
curl -I https://www.athlifyr.com/en/events

# Resposta esperada:
# HTTP/2 200
```

```bash
# Deve devolver 200 OK
curl -I https://www.athlifyr.com/pt/sports/trail

# Resposta esperada:
# HTTP/2 200
```

## 🗺️ Sitemap Validation

Verificar que o sitemap apenas lista URLs canónicas:

```bash
# Verificar sitemap
curl https://www.athlifyr.com/sitemap.xml
```

### ✅ URLs Corretas no Sitemap

Todas as URLs devem ter este formato:

```xml
<url>
  <loc>https://www.athlifyr.com/pt/events</loc>
  ...
</url>

<url>
  <loc>https://www.athlifyr.com/en/events/corrida-fim-da-europa-2026</loc>
  ...
</url>
```

### ❌ URLs Incorretas (NÃO PODEM APARECER)

```xml
<!-- ❌ Sem www -->
<loc>https://athlifyr.com/pt/events</loc>

<!-- ❌ Sem idioma -->
<loc>https://www.athlifyr.com/events</loc>

<!-- ❌ Sem www e sem idioma -->
<loc>https://athlifyr.com/events</loc>
```

## 🔍 Robots.txt Validation

Verificar que o robots.txt aponta para sitemap correto:

```bash
curl https://www.athlifyr.com/robots.txt
```

Resposta esperada:

```
User-Agent: *
Allow: /

Sitemap: https://www.athlifyr.com/sitemap.xml
```

## 📊 Google Search Console Validation

### 1. Submit Sitemap

1. Aceder a [Google Search Console](https://search.google.com/search-console)
2. Selecionar propriedade: `https://www.athlifyr.com`
3. Ir a **Indexação** → **Sitemaps**
4. Adicionar novo sitemap: `https://www.athlifyr.com/sitemap.xml`
5. Clicar em **Submeter**

### 2. URL Inspection

Testar algumas URLs para garantir que são indexáveis:

1. Ir a **URL Inspection** (barra de pesquisa no topo)
2. Testar URLs:
   - `https://www.athlifyr.com/pt`
   - `https://www.athlifyr.com/pt/events`
   - `https://www.athlifyr.com/en/events/corrida-fim-da-europa-2026`
3. Verificar que aparecem como **URL is on Google** ou **URL can be indexed**
4. Verificar que **não há warnings de redirect**

### 3. Check Indexing Status

Após 1-2 semanas:

1. Ir a **Indexação** → **Páginas**
2. Verificar que:
   - ✅ URLs com `www.athlifyr.com/{locale}/...` aparecem como **Indexadas**
   - ❌ URLs com redirects 307/308 desaparecem progressivamente
   - ❌ Não há erros de "redirect chain" ou "redirect loop"

## 🧪 Test Suite (Automated)

Script para testar todos os redirects de uma vez:

```bash
#!/bin/bash

echo "🧪 Testing SEO Redirects..."

# Test 1: www normalization
echo "\n1️⃣ Testing www redirect..."
curl -I https://athlifyr.com 2>&1 | grep -E "HTTP|location"

# Test 2: locale prefix
echo "\n2️⃣ Testing locale prefix redirect..."
curl -I https://www.athlifyr.com/events 2>&1 | grep -E "HTTP|location"

# Test 3: combined redirect
echo "\n3️⃣ Testing combined redirect..."
curl -I https://athlifyr.com/events 2>&1 | grep -E "HTTP|location"

# Test 4: final URL returns 200
echo "\n4️⃣ Testing final URL returns 200..."
curl -I https://www.athlifyr.com/pt/events 2>&1 | grep -E "HTTP"

# Test 5: sitemap
echo "\n5️⃣ Testing sitemap..."
curl -I https://www.athlifyr.com/sitemap.xml 2>&1 | grep -E "HTTP"

echo "\n✅ Tests complete!"
```

## 📋 Checklist de Validação

Antes de marcar como completo, verificar:

- [ ] `athlifyr.com/*` → **301** → `www.athlifyr.com/pt/*`
- [ ] `www.athlifyr.com/events` → **301** → `www.athlifyr.com/pt/events`
- [ ] `athlifyr.com/events` → **301 DIRETO** → `www.athlifyr.com/pt/events` (1 redirect, não 2)
- [ ] `www.athlifyr.com/pt/events` → **200 OK** (sem redirect)
- [ ] Sitemap lista apenas URLs com `www.athlifyr.com/{locale}/...`
- [ ] Robots.txt aponta para `https://www.athlifyr.com/sitemap.xml`
- [ ] Todas as páginas têm canonical correto: `<link rel="canonical" href="https://www.athlifyr.com/{locale}/...">`
- [ ] Não existem redirects 307/308 (apenas 301)
- [ ] Sitemap submetido no Google Search Console
- [ ] URL Inspection confirma que URLs finais são indexáveis

## 🔧 Troubleshooting

### Problema: Ainda vejo 307/308

**Causa**: Pode haver redirects a nível de Vercel/Cloudflare.

**Solução**:

1. Verificar Vercel dashboard → Project Settings → Redirects
2. Remover qualquer redirect conflituante
3. Garantir que apenas o middleware faz redirects

### Problema: Cadeia de redirects (2 ou mais)

**Causa**: Middleware não está a normalizar www + locale num único redirect.

**Solução**:

1. Verificar `/middleware.ts` - deve fazer ambos os fixes num único `NextResponse.redirect()`
2. Ver exemplo em `middleware.ts:56-84`

### Problema: URLs sem locale continuam indexadas

**Causa**: Google ainda tem URLs antigas em cache.

**Solução**:

1. Usar **URL Inspection** → **Request Indexing** para forçar re-crawl
2. Aguardar 1-2 semanas para Google atualizar cache
3. URLs antigas vão desaparecer progressivamente

## 📚 Referências

- [Google Search Central - Redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Next.js - Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## 📧 Support

Se encontrares problemas durante a validação:

- Verificar logs do Vercel
- Verificar configuração de ambiente
- Contactar: hello@athlifyr.com
