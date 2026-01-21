# Seeds - Eventos por Mês

Estrutura organizada por mês do evento para facilitar a gestão dos ficheiros de seed.

## Estrutura das Pastas

- **01-janeiro/** - 19 eventos
- **02-fevereiro/** - 11 eventos
- **03-marco/** - 5 eventos
- **04-abril/** - 7 eventos
- **05-maio/** - 4 eventos
- **06-junho/** - 2 eventos
- **07-julho/** - 4 eventos
- **08-agosto/** - (vazio)
- **09-setembro/** - 2 eventos
- **10-outubro/** - 3 eventos
- **11-novembro/** - 3 eventos
- **12-dezembro/** - (vazio)

## Como usar

Para executar todos os seeds de um mês específico:

```bash
# Exemplo: Janeiro
npx tsx prisma/seeds/01-janeiro/linhas-torres-100-2026.ts
```

## Convenções

- Cada ficheiro representa um evento específico
- Os ficheiros estão organizados pelo **mês do evento**, não pelo mês de criação
- Usar o formato: `nome-evento-2026.ts` ou `seed-nome-evento.ts`
