# Todo: Responsive Migration

## Task 1: Audit adaptive & konvensi responsive
**Description:** Inventory semua `isMobile` + duplikasi `mobile-*`/`desktop-*`, tetapkan breakpoint tunggal.
**Acceptance criteria:**
- [ ] List file yang pakai `window.innerWidth` / `isMobile` terdokumentasi
- [ ] Breakpoint `md=768px`, `lg=1024px` dikunci di AGENTS.md
**Verification:**
- [ ] `search_files isMobile` 0 sisa setelah Phase 2 (per-page check)
- [ ] Build: `npm run build`
**Dependencies:** None
**Files likely touched:** `AGENTS.md`, `tasks/plan.md`
**Estimated scope:** XS

## Task 2: Build ResponsiveLayout
**Description:** Satu wrapper responsive pengganti `MobileLayout` + `Layout`. Mobile: GlobalHeader + bottom nav. Desktop: Sidebar + Navbar via CSS.
**Acceptance criteria:**
- [ ] Tidak pakai JS `isMobile`, switch pakai `lg:hidden` / `hidden lg:flex`
- [ ] Bottom nav tetap 5 tab, sidebar desktop konsisten
- [ ] Ganti `src/app/shared/MobileLayout.tsx` + `src/app/layout.tsx` jadi `ResponsiveLayout.tsx`
**Verification:**
- [ ] Visual 375/768/1024/1440 tidak FOUC saat resize
- [ ] `npx tsc --noEmit` + `npm run lint` pass
**Dependencies:** Task 1
**Files likely touched:** `src/app/shared/ResponsiveLayout.tsx`, `src/components/Sidebar/*`, `src/components/Navbar/*`
**Estimated scope:** M

## Checkpoint: Foundation
- [ ] Build + typecheck + lint hijau
- [ ] Manual check ResponsiveLayout 4 breakpoints

## Task 3: Dashboard (/home) - responsive
**Description:** Gabung `mobile-dashboard` + `desktop-dashboard` jadi satu component responsive.
**Acceptance criteria:**
- [ ] Hapus `src/app/dashboard/index.tsx` branching isMobile, pakai ResponsiveLayout
- [ ] Satu `Dashboard.component.tsx` mobile-first (grid/stack pakai `md:` `lg:`)
- [ ] Hapus folder duplikat setelah verified
**Verification:**
- [ ] Test: `npm run test -- dashboard` pass, coverage >=70%
- [ ] Visual 375/768/1024/1440
**Dependencies:** Task 2
**Files likely touched:** `src/modules/dashboard/*`, `src/app/dashboard/index.tsx`
**Estimated scope:** M

## Task 4: Master Main (/master-main) - responsive
**Description:** `MasterMain.component.tsx` sudah grid `grid-cols-1 md:grid-cols-3`, migrasi wrapper adaptive -> responsive.
**Acceptance criteria:**
- [ ] Hapus isMobile di `src/app/master-main/index.tsx`
- [ ] Cards responsive tetap, tidak duplikasi mobile/desktop
**Verification:**
- [ ] Build + test pass
- [ ] Snap update
**Dependencies:** Task 2
**Files likely touched:** `src/app/master-main/index.tsx`, `src/modules/master-main/*`
**Estimated scope:** S

## Task 5: Master User List (/master-user)
**Description:** Unify mobile-master-user + desktop-master-user.
**Acceptance criteria:**
- [ ] Satu component list responsive (table di desktop, card di mobile via CSS)
- [ ] Hapus branching isMobile
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 2
**Files likely touched:** `src/modules/master-user/*`, `src/app/master-user/index.tsx`
**Estimated scope:** M

## Task 6: Master User Create/Edit/Detail
**Acceptance criteria:**
- [ ] Form responsive (full width mobile, 2-col `md:grid-cols-2` desktop)
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 5
**Files likely touched:** `src/app/master-user/create/*`, `src/app/master-user/detail/*`
**Estimated scope:** M

## Task 7: Master Category List + Create/Detail
**Acceptance criteria:**
- [ ] Sama seperti Task 5-6 untuk category
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 2
**Files likely touched:** `src/modules/master-category/*`
**Estimated scope:** M

## Task 8: Master Item List + Create/Detail
**Acceptance criteria:**
- [ ] Sama, item list + form responsive
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 2
**Files likely touched:** `src/modules/master-item/*`
**Estimated scope:** M

## Task 9: Order List + Create/Detail
**Acceptance criteria:**
- [ ] Order flow responsive
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 2
**Files likely touched:** `src/modules/order/*`
**Estimated scope:** M

## Task 10: Return + Report
**Acceptance criteria:**
- [ ] Return & Report pages responsive
**Verification:**
- [ ] Test + build pass
**Dependencies:** Task 2
**Files likely touched:** `src/modules/return/*`, `src/modules/report/*`
**Estimated scope:** M

## Task 11: Cleanup final
**Description:** Hapus sisa `mobile-*`/`desktop-*` + `isMobile` wrappers, final lint/typecheck.
**Acceptance criteria:**
- [ ] `search_files isMobile` = 0
- [ ] Tidak ada folder `mobile-*` `desktop-*` tersisa
**Verification:**
- [ ] `npm run build` + `npx tsc --noEmit` + `npm run lint` + `npm run test` hijau
**Dependencies:** Task 3-10
**Files likely touched:** semua `src/app/*/index.tsx`, `src/modules/*`
**Estimated scope:** S

## Checkpoint: Complete
- [ ] Semua page responsive mobile-first, tidak ada JS device detection
- [ ] Coverage >=70% per module
- [ ] Ready review
