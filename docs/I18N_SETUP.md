# Internacionalização (i18n) - Sistema de Idiomas

## ✅ Implementação Completa

O Athlifyr agora suporta **Português (pt)** e **Inglês (en)** com:

### 🔧 Funcionalidades

1. **Deteção Automática de Idioma**
   - Prioridade 1: Preferência guardada do utilizador (base de dados)
   - Prioridade 2: Cookie `NEXT_LOCALE`
   - Prioridade 3: Idioma do browser (`Accept-Language`)
   - Prioridade 4: Português (idioma padrão)

2. **Seletor de Idioma nas Definições**
   - Disponível em `/settings`
   - 🇵🇹 Português
   - 🇬🇧 English
   - Guarda preferência na base de dados (users autenticados)
   - Guarda em cookie (visitors não autenticados)

3. **Mudança Imediata**
   - Ao mudar idioma, a página recarrega automaticamente
   - Tradução aplicada em toda a aplicação

### 📁 Estrutura de Ficheiros

```
/i18n/
  request.ts          # Configuração next-intl

/messages/
  pt.json            # Traduções Português
  en.json            # Traduções Inglês

/components/
  language-selector.tsx   # Componente seletor

/app/api/user/locale/
  route.ts           # API para atualizar preferência

/app/settings/
  page.tsx           # Página com seletor integrado

middleware.ts       # Deteção automática
next.config.mjs     # Plugin next-intl
```

### 🗄️ Base de Dados

**Campo Adicionado ao User Model:**

```prisma
model User {
  locale String @default("pt") // pt | en
}
```

**Migration criada:** `20260115000330_add_user_locale`

### 🌐 Como Usar

#### 1. Em Componentes Server:

```typescript
import { getTranslations } from "next-intl/server";

const t = await getTranslations("common");
t("loading"); // "A carregar..." ou "Loading..."
```

#### 2. Em Componentes Client:

```typescript
"use client";
import { useTranslations } from "next-intl";

const t = useTranslations("nav");
t("events"); // "Eventos" ou "Events"
```

### 📝 Traduções Disponíveis

**Namespaces:**

- `common` - Textos comuns (loading, error, success, etc.)
- `nav` - Navegação
- `settings` - Página de definições
- `sports` - Nomes dos desportos
- `events` - Eventos

### 🔄 Como Adicionar Traduções

1. Adicionar em `/messages/pt.json`:

```json
{
  "newSection": {
    "title": "Novo Título",
    "description": "Nova descrição"
  }
}
```

2. Adicionar em `/messages/en.json`:

```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

3. Usar no código:

```typescript
const t = useTranslations('newSection');
<h1>{t('title')}</h1>
```

### ⚙️ Configuração

**Idiomas Suportados:**

- `pt` - Português (padrão)
- `en` - English

**URL Strategy:**

- `localePrefix: "never"` - Sem prefixo na URL
- Mesma URL para todos os idiomas
- Idioma detectado automaticamente

### 🧪 Testar

1. **Como Visitor:**
   - Abrir `/settings`
   - Mudar idioma
   - Cookie `NEXT_LOCALE` guardado

2. **Como User Autenticado:**
   - Login
   - Ir a `/settings`
   - Mudar idioma
   - Preferência guardada na BD

3. **Deteção Automática:**
   - Mudar idioma do browser
   - Visitar site
   - Deve detetar idioma automaticamente

### 📦 Dependências

```json
{
  "next-intl": "4.7.0"
}
```

### 🚀 Próximos Passos

1. Adicionar mais traduções conforme necessário
2. Traduzir páginas existentes
3. Adicionar mais idiomas (es, fr, de, etc.)
4. Traduzir conteúdo dinâmico (eventos, descrições)

---

**Status:** ✅ Funcional e pronto para uso!
