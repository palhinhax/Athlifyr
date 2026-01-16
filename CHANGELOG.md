# [7.4.0](https://github.com/palhinhax/Athlifyr/compare/v7.3.0...v7.4.0) (2026-01-16)

### Features

- **events:** add Strava route embed support ([d43e7c2](https://github.com/palhinhax/Athlifyr/commit/d43e7c23eba76f7534cb17538b96c374bdae89f4))

# [7.3.0](https://github.com/palhinhax/Athlifyr/compare/v7.2.0...v7.3.0) (2026-01-16)

### Features

- **db:** add currency support to event pricing ([e0fa8a1](https://github.com/palhinhax/Athlifyr/commit/e0fa8a1f041315b4b739461f1acdd5f88257d6e3))

# [7.2.0](https://github.com/palhinhax/Athlifyr/compare/v7.1.0...v7.2.0) (2026-01-16)

### Bug Fixes

- **seeds:** correct expo dates for London Marathon 2026 ([8ee551d](https://github.com/palhinhax/Athlifyr/commit/8ee551dd306d67290b1daf7cce84499f4705bf04))

### Features

- **seeds:** add TCS London Marathon 2026 seed file ([40556c4](https://github.com/palhinhax/Athlifyr/commit/40556c423196739467586438b8d99d8bb0391475))

# [7.1.0](https://github.com/palhinhax/Athlifyr/compare/v7.0.0...v7.1.0) (2026-01-16)

### Features

- **events:** add triathlon segment support with UI and translations ([abdfa60](https://github.com/palhinhax/Athlifyr/commit/abdfa60ffa27f0c63785f4e175b296394dcab272))
- **maintenance:** add maintenance mode with dedicated page and scripts ([7a09b47](https://github.com/palhinhax/Athlifyr/commit/7a09b47a357663d156db3fea8c33d14eba6eff5b))

# [7.0.0](https://github.com/palhinhax/Athlifyr/compare/v6.12.1...v7.0.0) (2026-01-16)

- refactor(seed)!: move to seeds directory with full idempotency and translations ([13116d9](https://github.com/palhinhax/Athlifyr/commit/13116d909ae8a26fe57e40942becb47c7971f766))

### Bug Fixes

- **seed:** correct pricing phase dates in description ([06d081b](https://github.com/palhinhax/Athlifyr/commit/06d081ba27e8d5ab62791f72be4e0ac3c85417c4))

### Features

- **seed:** add trail santa iria 2026 event seed ([4738aff](https://github.com/palhinhax/Athlifyr/commit/4738aff8c81166ffcf93b6eee9c9484cd54b0538))
- **seeds:** add BMW Berlin Marathon 2026 seed file ([b17e99b](https://github.com/palhinhax/Athlifyr/commit/b17e99b04c21dbe49ea47065128474ba8dc40dfb))

### BREAKING CHANGES

- Seed file relocated from prisma/seed-trail-santa-iria.ts to prisma/seeds/trail-santa-iria-2026.ts

* Move seed file to prisma/seeds/ directory (proper location)
* Remove nested create operations for full idempotency
* Use separate upsert operations for event, translations, variants, and pricing phases
* Add translations for all 6 supported languages (pt, en, es, fr, de, it)
* Add imageUrl field set to empty string
* Add variant translations for all languages
* Safe for execution on shared database environments

Co-authored-by: palhinhax <13228131+palhinhax@users.noreply.github.com>

## [6.12.1](https://github.com/palhinhax/Athlifyr/compare/v6.12.0...v6.12.1) (2026-01-16)

### Bug Fixes

- **i18n:** correct translation key namespaces in photo gallery component ([b499cf2](https://github.com/palhinhax/Athlifyr/commit/b499cf2a2971acfd7664440317fb369350309fa9))
- **i18n:** fix locale params handling in pages ([dff7683](https://github.com/palhinhax/Athlifyr/commit/dff768303cc4aaf64a86e838a0368476214633cf))

# [6.12.0](https://github.com/palhinhax/Athlifyr/compare/v6.11.0...v6.12.0) (2026-01-16)

### Features

- **seo:** add validFrom and performer to SportsEvent schema ([1f97d5b](https://github.com/palhinhax/Athlifyr/commit/1f97d5b249ccaed0503e6880db294dce1617d902))

# [6.11.0](https://github.com/palhinhax/Athlifyr/compare/v6.10.0...v6.11.0) (2026-01-16)

### Bug Fixes

- **seed:** correct Google Maps URL and German translation ([a6ab288](https://github.com/palhinhax/Athlifyr/commit/a6ab28864c24d001ef1e2fad8d5d686d015c9885))

### Features

- **seed:** add VII Trilhos de Viana 2026 event seed file ([533f26f](https://github.com/palhinhax/Athlifyr/commit/533f26f151954470655db807d2c0ae0a4ab8e4b6))
- **seed:** enhance descriptions with Markdown formatting and emojis ([4b66280](https://github.com/palhinhax/Athlifyr/commit/4b66280bfca79ed5d2e4094b854f56072cc2d3a0))

# [6.10.0](https://github.com/palhinhax/Athlifyr/compare/v6.9.1...v6.10.0) (2026-01-16)

### Bug Fixes

- **seed:** update Google Maps URL for Trail do Rio Paiva ([d3f4e48](https://github.com/palhinhax/Athlifyr/commit/d3f4e48bbbb9b626effcb5d4627c52fc6cd08902))
- **seed:** update pricing phases with correct 3-phase structure ([8a482a1](https://github.com/palhinhax/Athlifyr/commit/8a482a1c51a3ad8940b48636e00018d546543252))

### Features

- **seed:** create VII Trail do Rio Paiva 2026 seed file ([8bc4dea](https://github.com/palhinhax/Athlifyr/commit/8bc4dea10506e23fdb579dd61af53b87661fea1f))

## [6.9.1](https://github.com/palhinhax/Athlifyr/compare/v6.9.0...v6.9.1) (2026-01-16)

### Bug Fixes

- **i18n:** add missing events.filters.resultsCount translation key ([93d80e9](https://github.com/palhinhax/Athlifyr/commit/93d80e97b081557ec652d2903467d742963e4e7d))

# [6.9.0](https://github.com/palhinhax/Athlifyr/compare/v6.8.0...v6.9.0) (2026-01-15)

### Bug Fixes

- **agents:** clarify integer vs float types in event seed generator ([d7d1d34](https://github.com/palhinhax/Athlifyr/commit/d7d1d3495b002d2651d344057623a7481f999e33))
- **agents:** harden seed generator with no-nested-creates and manual-only execution ([1d41337](https://github.com/palhinhax/Athlifyr/commit/1d413378f92a07386a59f0d29ed158f4f217acb9))

### Features

- **agents:** add event seed generator specialized agent ([ef6c4e4](https://github.com/palhinhax/Athlifyr/commit/ef6c4e429340b2daa59bc979ebc8d2ec09c1806e))
- **agents:** add manual seed workflow and idempotent seed requirements ([d7024d5](https://github.com/palhinhax/Athlifyr/commit/d7024d52a4ba31d6a2eb8b1c106a7ac90a064f56))

# [6.8.0](https://github.com/palhinhax/Athlifyr/compare/v6.7.0...v6.8.0) (2026-01-15)

### Features

- **ui:** reposition map button next to filters on events page ([6a4a0dc](https://github.com/palhinhax/Athlifyr/commit/6a4a0dc64f15f29857291a7f63b6b138fe69dfed))

# [6.7.0](https://github.com/palhinhax/Athlifyr/compare/v6.6.0...v6.7.0) (2026-01-15)

### Features

- **ui:** standardize brand slogan capitalization and improve 404 page ([2d4719e](https://github.com/palhinhax/Athlifyr/commit/2d4719e51f3c723838eff2a39c2674d7405fb31a))

# [6.6.0](https://github.com/palhinhax/Athlifyr/compare/v6.5.0...v6.6.0) (2026-01-15)

### Features

- **ui:** add random background video to 404 page ([13d8e98](https://github.com/palhinhax/Athlifyr/commit/13d8e985281be6b66d1fe44486df0f7869476ba2))

# [6.5.0](https://github.com/palhinhax/Athlifyr/compare/v6.4.1...v6.5.0) (2026-01-15)

### Bug Fixes

- **deps:** update pnpm-lock.yaml to resolve frozen-lockfile error on Vercel ([09e80f3](https://github.com/palhinhax/Athlifyr/commit/09e80f335ffd4967c6020c565011b3aa5f5f7a93))
- **promo:** add proper HTML structure to prevent hydration errors ([f7269bb](https://github.com/palhinhax/Athlifyr/commit/f7269bbe93081bf122e328b1045951786d0794cc)), closes [#418](https://github.com/palhinhax/Athlifyr/issues/418) [#423](https://github.com/palhinhax/Athlifyr/issues/423)
- **promo:** add video file and fix hydration error ([1d761db](https://github.com/palhinhax/Athlifyr/commit/1d761db5f71bcaa349a45ed1e73232298488913a))
- **promo:** improve type safety for feature keys with explicit type definitions ([1686e66](https://github.com/palhinhax/Athlifyr/commit/1686e66446ecbc0db95889d5339d0f8885bc024e))

### Features

- **promo:** add additional video assets with descriptive names ([27d7dd2](https://github.com/palhinhax/Athlifyr/commit/27d7dd2bfd1690ae2408dbdcb42a7310c522120d))
- **promo:** add auto-animated promo page with video background and i18n support ([1c4600d](https://github.com/palhinhax/Athlifyr/commit/1c4600d9a6690b1667ae7499cf1a4278ffed4e0e))
- **promo:** add restart button and query parameter support for customization ([5ee07e0](https://github.com/palhinhax/Athlifyr/commit/5ee07e0da38aa0e9f857e5f259f466e10eb97a54))
- **promo:** add sport-specific promo pages ([7d08654](https://github.com/palhinhax/Athlifyr/commit/7d0865495efdea069c02ea93cebec8e9b89cdf4d))
- **promo:** redesign as Nike-style video showcase ([0a92054](https://github.com/palhinhax/Athlifyr/commit/0a92054a7e2c0116b7bb3351ede1a7e9956b99ed))
- **promo:** unify all promo videos with multi-sequence format and update slogan ([c760cac](https://github.com/palhinhax/Athlifyr/commit/c760cacbc85d7db1fbae0f7e5895a8ea96f35dc4))

## [6.4.1](https://github.com/palhinhax/Athlifyr/compare/v6.4.0...v6.4.1) (2026-01-15)

### Bug Fixes

- **events:** handle participations API response structure correctly ([feac166](https://github.com/palhinhax/Athlifyr/commit/feac166ee448cce18bd3c60b58cac1dd0a667332))

# [6.4.0](https://github.com/palhinhax/Athlifyr/compare/v6.3.3...v6.4.0) (2026-01-15)

### Features

- **analytics:** add vercel analytics tracking ([bf56372](https://github.com/palhinhax/Athlifyr/commit/bf563728e753c41724905d5d2bcff3499b3349ff))
- **analytics:** add vercel speed insights tracking ([8594732](https://github.com/palhinhax/Athlifyr/commit/85947321345d79ae794c599545c4c6e3bd77a066))

## [6.3.3](https://github.com/palhinhax/Athlifyr/compare/v6.3.2...v6.3.3) (2026-01-15)

### Bug Fixes

- **events:** prevent map error on undefined sportTypes array ([48c55f1](https://github.com/palhinhax/Athlifyr/commit/48c55f13076ac2cb00ba110b06aba2448bf255d9))

## [6.3.2](https://github.com/palhinhax/Athlifyr/compare/v6.3.1...v6.3.2) (2026-01-15)

### Bug Fixes

- **map:** prevent server-side timezone detection errors ([706a1c5](https://github.com/palhinhax/Athlifyr/commit/706a1c59de6118ffc321191f5adf7597dcad2f8e))

## [6.3.1](https://github.com/palhinhax/Athlifyr/compare/v6.3.0...v6.3.1) (2026-01-15)

### Bug Fixes

- **auth:** add locale prefix to all auth navigation links ([ab21464](https://github.com/palhinhax/Athlifyr/commit/ab214641b47b4cb533ea02af28f0c0716cf90c9e))

# [6.3.0](https://github.com/palhinhax/Athlifyr/compare/v6.2.0...v6.3.0) (2026-01-15)

### Features

- **map:** auto-detect map center from device timezone ([903596b](https://github.com/palhinhax/Athlifyr/commit/903596bb9f175266a7847177866801ae09a22241))

# [6.2.0](https://github.com/palhinhax/Athlifyr/compare/v6.1.0...v6.2.0) (2026-01-15)

### Features

- **events:** detect country from device timezone instead of locale ([733e5d4](https://github.com/palhinhax/Athlifyr/commit/733e5d46f104d9193ab69f82802b6d9648abe024))

# [6.1.0](https://github.com/palhinhax/Athlifyr/compare/v6.0.1...v6.1.0) (2026-01-15)

### Features

- **events:** add country filtering based on user locale ([6eb6e53](https://github.com/palhinhax/Athlifyr/commit/6eb6e5329b23561b89f4e43318543fb444f20337))

## [6.0.1](https://github.com/palhinhax/Athlifyr/compare/v6.0.0...v6.0.1) (2026-01-15)

### Bug Fixes

- **events:** improve geolocation reliability and increase timeout ([0b49509](https://github.com/palhinhax/Athlifyr/commit/0b49509bb70196c0c2d30e2cd5d729222cd63fa2))

# [6.0.0](https://github.com/palhinhax/Athlifyr/compare/v5.0.0...v6.0.0) (2026-01-15)

### Bug Fixes

- **i18n:** translate hardcoded strings in legacy events page ([1bc72ea](https://github.com/palhinhax/Athlifyr/commit/1bc72ea0de16bd5cf7c1ccdfd05853b60bc515f0))

### Features

- **events:** add advanced filters with geolocation and distance radius ([60ca72f](https://github.com/palhinhax/Athlifyr/commit/60ca72f97cae4f7f7c4b6a40a2cd72a8dfb50164))
- **events:** add location-based filters with distance radius ([c7ff9e9](https://github.com/palhinhax/Athlifyr/commit/c7ff9e986c6dfba6974bd33e45c3a9cb94265432))
- **i18n:** add translations for home page ([7bc0948](https://github.com/palhinhax/Athlifyr/commit/7bc0948860509100180f8e715009038f2ccc9894))
- **i18n:** add translations for image upload component ([1cc73c2](https://github.com/palhinhax/Athlifyr/commit/1cc73c25c189cfe4ccbcf1b8126f67cd506bfbaa))

### BREAKING CHANGES

- **events:** Removed dateRange filter parameter from events API and preferences

# [5.1.0](https://github.com/palhinhax/Athlifyr/compare/v5.0.0...v5.1.0) (2026-01-15)

### Bug Fixes

- **i18n:** translate hardcoded strings in legacy events page ([1bc72ea](https://github.com/palhinhax/Athlifyr/commit/1bc72ea0de16bd5cf7c1ccdfd05853b60bc515f0))

### Features

- **events:** add location-based filters with distance radius ([c7ff9e9](https://github.com/palhinhax/Athlifyr/commit/c7ff9e986c6dfba6974bd33e45c3a9cb94265432))
- **i18n:** add translations for home page ([7bc0948](https://github.com/palhinhax/Athlifyr/commit/7bc0948860509100180f8e715009038f2ccc9894))
- **i18n:** add translations for image upload component ([1cc73c2](https://github.com/palhinhax/Athlifyr/commit/1cc73c25c189cfe4ccbcf1b8126f67cd506bfbaa))

# [5.1.0](https://github.com/palhinhax/Athlifyr/compare/v5.0.0...v5.1.0) (2026-01-15)

### Bug Fixes

- **i18n:** translate hardcoded strings in legacy events page ([1bc72ea](https://github.com/palhinhax/Athlifyr/commit/1bc72ea0de16bd5cf7c1ccdfd05853b60bc515f0))

### Features

- **events:** add location-based filters with distance radius ([c7ff9e9](https://github.com/palhinhax/Athlifyr/commit/c7ff9e986c6dfba6974bd33e45c3a9cb94265432))
- **i18n:** add translations for image upload component ([1cc73c2](https://github.com/palhinhax/Athlifyr/commit/1cc73c25c189cfe4ccbcf1b8126f67cd506bfbaa))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Location-based event filters with distance radius
- Geolocation support for finding nearby events
- Distance slider (10-500 km range)
- Filter persistence for anonymous users
- Global text search across events
- Complete i18n support for 6 languages (en, pt, es, fr, de, it)

---

_This changelog is automatically generated by [semantic-release](https://github.com/semantic-release/semantic-release)._
