# Grooming: Quoteflow Responsive Design & Layout

## 1. Design Tokens (Tailwind v4)
Definisi di `src/index.css` via `@theme`. Gunakan utility class ini agar konsisten:
- **Colors:**
  - `bg-brand-white` (#FFFFFF)
  - `bg-brand-gray-light` (#F5F7FA)
  - `text-brand-text-dark` (#333333)
  - `text-brand-text-medium` (#777777)
  - `bg-brand-blue` (#5D7CF0)
  - `bg-brand-orange` (#F0A55D)
- **Breakpoints:**
  - `md`: 768px (Tablet/Small Desktop)
  - `lg`: 1024px (Large Desktop/Sidebar visibility)

## 2. Layout Strategy (Unified)
Ganti `MobileLayout` & `DesktopLayout` menjadi `ResponsiveLayout`:

### Mobile View (< 1024px)
- **Header:** `GlobalHeader.tsx` (Logo kiri, Action/Logout kanan).
- **Body:** Scrollable area dengan padding `px-4` atau `px-6`.
- **Bottom Nav:** Floating bar dengan 5 tab utama (Home, Order, Return, Master, Report).
- **Sidebar:** Hidden, muncul sebagai overlay via burger menu (opsional jika sudah ada bottom nav).

### Desktop View (>= 1024px)
- **Sidebar:** Fixed left (width ~250px-300px), navigasi utama di sini.
- **Navbar:** Top bar (Breadcrumbs, User Profile, Search). Bottom Nav mobile `hidden`.
- **Content:** Container fluid dengan padding `lg:p-8`.

## 3. Component Patterns per Page

### List Pages (Master User/Category/Item)
- **Mobile:** Card-based list. Satu card per item. Action (edit/delete) via swipe atau icon dots.
- **Desktop:** Data Table. Columns lengkap. Action di kolom terakhir.
- **Implementation:** Pakai Tailwind `block lg:hidden` (untuk card) dan `hidden lg:table-row-group` (untuk table rows) dalam satu component.

### Form Pages (Create/Edit)
- **Mobile:** Single column, full width. Label di atas input. Button primary sticky di bottom atau end of form.
- **Desktop:** Two columns (`lg:grid-cols-2`) untuk field yang pendek. Label bisa inline atau tetap di atas.

## 4. Navigation Flow
- `/home`: Dashboard summary.
- `/master-main`: Hub untuk semua master data.
- Tab bar mobile harus sinkron dengan Active State di Sidebar desktop.

## 5. Coding Standard for Responsive
- **No JS Device Detection:** Jangan pakai `isMobile` state jika bisa pakai CSS.
- **Mobile-First CSS:** Tulis class dasar untuk mobile, lalu override dengan `md:` atau `lg:`.
  - Contoh: `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"`
- **Utility Over Custom CSS:** Gunakan variable `--color-brand-*` yang sudah ada di `@theme`.
