# Master Implementation Plan: Responsive & Master Data Revamp

## 1. Responsive Migration (Legacy Adaptive -> Mobile-First)
1|# Implementation Plan: Responsive Migration (Adaptive -> Mobile-First Responsive)
2|
3|## Overview
4|Migrasi Quoteflow dari adaptive (duplikasi `mobile-*` / `desktop-*` + branching `window.innerWidth <= 768` di `src/app/*/index.tsx`) ke responsive mobile-first. Satu komponen per fitur, layout pakai Tailwind responsive (`sm:`, `md:`, `lg:`), tanpa JS device detection. Pengerjaan per page/fitur dengan pengecekan kualitas tiap slice.
5|
6|## Architecture Decisions
7|- **Mobile-first CSS, bukan JS branching.** Hapus `useState(window.innerWidth) + useEffect resize` di `src/app/*/index.tsx`. Ganti dengan Tailwind breakpoints. Alasan: hindari hydration mismatch, duplikasi logic, dan FOUC saat resize.
8|- **Satu layout wrapper responsive.** Ganti `MobileLayout` + `Layout` (sidebar+navbar desktop) yang terpisah menjadi `ResponsiveLayout` tunggal. Mobile: `GlobalHeader` + bottom nav. Desktop: sidebar + navbar. Switch via CSS (`lg:hidden` / `hidden lg:flex`), bukan `isMobile`.
9|- **Tetap patuh FE_Code_Convention.md.** Struktur `ModuleName.component.tsx` (pure UI), `container.tsx` (logic/RTK), `hook.ts`, `type.ts`, `style.ts`, `wrapper.tsx`, `index.ts` tidak berubah. Yang berubah hanya `component.tsx` jadi responsive.
10|- **Breakpoint tunggal project:** `md=768px` (existing), `lg=1024px` untuk sidebar. Konsisten di semua page. Jangan per-page bikin angka baru.
11|- **Hapus duplikasi bertahap, bukan big-bang.** Tiap task migrasi 1 page -> verifikasi -> baru hapus folder lama page tersebut. `src/modules/*/mobile-*` dan `desktop-*` dihapus per-page setelah responsive stabil.
12|
13|## Task List
14|
15|### Phase 1: Foundation
16|- [ ] Task 1: Audit adaptive & tetapkan konvensi responsive
17|- [ ] Task 2: Build ResponsiveLayout (pengganti MobileLayout + Layout)
18|
19|### Checkpoint: Foundation
20|- [ ] `npm run build` + `npx tsc --noEmit` + `npm run lint` hijau
21|- [ ] Manual check ResponsiveLayout di 375px, 768px, 1024px, 1440px
22|
23|### Phase 2: Core Pages (urutan prioritas)
24|- [ ] Task 3: Dashboard (`/home`) - responsive
25|- [ ] Task 4: Master Main (`/master-main`) - responsive
26|- [ ] Task 5: Master User List (`/master-user`)
27|- [ ] Task 6: Master User Create/Edit/Detail (`/master-user/create`, `/detail/:id`)
28|- [ ] Task 7: Master Category List + Create/Detail
29|- [ ] Task 8: Master Item List + Create/Detail
30|- [ ] Task 9: Order List + Create/Detail
31|- [ ] Task 10: Return + Report
32|
33|### Checkpoint: Per Page (berlaku untuk Task 3-10)
34|- [ ] Tidak ada `window.innerWidth` / `isMobile` tersisa di page tersebut
35|- [ ] Snapshot + unit test ter-update, coverage >=70%
36|- [ ] Visual check 375/768/1024/1440 + `npm run build` pass
37|
38|### Phase 3: Cleanup
39|- [ ] Task 11: Hapus sisa folder `mobile-*`/`desktop-*` + route `isMobile` wrapper, final lint/typecheck
40|
41|## Risks and Mitigations
42|| Risk | Impact | Mitigation |
43||------|--------|------------|
44|| Duplikasi style `brand-*` tidak konsisten antar page | Med | Kunci token di `AGENTS.md` + `ResponsiveLayout`, jangan per-component define warna baru |
45|| Hapus `isMobile` breaking route lama | High | Migrasi per-page, keep fallback route sampai page tersebut verified |
46|| Test snapshot banyak fail sekaligus | Med | Update per-page, jangan batch semua page dalam 1 PR |
47|
48|## Open Questions
49|- Urutan page pertama yang mau dikerjakan? Default: Task 3 Dashboard (paling sering dilihat) atau Task 4 Master Main (paling sederhana).
50|- Apakah bottom nav mobile tetap 5 tab yang sama? (Home/Order/Return/Master/Report)

---

## 2. Master Data Module Revamp (12 Masters Spec)
1|# Plan: Master Data & UI Revamp — Quoteflow
2|
3|> Saved: 2026-10-03. Resume anytime: lanjut dari branch yang tertulis di bagian Progress.
4|
5|## Overview
6|Rombak 12 master data jadi responsive single-component (hapus split mobile/desktop), fixture dulu (API belakangan), status auto dari BE (active/inactive saja, tidak ada di form).
7|
8|## Spec (Get vs Post)
9|
10|| Master | Get (table) | Post (form) |
11||---|---|---|
12|| **customer** | name, address, phoneNumber, status, createAt, createBy | name, address, phoneNumber |
13|| **item** | name, category, price, stock, image, duration, status, remark, createAt, createBy | name, category, price, stock, image, duration, remark |
14|| **user** | username, role, status, createAt, createBy (password HIDDEN di table) | username, password, role |
15|| **role** | roleName, status, createAt, createBy | roleName |
16|| **category** | categoryName, status, createAt, createBy | categoryName |
17|| **voucher** | code, discountPercent, status, createAt, createBy | code, discountPercent |
18|| **project** | name, items: {itemId,qty}[], remark, status, createAt, createBy | name, items: {itemId,qty}[], remark |
19|| **service-type** | name, price, isActive, status, createAt, createBy | name, price, isActive |
20|| **payment-method** | name, description, status, createAt, createBy | name, description |
21|| **pic** | name, status, createAt, createBy | name |
22|| **payment-type** | name, status, createAt, createBy | name |
23|
24|Notes:
25|- `status` never in form (BE auto). Badge active=green, inactive=gray.
26|- `service-type` has both `isActive` (business flag, in form) and `status` (system, read-only).
27|- `project` item[] + qty = `ProjectItem { itemId, qty }`.
28|- `post payment-method` di spek awal salah tulis ada status/createAt — dihapus.
29|- All masters have full CRUD via fixture. `src/fixture/master-*.ts` 5-10 rows, createAt ISO, createBy string.
30|
31|## Shared Base Type
32|```ts
33|// src/types/master.ts
34|type MasterStatus = "active" | "inactive";
35|type MasterBase = { id: string; status: MasterStatus; createAt: string; createBy: string; };
36|// Get = MasterBase + fields, Post = Omit<Get, "id"|"status"|"createAt"|"createBy">
37|```
38|
39|## Module Structure (responsive, NO mobile/desktop split)
40|```
41|src/modules/master-{name}/
42|  Master{Name}.type.ts
43|  Master{Name}.hook.ts
44|  Master{Name}.config.ts
45|  Master{Name}.component.tsx   # responsive: grid-cols-1 md:grid-cols-*, Tailwind breakpoints
46|  Master{Name}.container.tsx
47|  Master{Name}.wrapper.tsx
48|  Master{Name}.style.ts (if needed)
49|  index.ts
50|src/fixture/master-{name}.ts
51|src/types/master.ts
52|```
53|
54|Reuse pattern existing: Table + modal create/edit + confirm delete + pagination. Copy 1 master as template. `ponytail:` skip generic CRUD factory until 3+ masters prove identical — extract later.
55|
56|## UI Rules
57|- Table columns = Get fields. status badge, createAt `dd MMM yyyy`.
58|- Form = Post fields only. No status input. Validation at trust boundary (required + phone/discount/price numeric).
59|- CRUD: Create/Edit modal, Delete confirm. Detail via modal (except `item` image preview if needed).
60|- MasterMain: grid `grid-cols-1 md:grid-cols-3 gap-6`, 12 cards, `Icons.*`, paths `/master-{kebab}` consistent.
61|
62|## Routing (src/App.tsx)
63|- `/master-main` hub
64|- `/master-{customer,item,user,role,category,voucher,project,service-type,payment-method,pic,payment-type}`
65|- `/:id` detail, `/create` & `/edit/:id` reuse same form component where possible. Modal routes OK (single route + param).
66|- Cleanup old aliases `/master-data/categories`, `/master-data/items` vs `/master-category` duplicates.
67|
68|## Branches (base = `integration`, each PR targets `integration`)
69|
70|| # | Branch | Scope |
71||---|---|---|
72|| 0 | `feat/master-foundation` | `src/types/master.ts`, MasterMain 12 cards, route cleanup, Sidebar.config |
73|| 1 | `feat/master-role` | simple (1 field) |
74|| 2 | `feat/master-category` | revamp responsive + status/createAt/createBy |
75|| 3 | `feat/master-pic` | simple |
76|| 4 | `feat/master-payment-type` | simple |
77|| 5 | `feat/master-voucher` | simple |
78|| 6 | `feat/master-customer` | medium |
79|| 7 | `feat/master-user` | revamp (hide password, role relation) |
80|| 8 | `feat/master-payment-method` | medium |
81|| 9 | `feat/master-service-type` | medium (isActive + status) |
82|| 10 | `feat/master-item` | complex revamp (image, stock, duration) |
83|| 11 | `feat/master-project` | complex (multi-select item + qty) |
84|
85|Order: foundation → simple batch → medium → complex. One approval per branch before commit+push.
86|
87|## Git & PR Workflow
88|
89|1. Create branch from `integration`: `git checkout integration && git pull && git checkout -b feat/master-{name}`
90|2. Code + verify: `npm run lint && npx tsc --noEmit && npm run build && npm run test`
91|3. Show diff to user, wait for `approved`
92|4. On approval — auto commit & push:
93|   ```bash
94|   git commit -m "feat(master-{name}): <concise feat>"
95|   git push -u origin feat/master-{name}
96|   ```
97|5. Auto PR:
98|   ```bash
99|   gh pr create --base integration --head feat/master-{name} --title "feat(master-{name}): <title>" --body "🗒️ Commit Summary: ...\n\n📌 Key Changes: ..."
100|   ```
101|   PR body in English, format:
102|   ```
103|   🗒️ Commit Summary: <what & why, 2-4 lines>
104|   📌 Key Changes:
105|   - ...
106|   ```
107|6. User checks PR and approves. Conventional commits. Clean history, no merge commits, no unrelated changes.
108|
109|## Verification Per Branch
110|- [ ] `npm run lint` pass
111|- [ ] `npx tsc --noEmit` pass
112|- [ ] `npm run build` pass
113|- [ ] `npm run test` pass / updated snapshots if needed
114|- [ ] Manual responsive check: 375 / 768 / 1024 / 1440
115|- [ ] No `window.innerWidth` / `isMobile` in new code
116|- [ ] Fixture data renders in table, create/edit/delete work (fixture in-memory)
117|
118|## Resume Instructions
119|- Current branch: `feat/enhancement-master-data` (pre-revamp). Start next session: check this file, checkout `integration`, create `feat/master-foundation`.
120|- If interrupted mid-branch: `git status` + `git diff` to see pending changes, continue or stash.
121|
122|## Risks
123|- Route divergence old vs new — mitigate: consolidate to `/master-*` canonical, keep alias redirect until verified.
124|- Fixture → real API later — adapter stub in hook (swap import), no hard coupling.
125|
126|## When to Add (skipped for now)
127|- Generic CRUD factory/hook, API service layer, unit tests >=70% — add when 3 masters stable.
