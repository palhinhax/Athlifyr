# 📋 Release Notes

This folder contains the release notes for the Athlifyr application in a simple, human-readable format designed for easy copy/paste by non-technical team members.

## 📁 File

- **`release-notes.txt`** — All release notes, organized by version (newest first)

## 📐 Format Structure

Each version block follows this exact structure:

```
====================
VERSION: x.x.x
DATE: YYYY-MM-DD

<pt>
texto em português
</pt>

<en>
english text
</en>

<es>
texto español
</es>

<fr>
texte français
</fr>

<de>
deutscher text
</de>

<it>
testo italiano
</it>
```

## ✅ Formatting Rules

1. **Separator**: Use `====================` between version blocks
2. **Version line**: `VERSION: x.x.x` (semantic versioning)
3. **Date line**: `DATE: YYYY-MM-DD` (ISO format)
4. **Blank line** between the date and the first language tag
5. **Language tags**: Always lowercase (`<pt>`, `<en>`, etc.)
6. **No indentation** on language tags — they must start at column 0
7. **All 6 languages** must always be present, even if the content is empty
8. **Bullet points**: Use `- ` (dash + space) for each item
9. **Newest version first**: Add new versions at the **top** of the file

## 🌍 Supported Languages

| Tag    | Language              | Locale |
| ------ | --------------------- | ------ |
| `<pt>` | Portuguese (European) | pt-PT  |
| `<en>` | English               | en-US  |
| `<es>` | Spanish               | es-ES  |
| `<fr>` | French                | fr-FR  |
| `<de>` | German                | de-DE  |
| `<it>` | Italian               | it-IT  |

> ⚠️ **Portuguese must always be European Portuguese (pt-PT)**, never Brazilian Portuguese.

## 📝 How to Add a New Version

1. Open `release-notes.txt`
2. Add a new block **at the top** of the file (before the existing versions)
3. Copy the template below and fill in the content:

```
====================
VERSION: x.x.x
DATE: YYYY-MM-DD

<pt>
- Descrição da funcionalidade ou correção
</pt>

<en>
- Feature or fix description
</en>

<es>
- Descripción de la funcionalidad o corrección
</es>

<fr>
- Description de la fonctionnalité ou correction
</fr>

<de>
- Beschreibung der Funktion oder Korrektur
</de>

<it>
- Descrizione della funzionalità o correzione
</it>
```

4. Replace `x.x.x` with the actual version number
5. Replace `YYYY-MM-DD` with the release date
6. Fill in the notes for **all 6 languages**
7. Save the file

## 💡 Example: Multiple Versions

```
====================
VERSION: 1.3.0
DATE: 2026-02-25

<pt>
- Adicionado sistema de chat em tempo real
- Melhorias de desempenho no carregamento de eventos
</pt>

<en>
- Added real-time chat system
- Performance improvements on event loading
</en>

<es>
- Añadido sistema de chat en tiempo real
- Mejoras de rendimiento en la carga de eventos
</es>

<fr>
- Ajout du système de chat en temps réel
- Améliorations des performances de chargement des événements
</fr>

<de>
- Echtzeit-Chat-System hinzugefügt
- Leistungsverbesserungen beim Laden von Veranstaltungen
</de>

<it>
- Aggiunto sistema di chat in tempo reale
- Miglioramenti delle prestazioni nel caricamento degli eventi
</it>

====================
VERSION: 1.2.0
DATE: 2026-02-10

<pt>
- Correção do feedback de login com password errada
- Novo ecrã de definições do perfil
</pt>

<en>
- Fixed login feedback for wrong password
- New profile settings screen
</en>

<es>
- Corrección del feedback de inicio de sesión con contraseña incorrecta
- Nueva pantalla de configuración del perfil
</es>

<fr>
- Correction du retour d'information de connexion avec mot de passe incorrect
- Nouvel écran de paramètres du profil
</fr>

<de>
- Korrektur des Login-Feedbacks bei falschem Passwort
- Neuer Profileinstellungen-Bildschirm
</de>

<it>
- Correzione del feedback di login con password errata
- Nuova schermata delle impostazioni del profilo
</it>
```

## 🎯 Usage

To copy release notes for a specific language (e.g., for the App Store):

1. Open `release-notes.txt`
2. Find the version you need
3. Locate the language tag (e.g., `<pt>`)
4. Copy the text **between** the opening and closing tags
5. Paste into the store listing or marketing material

No tools, no JSON parsing — just plain text copy/paste.
