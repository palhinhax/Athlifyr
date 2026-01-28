# [14.1.0](https://github.com/palhinhax/Athlifyr/compare/v14.0.0...v14.1.0) (2026-01-28)

### Bug Fixes

- **venues:** add Suspense boundary and dynamic rendering for join page ([df7bcf7](https://github.com/palhinhax/Athlifyr/commit/df7bcf7dcb3236e9e8c8e6483069e03aa8d7be3c))

### Features

- **venues:** add contact info to landing page ([cb76924](https://github.com/palhinhax/Athlifyr/commit/cb76924ca7ddd6226c9c3f9ecbb500cf01bde9bf))
- **venues:** add landing page to attract venues ([8b635e6](https://github.com/palhinhax/Athlifyr/commit/8b635e6c2faa952844ad96802729fc91e5d7f463))

# [14.0.0](https://github.com/palhinhax/Athlifyr/compare/v13.0.0...v14.0.0) (2026-01-28)

### Bug Fixes

- **build:** lazy initialize B2 client to prevent build-time errors ([bf40ea1](https://github.com/palhinhax/Athlifyr/commit/bf40ea10b54d595aed76f77c457e7149f5d172d9))
- **build:** resolve TypeScript errors and add missing dependencies ([f52a2f2](https://github.com/palhinhax/Athlifyr/commit/f52a2f266baa8fc0a0929b008901034e1669f299))
- **ci:** replace next lint with direct eslint command ([c90b447](https://github.com/palhinhax/Athlifyr/commit/c90b447bb732fcb867ddb64f32cf032cfa8f0d52))
- **deps:** regenerate pnpm-lock.yaml and remove package-lock.json ([3cd61f1](https://github.com/palhinhax/Athlifyr/commit/3cd61f1cab096942ab39880ec6c29d38baf8cf46))
- **i18n:** add missing sports translations import ([ca979dc](https://github.com/palhinhax/Athlifyr/commit/ca979dc7e542509c31900c89ec5e9ed5345f49fc))
- **i18n:** add sport type translations to sports namespace ([60e791d](https://github.com/palhinhax/Athlifyr/commit/60e791d3ae25eb9f091a6b031d02f1f5403c4b57))
- **i18n:** correct sports translation namespace in SportBadge component ([18586a5](https://github.com/palhinhax/Athlifyr/commit/18586a578042e8b994ee5d5708689437e61c3d65))
- **i18n:** correct sports translations in all components ([f3e244c](https://github.com/palhinhax/Athlifyr/commit/f3e244c0f608a75f4f79ce70c42d33cc9a2ecbb3))
- **i18n:** preserve locale in router.push navigation across components ([f81f111](https://github.com/palhinhax/Athlifyr/commit/f81f1115b47b976ad1b2cfaef942e04f1f340d05))
- **instagram:** correct event search interface to match API response ([52e5d0a](https://github.com/palhinhax/Athlifyr/commit/52e5d0ab076beaa6700b097706e8f2958e545879))
- replace sport type display with SportBadge component in AdminEventsPage ([9d30213](https://github.com/palhinhax/Athlifyr/commit/9d30213267297b8c9eebecf1dba4d4d8e52fac72))
- **seo:** resolve venue Soft 404 by preventing 'not found' message during client load ([7829c20](https://github.com/palhinhax/Athlifyr/commit/7829c20a973c97558cbb2aa897881fb133d47cc1))
- **test:** correct venueBooking mock to use findFirst method ([41bc509](https://github.com/palhinhax/Athlifyr/commit/41bc509f2a85e34c24b0ec68bb092082202f3201))

### Features

- add venue image management functionality ([675a022](https://github.com/palhinhax/Athlifyr/commit/675a022e031bf4402037fe0b372fcee47808719f))
- add venue visibility settings and update venue settings modal ([b623313](https://github.com/palhinhax/Athlifyr/commit/b6233138210ec19f30857576a28a488d16049940))
- **chat:** add navigation links and complete translations ([7c67c81](https://github.com/palhinhax/Athlifyr/commit/7c67c81a86b92635a06593e2d365fef23e3f9f21))
- **chat:** add socket token endpoint and migration ([48cf05c](https://github.com/palhinhax/Athlifyr/commit/48cf05cf84c9f12f8fbe3ffe3a79196c6e9abe68))
- **chat:** add user report, block, and hide conversation features ([c19f023](https://github.com/palhinhax/Athlifyr/commit/c19f02328acf3541076b80d2667a98aea6e4e1b3))
- **chat:** implement real-time 1:1 chat with Socket.IO ([a56b035](https://github.com/palhinhax/Athlifyr/commit/a56b035ee6905339daec6f0ddd59d560358f0818))
- **chat:** improve notifications and venue cards design ([a71aaac](https://github.com/palhinhax/Athlifyr/commit/a71aaac37a300909861819eec4e2b109de5ecc05))
- **chat:** replace Socket.IO with HTTP polling for Vercel compatibility ([bd5bcc9](https://github.com/palhinhax/Athlifyr/commit/bd5bcc9c213fac4be5e8da0ba105ef05a13cc6ab))
- enhance SSR content for SEO with improved accessibility and styling ([152c075](https://github.com/palhinhax/Athlifyr/commit/152c075c461e81f505452d4cd8c6c709fc99c224))
- **events:** add past participation tracking with completion time logging ([24303f0](https://github.com/palhinhax/Athlifyr/commit/24303f0a0a97109ff206ac40f41ad01de7400e4e))
- implement venue staff management components ([74a03d2](https://github.com/palhinhax/Athlifyr/commit/74a03d2e823cd752a1b5190d9455069d7bb99fff))
- **instagram:** add T11 venue promo template and venue page improvements ([1e4c644](https://github.com/palhinhax/Athlifyr/commit/1e4c6443ee8b75d6f72cf236cdb09dc0837b46da))
- **nav:** make venues visible to all users in mobile navigation ([1086300](https://github.com/palhinhax/Athlifyr/commit/108630088aa705ebd3154f3b262165c2c05ac0e9))
- **performance:** add performance tracking with HYROX, running and strength ([f2c452d](https://github.com/palhinhax/Athlifyr/commit/f2c452dc24a0f3c2b85ea9113c86d96737f34c6f))
- **performance:** separate trail from road running with elevation support ([de3245a](https://github.com/palhinhax/Athlifyr/commit/de3245a93fcfa4dfcbe6ae655ee870980b930eaf))
- **posts:** add video support for posts ([7ad4dba](https://github.com/palhinhax/Athlifyr/commit/7ad4dba8e02578f089943c90dac0d19755208ce8))
- **profile:** add ability to leave venue from professional section ([9dbdcf6](https://github.com/palhinhax/Athlifyr/commit/9dbdcf630f707e104958b668224326b99184fbd6))
- **search:** show official badge for Athlifyr account in global search ([1f56ce4](https://github.com/palhinhax/Athlifyr/commit/1f56ce4935289a2d905e31cf83ce4155372e2f7e))
- **seeds:** add 10th Trail Rota dos Espigueiros 2026 seed ([1ef9236](https://github.com/palhinhax/Athlifyr/commit/1ef92368e86daa0e26e13ccb74ddb836cef589f0))
- **seeds:** add Trail Atlânticas 2026 seed ([9880928](https://github.com/palhinhax/Athlifyr/commit/9880928999414613f3dafdeff006c321d3c5cdec))
- **seeds:** add west games 2026 event seed ([ddbb613](https://github.com/palhinhax/Athlifyr/commit/ddbb6136cb0ad0f1dba35b0667e4fab450847c30))
- **seeds:** add XI Trail Montes Saloios 2026 event seed ([815eeda](https://github.com/palhinhax/Athlifyr/commit/815eedacc1398b235828000bf526ba72b46a0b3f))
- **ui:** add collapsible sidebar navigation and fix sports translations ([00119e1](https://github.com/palhinhax/Athlifyr/commit/00119e141cc31780e4712caf924e0c4dd8966197))
- **ui:** add option to hide VS badge in split-screen Instagram template ([4a0d2b7](https://github.com/palhinhax/Athlifyr/commit/4a0d2b747490060e013399bf75ffb97513d09dae))
- **ui:** improve mobile responsiveness and add login icons ([d59954b](https://github.com/palhinhax/Athlifyr/commit/d59954ba8037f56db923da1aebdfe7b87a432d68))
- **venues:** add sessions & services settings tab with complete i18n ([68f726d](https://github.com/palhinhax/Athlifyr/commit/68f726d55c79a53649f6659a7109a1ebdd10bcd0))
- **venues:** add Stripe Connect payments and modularize admin venues page ([e5048df](https://github.com/palhinhax/Athlifyr/commit/e5048dfd28518ec27af131679dea2e7657e75376))

### BREAKING CHANGES

- **performance:** None - existing RUN entries remain unchanged, only new trail
  events will be classified as TRAIL type.
- **chat:** Socket.IO is no longer used. The custom server.ts
  is removed - use standard 'next start' for production.
- **events:** completionTime field changed from String to Int.
  All existing completion times will be lost during migration.
- **venues:** VenuePlan.paymentProvider field removed. Payment processing now managed at venue level via Venue.paymentMode (IN_APP, EXTERNAL, MIXED).

* Add Stripe Connect onboarding and payment processing for venues
* Create database migration for guest bookings support
* Add Stripe webhook handling for account updates
* Implement venue commission system (PERCENT/FIXED types)
* Add fee management API endpoint and UI dialog (admin only)
* Refactor admin venues page into 5 modular components
* Create venue cards, dialogs for create/owner/fees management
* Add 2 new event seeds: Trail do Vale + Tribal Clash Portugal
* Fix translation structure: move weather inside events namespace
* Fix unused variable ESLint error in image-upload component

New Stripe features:
Venue owner Stripe Connect onboarding
Platform commission configuration per venue
Automated payment splitting
Webhook sync for account status

New admin features:
Fee management modal for venue commissions
Owner assignment dialog with user search
Modular component architecture (195 vs 883 lines)

Database changes:
Guest booking support (userId optional)
PaymentsProvider enum (NONE, STRIPE)
StripeOnboardingStatus tracking
Commission fields (commissionType, commissionValue)
StripeWebhookEvent tracking table

Event seeds:
Trail do Vale 2026 (Tomar, 17 May)
Tribal Clash Portugal 2026 (Vilamoura, 2-3 May)
Complete translations for all 6 languages
SEO metadata with metaTitle/metaDescription
FAQs in all languages

Code quality:
pnpm format passed
ESLint passed (2 warnings only - <img> tags)
TypeScript typecheck passed
All changes follow conventional commits
Documentation created for refactoring

# [13.0.0](https://github.com/palhinhax/Athlifyr/compare/v12.10.0...v13.0.0) (2026-01-23)

### Bug Fixes

- **seo:** replace 308 with 301 redirects and add complete hreflang support ([a329d6d](https://github.com/palhinhax/Athlifyr/commit/a329d6d515df796bb78f02fcb967d01aa2677d2b))

### BREAKING CHANGES

- **seo:** None - improves SEO without breaking existing functionality

# [12.10.0](https://github.com/palhinhax/Athlifyr/compare/v12.9.0...v12.10.0) (2026-01-23)

### Bug Fixes

- correct contact email to hello@athlifyr.com across all files ([5dfefa7](https://github.com/palhinhax/Athlifyr/commit/5dfefa7265f4151f309e86ab267e5b6ba3af84bb))
- **i18n:** add translations for contact page ([78ba78d](https://github.com/palhinhax/Athlifyr/commit/78ba78d422e791083632b7d4b88202693c109742))
- **i18n:** add translations for contacts admin page ([3075647](https://github.com/palhinhax/Athlifyr/commit/3075647ec6b8349284ecef3c47fe9d21f2ecd3e1))
- **seo:** normalize URLs with www subdomain and locale prefix ([53a5a30](https://github.com/palhinhax/Athlifyr/commit/53a5a3099c8c8ff267a0da8fc67c2b87b4f5fb50))
- **seo:** replace all next/link with next-intl Link for proper locale prefix ([8d8d249](https://github.com/palhinhax/Athlifyr/commit/8d8d249b6aef83584ebadd420090c3723eaa8552))
- **seo:** update locale links in NotFound component for proper routing ([c0e3301](https://github.com/palhinhax/Athlifyr/commit/c0e3301c9cf9547f01696847864edda9e19fdf63))

### Features

- **testing:** add comprehensive test users system with E2E automation ([955b232](https://github.com/palhinhax/Athlifyr/commit/955b232a1af5cf2c08e489dceb4ed2ea34505b8f))

# [12.9.0](https://github.com/palhinhax/Athlifyr/compare/v12.8.0...v12.9.0) (2026-01-23)

### Features

- **venues:** restrict team tab to admin/owner only ([aec3c5d](https://github.com/palhinhax/Athlifyr/commit/aec3c5dbf7d1e9273a3b037c30a70566c31f114f))

# [12.8.0](https://github.com/palhinhax/Athlifyr/compare/v12.7.0...v12.8.0) (2026-01-23)

### Features

- **venues:** integrate subscribers into team tab ([7bb1824](https://github.com/palhinhax/Athlifyr/commit/7bb1824d9a7b94d9add8e4d5d9515d28a70fbb47))

# [12.7.0](https://github.com/palhinhax/Athlifyr/compare/v12.6.0...v12.7.0) (2026-01-23)

### Features

- **venues:** add icons to tabs for mobile view ([c3313d9](https://github.com/palhinhax/Athlifyr/commit/c3313d9685332f1f408b948a5d026f50764ace14))

# [12.6.0](https://github.com/palhinhax/Athlifyr/compare/v12.5.1...v12.6.0) (2026-01-23)

### Features

- **venues:** add public reviews with admin reply functionality ([793b0ff](https://github.com/palhinhax/Athlifyr/commit/793b0ff2147b30df6b95d7079f16de972a9bbbba))

## [12.5.1](https://github.com/palhinhax/Athlifyr/compare/v12.5.0...v12.5.1) (2026-01-23)

### Bug Fixes

- **venues:** fix reviews modal trigger and remove reviews tab ([acdda47](https://github.com/palhinhax/Athlifyr/commit/acdda47116fa96a827f74b90bacd46a781705c0d))

# [12.5.0](https://github.com/palhinhax/Athlifyr/compare/v12.4.0...v12.5.0) (2026-01-23)

### Bug Fixes

- **prisma:** add connection pooling for serverless ([12aec60](https://github.com/palhinhax/Athlifyr/commit/12aec602c876702ec4bc3f43a79502bf260ad2e9))

### Features

- **venues:** redesign header with reviews modal ([a3d0482](https://github.com/palhinhax/Athlifyr/commit/a3d0482ed698099546deef154891ff1b2a2d5986))

# [12.4.0](https://github.com/palhinhax/Athlifyr/compare/v12.3.0...v12.4.0) (2026-01-23)

### Features

- **venues:** add reviews system ([a7b94f6](https://github.com/palhinhax/Athlifyr/commit/a7b94f6c098db8fa200b28041ed1b08d2a978734))

# [12.3.0](https://github.com/palhinhax/Athlifyr/compare/v12.2.0...v12.3.0) (2026-01-23)

### Bug Fixes

- **events:** correct sportTypes field in event update API ([6c421bd](https://github.com/palhinhax/Athlifyr/commit/6c421bd7e73a4f153c63c810844fc379d6087ed0))
- **venues:** rename venueId parameter to id in likes API route ([1c91e89](https://github.com/palhinhax/Athlifyr/commit/1c91e897d18000c09d11c9a19588b03dd50c64b7))

### Features

- **venues:** add recommendation system ([3df6b98](https://github.com/palhinhax/Athlifyr/commit/3df6b9868c943d402bccb35f3ee8638f72990d39))

# [12.2.0](https://github.com/palhinhax/Athlifyr/compare/v12.1.0...v12.2.0) (2026-01-23)

### Bug Fixes

- **venues:** resolve image upload conflicts by adding unique component IDs ([338452d](https://github.com/palhinhax/Athlifyr/commit/338452d7d6c67b455cc0c87a0e190660814e6c15))

### Features

- add seed script for TCS New York City Marathon 2026 with multilingual support and event details ([e6452e7](https://github.com/palhinhax/Athlifyr/commit/e6452e75bc8605678126abe0758cb28b6147ad95))
- add venue sessions calendar component with session management features ([356e853](https://github.com/palhinhax/Athlifyr/commit/356e85397512f159e5b8ac17fbb5404081c5c270))
- **seo:** enhance Organization schema for Google Search logo visibility ([42f989a](https://github.com/palhinhax/Athlifyr/commit/42f989a7933f11a201175bbd73b9aa5d6eb76e49))
- **seo:** improve event pages for Google indexing ([ef39e09](https://github.com/palhinhax/Athlifyr/commit/ef39e09777a6401a7b18a84d8762c1d062cfd9bd))

# [12.1.0](https://github.com/palhinhax/Athlifyr/compare/v12.0.0...v12.1.0) (2026-01-22)

### Bug Fixes

- **feed:** make general posts public by default to ensure feed visibility ([52d6aa0](https://github.com/palhinhax/Athlifyr/commit/52d6aa0dd2181279e561ff5afb38e6b04ec5f48e))
- **seeds:** correct field names in HELL160 seed (distanceKm and elevationGainM) ([d8589db](https://github.com/palhinhax/Athlifyr/commit/d8589dbf2e20fa0e5e6318032eb5d2c2340e19bc))
- **ui:** improve event page responsiveness and add missing translations ([90537a2](https://github.com/palhinhax/Athlifyr/commit/90537a2b1fd54c13d1a6961d7042d1c82fd2b258))

### Features

- **seeds:** add HELL160 Shadows and Dust 2026 event with all variants and translations ([b02d446](https://github.com/palhinhax/Athlifyr/commit/b02d446a46c335105c7fedf262d6b86baea20bf3))
- **seeds:** add Meia Maratona do Douro Vinhateiro 2026 with 3 variants ([0f7581b](https://github.com/palhinhax/Athlifyr/commit/0f7581ba5df48a51030570e678ae7c3330ed74ed))

# [12.0.0](https://github.com/palhinhax/Athlifyr/compare/v11.5.0...v12.0.0) (2026-01-22)

### Features

- **instagram:** add weather display to weekly picks posts and draft management UI ([cd5a38e](https://github.com/palhinhax/Athlifyr/commit/cd5a38ec903bb6fbba4dd85eaa0829d64a93e0d5))
- **instagram:** remove console log for saved draft in POST and UI functions ([d9a8058](https://github.com/palhinhax/Athlifyr/commit/d9a8058c16dd38d5a8435b7aad0b04406e2f3349))
- **search:** add relevance-based sorting with similarity scores ([7e2c2dc](https://github.com/palhinhax/Athlifyr/commit/7e2c2dcb9650276cea6cf4888cde2e23d0a7b62d))
- **search:** use similarity() with 0.2 threshold instead of % operator ([92acb2d](https://github.com/palhinhax/Athlifyr/commit/92acb2d33213a711067ac31c4910da198abc1302))
- **venues:** add plan deactivation and venue post visibility features ([5817d10](https://github.com/palhinhax/Athlifyr/commit/5817d10d92fef7fe89549f54779385f6aa93b2cc))
- **venues:** implement fuzzy search with pg_trgm similarity ([f5e6c66](https://github.com/palhinhax/Athlifyr/commit/f5e6c665dc2933dd82d75ddedec724f0f3b18bb0))

### BREAKING CHANGES

- **instagram:** Weather system requires new environment variables:

* OPENWEATHER_API_KEY: API key from openweathermap.org (free tier supported)
* WEATHER_UPDATE_SECRET: Security token for automated updates (generate with openssl rand -hex 32)

Migration required: pnpm prisma migrate dev --name add-event-weather

# [11.5.0](https://github.com/palhinhax/Athlifyr/compare/v11.4.0...v11.5.0) (2026-01-21)

### Features

- **seeds:** add Boston Marathon 2026 seed and TOP 100 events checklist ([c5607d3](https://github.com/palhinhax/Athlifyr/commit/c5607d326201998435f43f32663b9c6c7017a885))

# [11.4.0](https://github.com/palhinhax/Athlifyr/compare/v11.3.0...v11.4.0) (2026-01-21)

### Bug Fixes

- **seeds:** correct longitude coordinate in Google Maps URL ([eb9e489](https://github.com/palhinhax/Athlifyr/commit/eb9e48960f9228fd31e03e130af33e94f536386b))

### Features

- **seeds:** add Leadville Trail 100 Run 2026 - Race Across the Sky ([5882ac3](https://github.com/palhinhax/Athlifyr/commit/5882ac3e3c4e3c7375bae172c2877d5f26c64a77))
- **seeds:** add Ragnar Trail Atlanta 2026 complete seed file ([86080e2](https://github.com/palhinhax/Athlifyr/commit/86080e21e7c69967e2fa41db60e1f5c968a9ae8a))
- **seeds:** add Ragnar Trail Zion 2026 seed file ([6debddb](https://github.com/palhinhax/Athlifyr/commit/6debddb75c5e7d4c3c91df5148f196501de8f51c))

# [11.3.0](https://github.com/palhinhax/Athlifyr/compare/v11.2.0...v11.3.0) (2026-01-21)

### Features

- **seeds:** add The Canyons Endurance Run by UTMB 2026 seed ([2458988](https://github.com/palhinhax/Athlifyr/commit/24589887f0f91979a64a3f3188be91f4980b79f9))

# [11.2.0](https://github.com/palhinhax/Athlifyr/compare/v11.1.0...v11.2.0) (2026-01-21)

### Features

- **event:** implement multi-select for sport types in event creation ([928e39a](https://github.com/palhinhax/Athlifyr/commit/928e39ab621ba0e176ab02f0f8f96f446b1fffab))

# [11.1.0](https://github.com/palhinhax/Athlifyr/compare/v11.0.0...v11.1.0) (2026-01-21)

### Features

- **admin:** enable multiple sport types selection in event creation ([108d23d](https://github.com/palhinhax/Athlifyr/commit/108d23da4045862d4808df6e254bb58d7a6d70f5))

# [11.0.0](https://github.com/palhinhax/Athlifyr/compare/v10.3.0...v11.0.0) (2026-01-21)

### Features

- **seeds:** add Trail do Capitão 2026 seed and improve Trail Manuelino SEO ([523fe86](https://github.com/palhinhax/Athlifyr/commit/523fe86f9dd32a761819f5b71c30f9ea1635d561))
- **seeds:** add Trail Manuelino 2026 event seed ([ef402f6](https://github.com/palhinhax/Athlifyr/commit/ef402f6adff7acf5e6334280c07128660adfd996))
- **sports:** add WALKING category with full i18n support ([1ecec3a](https://github.com/palhinhax/Athlifyr/commit/1ecec3a60b144eb0e351743698002ba7cdb56c06)), closes [#14B8A6](https://github.com/palhinhax/Athlifyr/issues/14B8A6)

### BREAKING CHANGES

- **sports:** Events with walking variants should now use WALKING category instead of RUNNING

# [10.3.0](https://github.com/palhinhax/Athlifyr/compare/v10.2.0...v10.3.0) (2026-01-21)

### Features

- **analytics:** add email-based exclusion from all tracking ([520dcc3](https://github.com/palhinhax/Athlifyr/commit/520dcc335b3f0feade8f7c348c545a5d8cefc016))
- **seeds:** add ZUT Zebra Ultra Trail 2026 event seed ([230a6a2](https://github.com/palhinhax/Athlifyr/commit/230a6a2f2a362883c5a9022f2656dacb21c5abe5))
- **seeds:** enhance ZUT 2026 seed with dynamic pricing phase creation and currency support ([a2ed34c](https://github.com/palhinhax/Athlifyr/commit/a2ed34c2cf20d5d2e60c1a4b0dea8d9793061741))

# [10.2.0](https://github.com/palhinhax/Athlifyr/compare/v10.1.0...v10.2.0) (2026-01-21)

### Bug Fixes

- **seeds:** correct distance calculation in triatlo-moura variant ([78c436f](https://github.com/palhinhax/Athlifyr/commit/78c436fa6e642fe148266b708c6a75b421278b64))
- **seeds:** correct TypeScript types in triatlo-moura-2026 ([e781515](https://github.com/palhinhax/Athlifyr/commit/e7815155a38f67822a54ea6fd9f87159c4878b82))

### Features

- **seeds:** add Triatlo Média Distância Moura 2026 seed ([ada0370](https://github.com/palhinhax/Athlifyr/commit/ada037015aa696c628071001536ac2df6e507373))

# [10.1.0](https://github.com/palhinhax/Athlifyr/compare/v10.0.0...v10.1.0) (2026-01-21)

### Features

- **analytics:** implement vercel web analytics custom events ([b9c8263](https://github.com/palhinhax/Athlifyr/commit/b9c8263c529d059c323bfc7a4ddd1ba2c57ee224))

# [10.0.0](https://github.com/palhinhax/Athlifyr/compare/v9.9.0...v10.0.0) (2026-01-21)

### Bug Fixes

- **i18n:** remove problematic dynamic import fallback in request.ts ([7b77c1d](https://github.com/palhinhax/Athlifyr/commit/7b77c1d4c637428d43902caf0609fc555e5f9a49))
- **i18n:** replace filesystem loading with dynamic imports for serverless compatibility ([83eb251](https://github.com/palhinhax/Athlifyr/commit/83eb2514fd6c20e521723a4db22f762c2c975bb5))
- **ui:** show Current badge on all active pricing phases ([a46d4a1](https://github.com/palhinhax/Athlifyr/commit/a46d4a182d8279059a639e7121d8c76a8fbb8c84))
- **venues:** allow app admins to update any venue ([4a14f23](https://github.com/palhinhax/Athlifyr/commit/4a14f23a3f105b8d7fa3c0251ac5604635610ffc))
- **venues:** force image reload with unoptimized and key props ([210c44c](https://github.com/palhinhax/Athlifyr/commit/210c44c196f16e239a71763a2b2a3c2eff338652))
- **venues:** resolve image upload conflicts in venue edit modal ([d68021f](https://github.com/palhinhax/Athlifyr/commit/d68021fda7b0aa65b01ab1668a80b715bb3c2750))

### Code Refactoring

- **seeds:** move seed files to prisma/seeds directory ([589b5c2](https://github.com/palhinhax/Athlifyr/commit/589b5c21cd0cd9bc4aee48c99fa6485288b1ca07))

### Features

- add seed script for Montepio Meia Maratona de Cascais 2026 with multilingual support and event variants ([1e77604](https://github.com/palhinhax/Athlifyr/commit/1e77604e283848f3f5153751adff6540ee18710e))
- **admin:** add comprehensive user management with ban functionality ([8d03578](https://github.com/palhinhax/Athlifyr/commit/8d03578bf367fc91efc0fc103fd056f39edfaedd))
- **admin:** add users management page with pagination and search ([43ef499](https://github.com/palhinhax/Athlifyr/commit/43ef499f767a0c9f2ecd59dc187fefc077477032))
- **dx:** add event seed generator custom agent ([edc852a](https://github.com/palhinhax/Athlifyr/commit/edc852af43704b8c41904be2a14131c61d518f7f))
- **i18n:** add modular translations and event seeds with multi-language SEO ([49ab81f](https://github.com/palhinhax/Athlifyr/commit/49ab81f4475c932282ee5c67000c98f6d651e224))
- **mobile:** add initial React Native Expo setup with i18n and auth ([4493cc7](https://github.com/palhinhax/Athlifyr/commit/4493cc7e53fff7ca0f93998e9b21732ae8f9639a))
- **seeds:** add Douro Montemuro Ultra Trilhos 2026 idempotent seed ([bf9ad10](https://github.com/palhinhax/Athlifyr/commit/bf9ad10f4e9a8675a49af98fbf9d3fde3e500ddb))
- **seeds:** add IV Trail Praia Mag8 2026 idempotent seed ([c9636a0](https://github.com/palhinhax/Athlifyr/commit/c9636a032043ebd4c2ef32cdd6998d79ee2d26ae))
- **seeds:** add Lisbon Eco Marathon 2026 seed file ([91d2eea](https://github.com/palhinhax/Athlifyr/commit/91d2eea0f2023407f3033519754d9b802c53d11c))
- **seeds:** enhance Lisbon Eco Marathon description with rich markdown ([968c75e](https://github.com/palhinhax/Athlifyr/commit/968c75e60df20d30b48cb60caa4efb5fe3c68641))
- **ui:** improve venue profile header and add hero backgrounds ([b762482](https://github.com/palhinhax/Athlifyr/commit/b7624821d3f195be860d8f1367af7b788dc2c1a3))
- **ui:** integrate navigation buttons into event header image ([aca6141](https://github.com/palhinhax/Athlifyr/commit/aca61417d24230be91730dbed1437b4f50ead158))
- **venues:** add manual subscription management system with pagination ([26601e8](https://github.com/palhinhax/Athlifyr/commit/26601e8829c34229db91cb521af086540f6b911f))
- **venues:** add plan management UI for venue owners and admins ([e293fb3](https://github.com/palhinhax/Athlifyr/commit/e293fb369205be112d5a9de3e3ee9e215cde5fd5))
- **venues:** add plan policy system and subscription history ([2814c91](https://github.com/palhinhax/Athlifyr/commit/2814c919f9d2bfc6c9292fee22e22e418ff0e6d3))
- **venues:** implement stripe payment integration for subscriptions ([171de6d](https://github.com/palhinhax/Athlifyr/commit/171de6d457d825d0724c000fb4e1f51f8f3541a2))

### BREAKING CHANGES

- **seeds:** Seed files moved from prisma/ to prisma/seeds/ directory.
  Update execution commands to use prisma/seeds/<file>.ts path.

# [9.9.0](https://github.com/palhinhax/Athlifyr/compare/v9.8.3...v9.9.0) (2026-01-19)

### Features

- **venues:** add user venues quick access menu ([edffbb3](https://github.com/palhinhax/Athlifyr/commit/edffbb346017c3cf9d41f616ac67bdd82d99cec3))

## [9.8.3](https://github.com/palhinhax/Athlifyr/compare/v9.8.2...v9.8.3) (2026-01-19)

### Bug Fixes

- **venues:** improve members and sessions display for owners/admins ([01876a6](https://github.com/palhinhax/Athlifyr/commit/01876a61a83f9c17942e66d42ed0e2625625fbda))

## [9.8.2](https://github.com/palhinhax/Athlifyr/compare/v9.8.1...v9.8.2) (2026-01-19)

### Bug Fixes

- **venues:** allow app admins to edit any venue ([826cf29](https://github.com/palhinhax/Athlifyr/commit/826cf29fe18e09cd05701b4cf652b9b13e50f682))

## [9.8.1](https://github.com/palhinhax/Athlifyr/compare/v9.8.0...v9.8.1) (2026-01-19)

### Bug Fixes

- **venues:** allow negative coordinates in latitude/longitude fields ([cb26d2f](https://github.com/palhinhax/Athlifyr/commit/cb26d2f4a6cd46bd6d701c5ae5c969d6253c5697))

# [9.8.0](https://github.com/palhinhax/Athlifyr/compare/v9.7.0...v9.8.0) (2026-01-19)

### Features

- **venues:** add edit functionality for venue owners and admins ([b061175](https://github.com/palhinhax/Athlifyr/commit/b061175fafd0479adcc794121f01f8fde4d3f928))

# [9.7.0](https://github.com/palhinhax/Athlifyr/compare/v9.6.0...v9.7.0) (2026-01-19)

### Features

- **i18n:** add new translations for empty feed messages across multiple languages ([7147195](https://github.com/palhinhax/Athlifyr/commit/7147195284bb16fa9f17b38a16bf0441d0defa85))

# [9.6.0](https://github.com/palhinhax/Athlifyr/compare/v9.5.1...v9.6.0) (2026-01-19)

### Features

- **venues:** add modern social profile design with cover image ([2d344f2](https://github.com/palhinhax/Athlifyr/commit/2d344f239c9e73f464d92981ba6fd8436925815d))
- **venues:** add social feed tab to venue profiles ([721af77](https://github.com/palhinhax/Athlifyr/commit/721af7750204332b43e4382edaafd8d6a182b63e))

## [9.5.1](https://github.com/palhinhax/Athlifyr/compare/v9.5.0...v9.5.1) (2026-01-19)

### Bug Fixes

- **i18n:** add missing translations for venues page and event filters ([3c89ead](https://github.com/palhinhax/Athlifyr/commit/3c89eadcd058c2e7f5cb36140e5fd321ca94a2f0))
- **map:** change Ver Evento button to link variant for consistency ([4357f06](https://github.com/palhinhax/Athlifyr/commit/4357f0632c7034939dfb9d09497502049e98aeab))

# [9.5.0](https://github.com/palhinhax/Athlifyr/compare/v9.4.0...v9.5.0) (2026-01-19)

### Features

- **venues:** allow admins to create venues for other users with ownerId ([3a13e8b](https://github.com/palhinhax/Athlifyr/commit/3a13e8beda1229096a1524acad437fc86aab996e))

# [9.4.0](https://github.com/palhinhax/Athlifyr/compare/v9.3.6...v9.4.0) (2026-01-19)

### Bug Fixes

- **ui:** resolve TypeScript and ESLint errors ([69b804b](https://github.com/palhinhax/Athlifyr/commit/69b804b3870e7c87548f5621f0b56f73b0e9d651))

### Features

- **auth:** restrict venues navigation to admin users ([5c9a090](https://github.com/palhinhax/Athlifyr/commit/5c9a090c6404a9a9f1d557b7666ee047bfb19dc8))
- **venues:** add complete venues page with filters and map view ([35a071e](https://github.com/palhinhax/Athlifyr/commit/35a071e19492a3a38726d887b3c0ed34d0a1f335))

## [9.3.6](https://github.com/palhinhax/Athlifyr/compare/v9.3.5...v9.3.6) (2026-01-19)

### Bug Fixes

- **ui:** remove lateral padding from admin tabs in mobile ([cab18e1](https://github.com/palhinhax/Athlifyr/commit/cab18e1a5dc7cb58ada4e4d2e36ab87f1498c4fb))

## [9.3.5](https://github.com/palhinhax/Athlifyr/compare/v9.3.4...v9.3.5) (2026-01-19)

### Bug Fixes

- **seo:** ensure event share button uses correct URL and image ([64bdc65](https://github.com/palhinhax/Athlifyr/commit/64bdc65094c1deeabe4ccb045374029a2c3e60a5))

## [9.3.4](https://github.com/palhinhax/Athlifyr/compare/v9.3.3...v9.3.4) (2026-01-19)

### Bug Fixes

- **seo:** add locale to event Open Graph URLs for proper WhatsApp sharing ([91795ab](https://github.com/palhinhax/Athlifyr/commit/91795abc7f01683ce48c202529f05737cb5ce689))

## [9.3.3](https://github.com/palhinhax/Athlifyr/compare/v9.3.2...v9.3.3) (2026-01-19)

### Bug Fixes

- **ui:** improve venues admin page mobile layout ([f2879b0](https://github.com/palhinhax/Athlifyr/commit/f2879b026abc6042e8adf909e54a20e07b722a1d))

### Performance Improvements

- **admin:** optimize event search performance ([77aa910](https://github.com/palhinhax/Athlifyr/commit/77aa91073368f509149f44b18868001153335be9))

## [9.3.2](https://github.com/palhinhax/Athlifyr/compare/v9.3.1...v9.3.2) (2026-01-19)

### Bug Fixes

- **admin:** fix venues page and create dedicated admin endpoint ([5e85e7a](https://github.com/palhinhax/Athlifyr/commit/5e85e7a7a4931939f6599da283286ad4a7a90c28))

## [9.3.1](https://github.com/palhinhax/Athlifyr/compare/v9.3.0...v9.3.1) (2026-01-19)

### Performance Improvements

- **admin:** add dedicated admin events endpoint ([3110fd5](https://github.com/palhinhax/Athlifyr/commit/3110fd54d7a6bae6b80b9b163f305fa3e810c808))

# [9.3.0](https://github.com/palhinhax/Athlifyr/compare/v9.2.0...v9.3.0) (2026-01-19)

### Features

- **i18n:** add translations to error pages ([5ae2f2d](https://github.com/palhinhax/Athlifyr/commit/5ae2f2dde2a698e2db04609e355ff8eafcb830dd))

# [9.2.0](https://github.com/palhinhax/Athlifyr/compare/v9.1.0...v9.2.0) (2026-01-19)

### Features

- add custom error pages and improve admin UX ([dd83538](https://github.com/palhinhax/Athlifyr/commit/dd83538b47c70db1e515da41de3fa5e5a78bd49f))

# [9.1.0](https://github.com/palhinhax/Athlifyr/compare/v9.0.0...v9.1.0) (2026-01-19)

### Features

- **admin:** add venues management dashboard ([d1ebac3](https://github.com/palhinhax/Athlifyr/commit/d1ebac3b0a9635e4a3485cf42ce77ae5b19d198f))

# [9.0.0](https://github.com/palhinhax/Athlifyr/compare/v8.11.0...v9.0.0) (2026-01-19)

### Bug Fixes

- **venues:** internationalize all hardcoded strings in UI components ([681dbcf](https://github.com/palhinhax/Athlifyr/commit/681dbcfaef71125f75fc7be4797c793262307dfb))

### Features

- **i18n:** add comprehensive venues translations for all 6 languages ([035db79](https://github.com/palhinhax/Athlifyr/commit/035db799f869f2760320f7eb38c6e8185456e325))
- **i18n:** add missing venues translations for all 6 languages ([21ed3cc](https://github.com/palhinhax/Athlifyr/commit/21ed3cc928fb43ee2009919d0811d26e89ba680c))
- **instagram:** add new content templates and schema migrations ([f13caef](https://github.com/palhinhax/Athlifyr/commit/f13caef177dcb6a49f7a8de8122c136ad6809dec))
- **venues:** add database schema and core API endpoints ([f3164b4](https://github.com/palhinhax/Athlifyr/commit/f3164b4c52e60178a2607d7ea7e22d51d9ad0d85))
- **venues:** add membership management and invite endpoints ([96888b5](https://github.com/palhinhax/Athlifyr/commit/96888b5e25dddf6a09755f4079cf853b976bd630))
- **venues:** add multi-sport support with sportTypes field ([51e43a0](https://github.com/palhinhax/Athlifyr/commit/51e43a0bb758611815aa435e3c1efa141d6d83c5))
- **venues:** add payment system with IN_APP and EXTERNAL modes ([64b6668](https://github.com/palhinhax/Athlifyr/commit/64b666832dc26b52997027cfcb1fc434f417b9e7))
- **venues:** add venues list and detail pages with navigation ([8f5a2e6](https://github.com/palhinhax/Athlifyr/commit/8f5a2e677e28683e52f8731fdfee6e440381c5b3))

### BREAKING CHANGES

- **instagram:** Database schema updated with new venue and booking models

# [8.11.0](https://github.com/palhinhax/Athlifyr/compare/v8.10.0...v8.11.0) (2026-01-19)

### Features

- **events:** add date range display on event cards ([98450c9](https://github.com/palhinhax/Athlifyr/commit/98450c960bac56404b0d260ed6e8e00be38c42d5))

# [8.10.0](https://github.com/palhinhax/Athlifyr/compare/v8.9.0...v8.10.0) (2026-01-18)

### Features

- **seed:** add Marathon des Alpes-Maritimes Nice-Cannes 2026 seed file ([d11020d](https://github.com/palhinhax/Athlifyr/commit/d11020d7e0e02194a155a5dbcf0586649918ae36))

# [8.9.0](https://github.com/palhinhax/Athlifyr/compare/v8.8.0...v8.9.0) (2026-01-18)

### Bug Fixes

- **seeds:** address code review feedback for Florence Marathon ([8b8d597](https://github.com/palhinhax/Athlifyr/commit/8b8d597c11a74cc58150fcf62600c827d5c72897))
- **seeds:** improve Google Maps URL for Florence Marathon ([75eac55](https://github.com/palhinhax/Athlifyr/commit/75eac55ad8744b7624dbcf6c327b650396a3f1c2))
- **seeds:** update Florence Marathon coordinates and Google Maps link ([46b72c2](https://github.com/palhinhax/Athlifyr/commit/46b72c2d436dad024e9bb0cec548f87ae45b854c))

### Features

- **seeds:** add Estra Firenze Marathon 2026 seed ([c00e0a7](https://github.com/palhinhax/Athlifyr/commit/c00e0a7e42b2ab029a802b478a9d1640a1b84ced))

# [8.8.0](https://github.com/palhinhax/Athlifyr/compare/v8.7.0...v8.8.0) (2026-01-18)

### Features

- **i18n:** add TikTok translations for all 6 languages ([9de8dbc](https://github.com/palhinhax/Athlifyr/commit/9de8dbce4881a8c90960836cce3d3f0dbeb5b582))
- **instagram:** add modern Instagram and TikTok templates with new formats ([b529a34](https://github.com/palhinhax/Athlifyr/commit/b529a34faac628657dd9381320d31b1194d3b916))

# [8.7.0](https://github.com/palhinhax/Athlifyr/compare/v8.6.0...v8.7.0) (2026-01-18)

### Bug Fixes

- **instagram:** correct video export timing to match input duration ([9188f85](https://github.com/palhinhax/Athlifyr/commit/9188f8539285d1909386f21c62cc9ce8d87fa1f2))
- **instagram:** remove unused frameStartTime variable ([2a0f122](https://github.com/palhinhax/Athlifyr/commit/2a0f122db6298664beb2dccff34b45e814e4c4ad))

### Features

- **instagram:** add week picker to weekly picks template ([f7f9840](https://github.com/palhinhax/Athlifyr/commit/f7f984050d9a1ee3190856b100bb4297b5884b65))

# [8.6.0](https://github.com/palhinhax/Athlifyr/compare/v8.5.4...v8.6.0) (2026-01-17)

### Bug Fixes

- **instagram:** address code review feedback on video export ([ddb9aab](https://github.com/palhinhax/Athlifyr/commit/ddb9aab61bfe2bc748e676dea9aafee63f05e9a0))

### Features

- **instagram:** add video duration control with progress indicator ([7a2081a](https://github.com/palhinhax/Athlifyr/commit/7a2081a57f9fec3752c453074b27e6faa0ec72f3))
- **instagram:** add video scale control to adjust video size in frame ([a74ccb7](https://github.com/palhinhax/Athlifyr/commit/a74ccb7a0ace9047107f3b78bc9ebc37ff9649b5))

### Performance Improvements

- **instagram:** optimize video export with adaptive bitrate and FPS ([7a03c3b](https://github.com/palhinhax/Athlifyr/commit/7a03c3bdaddd3935322fc7f2d99173c452478606))

## [8.5.4](https://github.com/palhinhax/Athlifyr/compare/v8.5.3...v8.5.4) (2026-01-17)

### Bug Fixes

- **instagram:** maintain video aspect ratio in creator ([1fbf980](https://github.com/palhinhax/Athlifyr/commit/1fbf980bc246530f22e6d3c510793b7328f73514))

## [8.5.3](https://github.com/palhinhax/Athlifyr/compare/v8.5.2...v8.5.3) (2026-01-17)

### Bug Fixes

- **instagram:** fix ImageBitmap double-close issue and improve efficiency ([2ebe974](https://github.com/palhinhax/Athlifyr/commit/2ebe974c27865378c2a44b35c65adecd80cb0a07))
- **instagram:** improve video export frame rate from ~3fps to 30fps ([bce1202](https://github.com/palhinhax/Athlifyr/commit/bce1202e6e7a0bafd225df752678f3d043fdc8ec))

## [8.5.2](https://github.com/palhinhax/Athlifyr/compare/v8.5.1...v8.5.2) (2026-01-17)

### Bug Fixes

- **instagram:** improve video export reliability and increase upload limits ([3707e18](https://github.com/palhinhax/Athlifyr/commit/3707e18736a36a4ae7eedaa31a482e6d80227880))

## [8.5.1](https://github.com/palhinhax/Athlifyr/compare/v8.5.0...v8.5.1) (2026-01-17)

### Bug Fixes

- **instagram:** improve video upload error handling and mobile responsiveness ([f2f0a10](https://github.com/palhinhax/Athlifyr/commit/f2f0a10331a61d454c41ae37d36155ed760e8813))
- **instagram:** standardize error messages to English ([95780af](https://github.com/palhinhax/Athlifyr/commit/95780af6ed130f0dd6a25c2efcda26adf5eac8da))

# [8.5.0](https://github.com/palhinhax/Athlifyr/compare/v8.4.0...v8.5.0) (2026-01-17)

### Features

- **i18n:** add admin section translations for es, fr, de, it ([da364fd](https://github.com/palhinhax/Athlifyr/commit/da364fd20d7acf6151caff77f7fcdf5f4f62d60b))
- **i18n:** add translations for admin components ([bfafb38](https://github.com/palhinhax/Athlifyr/commit/bfafb38c308acdc5df85be3b4d6bcd5499d7008c))
- **i18n:** add translations for share button and pricing phases ([6ed769e](https://github.com/palhinhax/Athlifyr/commit/6ed769e57c6f8fdb71abec01c35d805f07b12e58))

# [8.4.0](https://github.com/palhinhax/Athlifyr/compare/v8.3.0...v8.4.0) (2026-01-17)

### Bug Fixes

- **ui:** resolve button styling and search input bugs ([bd931a3](https://github.com/palhinhax/Athlifyr/commit/bd931a340d00aece8ea33fc4571ba85edae353b6))

### Features

- **admin:** add delete functionality for contact messages ([98ed440](https://github.com/palhinhax/Athlifyr/commit/98ed4401e062259a75cb91a6176034cc9b5f911a))
- **admin:** add email reply functionality for contact messages ([3081492](https://github.com/palhinhax/Athlifyr/commit/30814923c48cd267adbfc081d0cb308284a4c87b))
- **admin:** implement admin dashboard with tab navigation and contact management ([607f173](https://github.com/palhinhax/Athlifyr/commit/607f17367bbffa14df47204e9104655213c6e724))
- Implement weekly events API endpoint and related components for Instagram templates ([8336aa5](https://github.com/palhinhax/Athlifyr/commit/8336aa5a20d85a3f87298fd0593840d667a2a3ba))
- **instagram:** add video background support with export functionality ([fdbba6d](https://github.com/palhinhax/Athlifyr/commit/fdbba6d8a6455fedf419c9e2781f936e08165371))
- **instagram:** enhance video export with detailed logging and improved chunk handling ([9edf356](https://github.com/palhinhax/Athlifyr/commit/9edf3567289819f24988902ab0a34465e24302ac))
- **map:** add custom sport-themed markers and improve button styling ([6ad0543](https://github.com/palhinhax/Athlifyr/commit/6ad0543939c51357f832a6fc034b8e9ad53a55c6))

# [8.3.0](https://github.com/palhinhax/Athlifyr/compare/v8.2.0...v8.3.0) (2026-01-17)

### Bug Fixes

- **middleware:** enhance static asset matching in maintenance mode ([01db953](https://github.com/palhinhax/Athlifyr/commit/01db95393463363e047a141418622a55bd241a20))

### Features

- **admin:** implement pagination for events management page ([0a9bf7f](https://github.com/palhinhax/Athlifyr/commit/0a9bf7f016de7fb23f274665c168432c091c9bc8))

# [8.2.0](https://github.com/palhinhax/Athlifyr/compare/v8.1.0...v8.2.0) (2026-01-17)

### Features

- **events:** add event seeds and infinite scroll implementation ([b024627](https://github.com/palhinhax/Athlifyr/commit/b0246271c329c9915d27e72fba9b319139a5b985))
- **not-found:** update locale handling and set default video source ([e6199e0](https://github.com/palhinhax/Athlifyr/commit/e6199e0b1333c8ae3c84d5790d61cb4ca7fe2474))

# [8.1.0](https://github.com/palhinhax/Athlifyr/compare/v8.0.0...v8.1.0) (2026-01-17)

### Features

- **admin:** add visual warnings for incomplete event data ([b3cb3a5](https://github.com/palhinhax/Athlifyr/commit/b3cb3a5e30dbbd427cd0026f925acf552f90a29b))
- **events:** add GP Atlântico and Corrida da Árvore 2026 seeds ([ea40a03](https://github.com/palhinhax/Athlifyr/commit/ea40a03d4c400bab52695ed899e1c5a72c88a06b))
- **events:** add lightbox and new event seed ([d561b02](https://github.com/palhinhax/Athlifyr/commit/d561b02c7cb880217705489646563b6392949054))
- **events:** add map/list toggle view in events page ([ffbdb42](https://github.com/palhinhax/Athlifyr/commit/ffbdb421fb12f29240df4fc54a63be7a13014e93))
- **events:** hide distance filter and ignore distance in map mode ([dca5946](https://github.com/palhinhax/Athlifyr/commit/dca59467d7f7091afb39fc29cf7b16422936105a))
- **seeds:** add seeds for Passeio BTT and Trail Terras de Oiá 2026 events ([4f4dbbc](https://github.com/palhinhax/Athlifyr/commit/4f4dbbc9f1718188066de89dc7d3ef2344b0e4af))
- **seeds:** update Terras de Oiã events with correct data ([8653ffe](https://github.com/palhinhax/Athlifyr/commit/8653ffe238e94b625472f98f751a8bdc7ff8134a))

# [8.0.0](https://github.com/palhinhax/Athlifyr/compare/v7.7.0...v8.0.0) (2026-01-16)

### Features

- **events:** add Hybrid Day Leiria and Málaga 2026 seeds and fix filters ([9585b6e](https://github.com/palhinhax/Athlifyr/commit/9585b6e3d49d98bc6a2034ef200441f491533592))
- **seed:** add Hybrid Day Aveiro 2026 event ([05b4544](https://github.com/palhinhax/Athlifyr/commit/05b4544cdbb6fa77bfc2b410c4f822eb55d565e8))

### BREAKING CHANGES

- **events:** Events page now shows all future events regardless of country by default, instead of filtering by user's country. Users can enable location-based filtering explicitly.

# [7.7.0](https://github.com/palhinhax/Athlifyr/compare/v7.6.0...v7.7.0) (2026-01-16)

### Features

- Add legal documents and cookie consent functionality ([1d8054f](https://github.com/palhinhax/Athlifyr/commit/1d8054f964c79c0fe0b61d8361142ff0ac9033b6))
- Enhance EqualWeb Accessibility Widget with locale support ([0225cd9](https://github.com/palhinhax/Athlifyr/commit/0225cd92397daed8e0eef6f79c2b7f81c1a513cf))

# [7.6.0](https://github.com/palhinhax/Athlifyr/compare/v7.5.0...v7.6.0) (2026-01-16)

### Features

- **ui:** improve search accessibility and implement global search ([857b330](https://github.com/palhinhax/Athlifyr/commit/857b330610c651aaef34fad9d8505eca77446176))

# [7.5.0](https://github.com/palhinhax/Athlifyr/compare/v7.4.0...v7.5.0) (2026-01-16)

### Features

- **ui:** optimize logo and favicon ([d187f9e](https://github.com/palhinhax/Athlifyr/commit/d187f9e4d1b85a1de0ea86a7c236f06f59f88650))

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
