# Seeds - Eventos por País

Estrutura organizada por país do evento para facilitar a gestão dos ficheiros de seed.

## Estrutura das Pastas

### 🌍 Distribuição por País

- 🇵🇹 **portugal/** - 51 eventos
- 🇪🇸 **espanha/** - 6 eventos
- 🇫🇷 **franca/** - 3 eventos
- 🇺🇸 **eua/** - 4 eventos
- 🇬🇧 **reino-unido/** - 1 evento
- 🇩🇪 **alemanha/** - 1 evento
- 🇮🇹 **italia/** - 1 evento

**Total:** 67 eventos em 7 países

## Como usar

Para executar um seed específico:

```bash
# Exemplo: Evento em Portugal
npx tsx prisma/seeds/portugal/linhas-torres-100-2026.ts

# Exemplo: Evento nos EUA
npx tsx prisma/seeds/eua/leadville-trail-100-2026.ts
```

## Convenções

- Cada ficheiro representa um evento específico
- Os ficheiros estão organizados pelo **país do evento**
- Formato dos nomes: `nome-evento-2026.ts` ou `seed-nome-evento.ts`
- Todos os seeds seguem o padrão idempotente (safe to re-run)
- Cada seed inclui traduções em 6 idiomas (pt, en, es, fr, de, it)
- SEO metadata completo para todos os eventos
