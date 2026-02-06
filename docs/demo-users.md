# Demo Users - CrossBox Açor

Este documento descreve os utilizadores criados para a demo da CrossBox Açor.

## 🔐 Credenciais

**Password para todos os utilizadores:** `Test123!`

---

## 👑 Admin da Plataforma

| Email                | Nome     | Role      | Descrição                                                                                          |
| -------------------- | -------- | --------- | -------------------------------------------------------------------------------------------------- |
| `hello@athlifyr.com` | Athlifyr | **ADMIN** | Administrador da plataforma Athlifyr. Tem acesso total a todas as funcionalidades administrativas. |

---

## 🏋️ Staff CrossBox Açor

### Owner (Proprietário)

| Email           | Nome        | Boxes          | Descrição                                                                              |
| --------------- | ----------- | -------------- | -------------------------------------------------------------------------------------- |
| `tiago@acor.pt` | Tiago Amaro | Seia + Arganil | Proprietário das duas boxes CrossBox Açor. Tem permissões de OWNER em ambas as venues. |

### Coaches (Treinadores)

| Email            | Nome          | Boxes          | Descrição                                    |
| ---------------- | ------------- | -------------- | -------------------------------------------- |
| `duarte@acor.pt` | Duarte Covas  | Seia + Arganil | Coach sénior que trabalha em ambas as boxes. |
| `diego@acor.pt`  | Diego Cardoso | Seia           | Coach exclusivo da box de Seia.              |
| `pedro@acor.pt`  | Pedro Gouveia | Arganil        | Coach exclusivo da box de Arganil.           |

---

## 🏃 Atletas / Clientes

| Email              | Nome              | Modalidades     | Notas |
| ------------------ | ----------------- | --------------- | ----- |
| `ana@acor.pt`      | Ana Ferreira      | CrossFit        |       |
| `bruno@acor.pt`    | Bruno Costa       | CrossFit, HYROX |       |
| `carla@acor.pt`    | Carla Mendes      | HYROX           |       |
| `daniel@acor.pt`   | Daniel Rodrigues  | CrossFit        |       |
| `eva@acor.pt`      | Eva Santos        | CrossFit, HYROX |       |
| `filipe@acor.pt`   | Filipe Martins    | CrossFit        |       |
| `gabriela@acor.pt` | Gabriela Oliveira | HYROX           |       |
| `hugo@acor.pt`     | Hugo Almeida      | CrossFit, HYROX |       |
| `ines@acor.pt`     | Inês Pereira      | CrossFit        |       |
| `joao@acor.pt`     | João Nunes        | CrossFit, HYROX |       |

---

## 🏢 Venues Criadas

### CrossBox Açor - Seia

- **Slug:** `crossbox-acor-seia`
- **Morada:** R. Dr. Gaspar Rebelo, 6270-436 Seia
- **Coordenadas:** 40.4128, -7.7112
- **Distrito:** Guarda

### CrossBox Açor - Arganil

- **Slug:** `crossbox-acor-arganil`
- **Morada:** Rua Cidade Rio de Janeiro, 3300-145 Arganil
- **Coordenadas:** 40.2188, -8.0627
- **Distrito:** Coimbra

---

## 🔗 Links Úteis

- **Website:** http://crossboxacor.pt/
- **Instagram:** [@crossboxacor](https://instagram.com/crossboxacor)
- **Certificação:** HYROX Official Training Center

---

## 📝 Como Executar os Seeds

```bash
# 1. Criar os utilizadores
npx tsx prisma/seeds/venues/portugal/crossbox-acor-users.ts

# 2. Criar a venue de Seia
npx tsx prisma/seeds/venues/portugal/guarda/crossbox-acor-seia.ts

# 3. Criar a venue de Arganil
npx tsx prisma/seeds/venues/portugal/coimbra/crossbox-acor-arganil.ts
```

---

## 📊 Resumo

| Tipo            | Quantidade |
| --------------- | ---------- |
| Admin           | 1          |
| Owner           | 1          |
| Coaches         | 3          |
| Atletas         | 10         |
| **Total Users** | **15**     |
| Venues          | 2          |
