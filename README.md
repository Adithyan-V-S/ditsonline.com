# DITS Online (`ditsonline.com`)

> Industrial-Grade Robots, Manipulators & Core Precision Hardware Parts Storefront

Bilingual (English / 简体中文) e-commerce marketplace and RFQ quoting engine for autonomous robotics, humanoid platforms, all-terrain quadrupeds, joint actuators, dexterous hands, and high-performance computing modules.

---

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Cyber aesthetics, dark mode, glassmorphism)
- **Internationalization**: `next-intl` (Route-based `/en` and `/zh`)
- **Testing**: Playwright End-to-End Suite
- **API Architecture**: Abstract typed data access layer (`src/lib/api`) with OpenAPI 3.1 contract parity (`contracts/openapi.yaml`)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 3. Run Automated Playwright Tests
```bash
npx playwright test
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## API Contract with Backend

The contract for Dev B (Platform / Database / Payments) is located in:
- `contracts/openapi.yaml`: OpenAPI 3.1 specification for products, categories, quotes, orders, and rentals.
- `contracts/types.ts`: TypeScript DTO definitions.

---

## Features Implemented

1. **Design System & Shell**:
   - Cyberpunk glassmorphism layout, responsive navigation, and sticky header.
   - Live debounced autocomplete search across model numbers, brands, and technical specs.
   - Route-based language switch (`/en` and `/zh`).
   - "My quote" sticky trigger with real-time reactive item count badge.
   - Comprehensive footer with genuine manufacturer verification notices.
   - Interactive quote cart drawer with quantity steppers (`-` / `+`), MOQ badges, and subtotal calculation.
   - Direct WhatsApp and WeChat inquiry links with pre-formatted quote payloads.

2. **Home Page**:
   - High-impact robotics hero banner with key procurement metrics.
   - Category tiles for all 11 core hardware segments with real inventory counters.
   - Featured robot parts showcase with live cart addition.
   - 5 Enterprise service tiles (Distribution, Rental, Education, Repair, Reseller).
   - "Robots in motion" video showcase with interactive video playback modal.
   - "Guides & Robot news" technical advisory teaser with reader modal.
   - Hardware manufacturer & creator WhatsApp submission banner.

3. **Catalogue Page & Advanced Filtering**:
   - Category tabs with real-time product counts.
   - Dynamic brand dropdown scoped to active categories.
   - **"Fits which robot" compatibility filter** (`Unitree G1`, `Unitree Go2`, `Unitree R1`, `AgiBot X2`, `Dobot Magician`, `Universal / Modular`).
   - Alphabetical, price, and custom quote priority sorting.
   - Search with instant clear button.
   - Family grouping cards for humanoid series (e.g. Unitree G1 Series) with interactive variant selector modal.
   - Pagination with query persistence.
