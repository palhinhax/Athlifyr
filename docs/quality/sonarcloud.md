# SonarCloud — Análise Estática de Qualidade

## O que é e porque usamos

[SonarCloud](https://sonarcloud.io) é uma plataforma de análise estática de código alojada na nuvem. Integrado com o GitHub, analisa automaticamente o código em cada **pull request** e **push** para branches principais, reportando:

- **Bugs** — erros que podem causar comportamentos inesperados em runtime
- **Vulnerabilidades** — potenciais problemas de segurança
- **Code Smells** — más práticas que dificultam a manutenção
- **Duplicações** — código repetido que deve ser refatorado
- **Cobertura de testes** — percentagem de código coberta por testes automatizados

O objetivo é garantir que o código que entra no `main` mantém sempre um padrão elevado de qualidade — **Quality Gate obrigatório** para fusão de PRs.

---

## Arquitetura da Integração

```
Pull Request / Push
       │
       ▼
GitHub Actions (.github/workflows/sonar.yml)
       │
       ├─ Checkout (fetch-depth: 0)
       ├─ Install deps (pnpm)
       ├─ Prisma generate
       ├─ Jest --coverage → coverage/lcov.info
       └─ SonarCloud Scan (sonar-project.properties)
              │
              ▼
       SonarCloud Dashboard
              │
              ▼
       Quality Gate (pass/fail)
              │
              ▼
       PR Status Check ✅ / ❌
```

---

## Configuração Inicial

### 1. Criar Projeto no SonarCloud

1. Acede a [sonarcloud.io](https://sonarcloud.io) e faz login com a conta GitHub da organização.
2. Clica em **"+"** → **"Analyze new project"**.
3. Seleciona a organização **GAIA-TECHNOLOGY** e o repositório **Athlifyr**.
4. Escolhe o plano de análise **Automatic** (GitHub Actions).
5. Anota:
   - **Organization key**: geralmente `gaia-technology` (confirmar na URL do dashboard)
   - **Project key**: geralmente `GAIA-TECHNOLOGY_Athlifyr` (confirmar nas definições do projeto)
   - **Token**: gerado em *My Account → Security → Generate Token*

### 2. Configurar GitHub Secrets

No repositório GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|-------|
| `SONAR_TOKEN` | Token gerado no SonarCloud (passo anterior) |
| `SONAR_ORG` | Organization key do SonarCloud (ex: `gaia-technology`) |
| `SONAR_PROJECT_KEY` | Project key do SonarCloud (ex: `GAIA-TECHNOLOGY_Athlifyr`) |

> ⚠️ **Nunca** commites o token ou qualquer secret no repositório.

### 3. Atualizar `sonar-project.properties`

O ficheiro `sonar-project.properties` na raiz do repositório usa variáveis de ambiente para `sonar.organization` e `sonar.projectKey`. Estas são injetadas automaticamente pelo workflow via `SONAR_ORG` e `SONAR_PROJECT_KEY`.

Se precisares de ajustar os paths de sources ou exclusões, edita o ficheiro diretamente.

---

## Como Ver os Resultados

### No SonarCloud Dashboard

Acede a: `https://sonarcloud.io/project/overview?id=<SONAR_PROJECT_KEY>`

- **Overview**: resumo do estado actual
- **Issues**: lista de bugs, vulnerabilidades e code smells
- **Security Hotspots**: pontos que requerem revisão de segurança
- **Measures**: métricas detalhadas (cobertura, duplicações, complexidade)
- **Code**: navegação no código com anotações inline
- **Activity**: histórico de análises

### Nos Pull Requests

O SonarCloud decora automaticamente cada PR com:
- Um **status check** ("SonarCloud Code Analysis") — pass ✅ ou fail ❌
- Um **comentário** com o resumo das issues introduzidas no novo código
- Links diretos para cada issue no dashboard

---

## Quality Gate

O Quality Gate define os critérios mínimos que o **novo código** deve cumprir para passar.

### Métricas Recomendadas (New Code)

| Métrica | Limiar |
|---------|--------|
| Coverage on New Code | ≥ 60% |
| Duplications on New Code | ≤ 3% |
| Reliability Rating | A |
| Security Rating | A |
| Maintainability Rating | A |
| New Issues | 0 bugs, 0 vulnerabilities |

### Configurar Quality Gate no SonarCloud

1. Acede ao projeto → **Quality Gates**
2. Cria ou edita um Quality Gate personalizado
3. Define as condições acima (ou ajusta conforme necessário)
4. Associa o Quality Gate ao projeto em **Project Settings → Quality Gate**

### Bloquear PRs que Falham o Quality Gate

1. No SonarCloud: **Project Settings → General Settings → Pull Request Decoration** → ativa
2. No GitHub: **Settings → Branches → Branch protection rules** → adiciona `SonarCloud Code Analysis` como **required status check**

---

## New Code Definition

Por defeito, o SonarCloud analisa o "new code" com base nos últimos 30 dias. Para alterar:

1. **Project Settings → New Code** no SonarCloud
2. Opções:
   - **Previous version**: compara com a última versão (tag)
   - **Number of days**: ex. últimos 30 dias
   - **Specific date**: a partir de uma data fixa
   - **Reference branch**: compara com o `main`

---

## Cobertura de Testes (Coverage)

O projeto usa **Jest** para testes unitários. Para gerar o relatório LCOV:

```bash
pnpm test:coverage
```

O relatório é gerado em `coverage/lcov.info` e é automaticamente lido pelo SonarCloud via a configuração em `sonar-project.properties`:

```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

> O diretório `coverage/` está no `.gitignore` — apenas o ficheiro `lcov.info` gerado em CI é usado pelo Sonar.

---

## Executar Localmente (Opcional)

É possível executar o scan localmente usando o `sonar-scanner` via Docker:

```bash
# Instalar sonar-scanner via Docker
docker run \
  --rm \
  -e SONAR_TOKEN=<SEU_TOKEN> \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.organization=<SONAR_ORG> \
  -Dsonar.projectKey=<SONAR_PROJECT_KEY> \
  -Dsonar.host.url=https://sonarcloud.io
```

Ou instalar o `sonar-scanner` globalmente:

```bash
# macOS
brew install sonar-scanner

# Executar
SONAR_TOKEN=<token> SONAR_ORG=<org> SONAR_PROJECT_KEY=<key> sonar-scanner
```

> Para análise local, substitui as variáveis de ambiente pelos valores reais do teu projeto.

---

## Troubleshooting

### O scan não encontra os sources

**Sintoma**: SonarCloud reporta "No files to analyze" ou análise vazia.

**Solução**: Verifica os paths em `sonar-project.properties`:
```properties
sonar.sources=app,components,hooks,lib,providers,types,i18n.ts,middleware.ts
```
Confirma que os diretórios existem e não estão todos excluídos por `sonar.exclusions`.

---

### A coverage não aparece no dashboard

**Sintoma**: "Coverage" aparece como N/A ou 0%.

**Causas possíveis**:
1. O step `pnpm test:coverage` falhou — verifica os logs do workflow
2. O ficheiro `coverage/lcov.info` não foi gerado
3. O path em `sonar.javascript.lcov.reportPaths` está errado

**Solução**:
```bash
# Verificar localmente
pnpm test:coverage
ls coverage/lcov.info  # deve existir
```

O step de coverage no workflow usa `continue-on-error: true` para não bloquear o scan caso os testes falhem. Se os testes falharem, a coverage não será reportada, mas o scan continua.

---

### PR Decoration não aparece (sem comentários do Sonar no PR)

**Sintoma**: O scan corre mas não há comentários ou status check no PR.

**Solução**:
1. Verifica que o `SONAR_TOKEN` tem permissões de **PR Decoration** (requer token com scope `public_repos` ou repo privado configurado)
2. No SonarCloud: **Administration → GitHub → Install GitHub App** — confirma que a GitHub App está instalada na organização
3. Verifica que o projeto no SonarCloud está em modo **CI-based analysis** (não Automatic)

---

### Quality Gate falha inesperadamente

**Sintoma**: O Quality Gate falha sem issues óbvios.

**Solução**:
1. Acede ao dashboard do projeto → **Quality Gate** → vê quais condições falharam
2. As condições aplicam-se apenas ao **new code** — código introduzido desde a baseline
3. Se a cobertura for baixa, adiciona testes ou ajusta o limiar no Quality Gate

---

### Permissões / Org no SonarCloud

**Sintoma**: "Organization not found" ou "Forbidden" durante o scan.

**Solução**:
1. Confirma que o `SONAR_TOKEN` é válido e não expirou
2. Confirma que `SONAR_ORG` corresponde ao slug da organização no SonarCloud (não o nome display)
3. Confirma que o utilizador que gerou o token tem permissão de **Execute Analysis** no projeto

---

### `fetch-depth: 0` obrigatório

O workflow usa `fetch-depth: 0` no checkout. Isto é **obrigatório** para que o SonarCloud consiga fazer blame do código e calcular corretamente o "new code". Sem este parâmetro, a análise pode ser imprecisa ou falhar.

---

## Ficheiros Relacionados

| Ficheiro | Descrição |
|----------|-----------|
| `.github/workflows/sonar.yml` | Workflow GitHub Actions para executar o scan |
| `sonar-project.properties` | Configuração do projeto SonarCloud |
| `jest.config.js` | Configuração Jest com `collectCoverageFrom` |

---

## Referências

- [SonarCloud Documentation](https://docs.sonarcloud.io)
- [SonarCloud GitHub Action](https://github.com/SonarSource/sonarqube-scan-action)
- [Configuring SonarCloud with Next.js](https://docs.sonarcloud.io/advanced-setup/languages/javascript-typescript-css/)
- [Quality Gates Documentation](https://docs.sonarcloud.io/improving/quality-gates/)
