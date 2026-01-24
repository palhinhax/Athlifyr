# Refatoração da Página Admin Venues

## Motivação

O ficheiro original `page.tsx` tinha **883 linhas**, tornando-o difícil de manter e navegar.

## Estrutura Modular

A página foi dividida em **4 componentes reutilizáveis** + **1 página principal**:

### 📦 Componentes Criados

#### 1. `admin-venue-card.tsx` (~165 linhas)

**Responsabilidade**: Exibir um card individual de venue

**Props**:

- `venue`: Dados do venue
- `onOpenFeeDialog`: Callback para abrir modal de fees
- `onOpenOwnerDialog`: Callback para abrir modal de owner
- `onDelete`: Callback para eliminar venue

**Funcionalidades**:

- Display de informações do venue
- Botões de ação (Fees, Owner, Editar, Eliminar)
- Display visual das comissões atuais
- Localização com coordenadas

---

#### 2. `admin-venue-create-dialog.tsx` (~310 linhas)

**Responsabilidade**: Modal para criar novos venues

**Props**:

- `open`: Estado do modal
- `onOpenChange`: Callback para controlar abertura/fecho
- `onSuccess`: Callback executado após criação bem-sucedida

**Funcionalidades**:

- Formulário completo de criação
- Geração automática de slug
- Validação de campos obrigatórios
- Gestão de estado do formulário
- Reset automático após criação

---

#### 3. `admin-venue-owner-dialog.tsx` (~220 linhas)

**Responsabilidade**: Modal para definir owner do venue

**Props**:

- `open`: Estado do modal
- `onOpenChange`: Callback para controlar abertura/fecho
- `venue`: Venue selecionado
- `onSuccess`: Callback executado após definir owner

**Funcionalidades**:

- Pesquisa de utilizadores (mínimo 2 caracteres)
- Lista de resultados com avatares
- Seleção de utilizador para owner
- Loading states e error handling

---

#### 4. `admin-venue-fee-dialog.tsx` (~185 linhas)

**Responsabilidade**: Modal para gerir comissões do venue

**Props**:

- `open`: Estado do modal
- `onOpenChange`: Callback para controlar abertura/fecho
- `venue`: Venue selecionado
- `onSuccess`: Callback executado após atualizar fees

**Funcionalidades**:

- Seleção de tipo de comissão (Percentagem / Fixo)
- Input para valor da comissão
- Explicações contextuais
- Validação e conversão de valores
- Auto-populate com valores atuais

---

#### 5. `page-new.tsx` (~195 linhas) - Página Principal

**Responsabilidade**: Composição e orquestração

**Funcionalidades**:

- Autenticação e autorização (apenas ADMIN)
- Fetching de venues
- Gestão de estado dos modais
- Coordenação entre componentes
- Layout e navegação

---

## 📊 Comparação

| Métrica                            | Antes      | Depois                           |
| ---------------------------------- | ---------- | -------------------------------- |
| **Linhas totais**                  | 883        | 195 (página) + 880 (componentes) |
| **Ficheiros**                      | 1          | 5                                |
| **Responsabilidades por ficheiro** | Múltiplas  | Uma única                        |
| **Reutilização**                   | Impossível | Total                            |
| **Testabilidade**                  | Difícil    | Fácil                            |
| **Manutenibilidade**               | ⚠️ Baixa   | ✅ Alta                          |

---

## 🔄 Como Migrar

### Opção 1: Substituição direta (RECOMENDADO)

```bash
# Backup do ficheiro antigo
mv page.tsx page.old.tsx

# Renomear o novo
mv page-new.tsx page.tsx
```

### Opção 2: Testar paralelamente

Manter ambos os ficheiros e testar `page-new.tsx` antes de substituir.

---

## ✅ Benefícios

1. **Modularidade**: Cada componente tem uma responsabilidade única
2. **Reutilização**: Componentes podem ser usados noutras páginas admin
3. **Testabilidade**: Mais fácil escrever testes unitários
4. **Legibilidade**: Código mais limpo e organizado
5. **Manutenção**: Alterações isoladas não afetam todo o sistema
6. **Performance**: Possibilidade de lazy loading de componentes

---

## 📁 Estrutura de Pastas

```
app/[locale]/admin/venues/
  ├── page.tsx (antigo - 883 linhas) ❌
  ├── page-new.tsx (novo - 195 linhas) ✅
  └── layout.tsx

components/admin/
  ├── admin-venue-card.tsx
  ├── admin-venue-create-dialog.tsx
  ├── admin-venue-owner-dialog.tsx
  └── admin-venue-fee-dialog.tsx
```

---

## 🚀 Próximos Passos

1. ✅ Criar componentes modulares
2. ✅ Criar página principal simplificada
3. ⏳ Testar funcionalidades
4. ⏳ Substituir `page.tsx` por `page-new.tsx`
5. ⏳ Eliminar ficheiro antigo
6. ⏳ Adicionar testes unitários aos componentes

---

## 🛠️ Manutenção Futura

Para adicionar novas funcionalidades:

1. Criar novo componente em `components/admin/`
2. Importar e usar na página principal
3. Manter componentes < 300 linhas
4. Uma responsabilidade por componente
