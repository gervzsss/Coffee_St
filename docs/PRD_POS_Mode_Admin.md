# PRD: Admin POS (Point of Sale) Mode

**Project:** Coffee St

**Document owner:** Product + Engineering

**Date:** 2026-01-19

**Status:** Draft

---

## 1) Summary

Add a dedicated **POS Mode** inside the existing Admin Dashboard (React SPA) that, when enabled, switches the admin interface into a simplified point‑of‑sale experience for walk‑in customers.

While POS Mode is enabled:
- The UI is restricted to POS workflows (create POS order, manage POS orders).
- All other admin capabilities (dashboard analytics, user management, product management, inquiries, etc.) are disabled/hidden to reduce distraction and misuse.

POS orders must be distinguished from regular website orders using a durable classification:
- **In‑store (POS)**
- **Online (Website)**

POS orders follow the same order pipeline as existing orders, **except they must not include delivery-specific statuses** (e.g., `out_for_delivery`).

---

## 2) Background / Current State (Codebase Analysis)

### 2.1 Current order model and status machine

Backend uses Laravel with an `Order` model that defines:
- Status constants: `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `failed`, `cancelled`
- Valid transitions (currently unconditional):
  - `pending → confirmed | cancelled`
  - `confirmed → preparing | cancelled`
  - `preparing → out_for_delivery | cancelled`
  - `out_for_delivery → delivered | failed`
  - `delivered | failed | cancelled → (terminal)`

This is implemented in:
- [backend/app/Models/Order.php](../backend/app/Models/Order.php)

### 2.2 Existing APIs

Customer (website) order APIs:
- `POST /api/orders` creates an order from the user cart and requires delivery fields (`delivery_address`, `delivery_contact`, etc.).

Admin order APIs:
- `GET /api/admin/orders` list
- `GET /api/admin/orders/{id}` detail
- `PATCH /api/admin/orders/{id}/status` status update with validation based on `Order::getValidTransitions()`

Admin routes are in:
- [backend/routes/admin.php](../backend/routes/admin.php)

### 2.3 Current schema constraints

`orders` table (consolidated migration) currently includes:
- Required `user_id` (FK to `users`, non-null)
- Delivery-related columns exist and are nullable (`delivery_address`, `delivery_contact`, `delivery_instructions`, `out_for_delivery_at`, `delivery_proof_url`)
- No column exists today to represent **order origin/source**

Schema is in:
- [backend/database/migrations/2025_01_01_000000_create_all_tables_consolidated.php](../backend/database/migrations/2025_01_01_000000_create_all_tables_consolidated.php)

### 2.4 Current admin UI structure

Admin SPA routes are:
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/users`
- `/admin/inquiries`

Admin navigation is in:
- [frontend/src/admin/components/layout/AdminSidebar.jsx](../frontend/src/admin/components/layout/AdminSidebar.jsx)

Admin uses `frontend/src/admin/constants/orderStatus.js` for status labels and next-step options.

---

## 3) Goals and Non‑Goals

### 3.1 Goals

1. Add **POS Mode toggle** inside admin.
2. When enabled, restrict admin UI to POS features only.
3. Allow an admin/staff member to create **POS orders** for walk‑in customers.
4. Ensure POS orders use an order workflow that **excludes delivery-only states** (notably `out_for_delivery`).
5. Persist and expose the order **source** (`pos` vs `online`) end-to-end (DB → API → UI) so reporting and filtering are possible.

### 3.2 Non‑Goals (Phase 1)

- Integrating card terminals, cash drawer hardware, barcode scanners, receipt printers.
- Advanced POS features: refunds, returns, split payments, tips, table management.
- Full offline-first operation.
- Multi-location store support.

---

## 4) Users / Personas

- **Admin/Owner**: Can toggle POS mode, configure store defaults, oversee all orders.
- **Staff/Cashier**: Uses POS mode daily to create and complete walk‑in orders quickly.

---

## 5) Requirements

### 5.1 POS Mode toggle

**Functional requirements**
- A visible toggle in the admin UI: `POS Mode: On/Off`.
- When turned **On**:
  - Navigation and routing restrict to POS screens.
  - Non-POS screens must be inaccessible even via direct URL.
  - (Optional) Display a strong visual indicator (banner) “POS MODE” so staff knows they are in restricted mode.
- When turned **Off**:
  - Full admin navigation returns.

**Persistence**
- Phase 1: persist per-browser using `localStorage`.
- Phase 2 (optional): persist per-admin account in backend settings.

**Security note**: POS mode is a UI restriction; backend still enforces admin auth and permissions. We should also add backend-side checks for any new POS-only APIs.

### 5.2 Order source classification

Add a durable attribute to `orders`:
- `order_source` enum: `online`, `pos`

Rules:
- Orders created via existing website checkout must be `online`.
- Orders created via new POS flow must be `pos`.
- Admin list endpoints must support filtering by `order_source`.

### 5.3 POS order workflow (no delivery statuses)

POS orders should follow a status path compatible with current system but excluding delivery steps.

**Proposed POS status transitions**
- `pending → confirmed | cancelled`
- `confirmed → preparing | cancelled`
- `preparing → delivered | cancelled`
- `delivered → (terminal)`

Notes:
- `out_for_delivery` is not valid for `pos` orders.
- `failed` is optional for POS. If retained, it must not be labeled “Delivery Failed” in POS UI.
  - Recommendation for Phase 1: **do not use `failed` for POS**; use `cancelled` for voided orders.

**Backend rule**: transition validation must depend on `order_source`.

### 5.4 POS order creation

From POS Mode, staff can create an order by selecting items and variants similarly to cart/checkout.

**Inputs**
- Items: product + quantity + selected variants
- Payment method: `cash` or `gcash` (existing enum)
- Notes (optional)
- Customer identity:
  - Minimal viable: Walk-in customer (no account) with optional name/phone

**Outputs**
- Creates an `Order` and `OrderItem`s and deducts stock using existing stock service logic.

**Important constraint (current DB/API):** `orders.user_id` is required today.

We must choose one of these implementation paths:

**Option A (least invasive): “Walk-in user” approach**
- Create/use a dedicated `users` record representing walk-in customers (e.g., `walkin@coffeest.local`).
- All POS orders link to that user.
- Pros: minimal changes to existing admin list/detail code which assumes `order->user` exists.
- Cons: customer identity and analytics for walk-ins are limited unless we also store name/phone on the order.

**Option B (more correct): Allow guest POS orders**
- Make `orders.user_id` nullable and introduce `customer_name`, `customer_phone` fields on orders.
- Update admin and user code paths that currently assume a user is always present.
- Pros: clean data model for walk-ins.
- Cons: broader refactor.

**PRD Recommendation:** Phase 1 uses **Option A** for speed, plus add optional order-level `pos_customer_name` / `pos_customer_phone` fields to preserve some identity when desired.

### 5.5 POS-only UI

In POS mode, expose only:
- **POS Home / New Sale**
- **Active POS Orders** (optional: show last N POS orders)
- **POS Order Detail** (status updates limited to POS transitions)

Everything else:
- Hidden from sidebar.
- Direct navigation blocked (redirect to `/admin/pos`).

### 5.6 Order management updates

Admin order list and detail views should add:
- `Order Source` pill/badge: `Online` or `In-store (POS)`.
- Filter controls by source.

Status dropdown behavior:
- For `online` orders, keep existing options.
- For `pos` orders, hide `out_for_delivery` (and optionally `failed`) from UI.

---

## 6) UX / User Flows

### 6.1 Toggle POS mode

1. Admin logs in.
2. In admin header or sidebar, clicks “POS Mode”.
3. Confirm modal: “Switch to POS Mode? This will limit access to POS only.”
4. On confirm:
   - Set `posMode=true` in localStorage.
   - Redirect to `/admin/pos`.

### 6.2 Create POS order (New Sale)

1. Staff opens `/admin/pos`.
2. Searches products, selects items, configures variants.
3. Reviews cart summary.
4. Selects payment method.
5. (Optional) enters walk-in name/phone.
6. Places order.
7. System creates `Order` with `order_source=pos`, initial status `pending` (or `confirmed` if we want “instant confirm”).
8. Prints/Displays order number for in-store reference.

### 6.3 Complete POS order

1. Staff views POS order detail.
2. Updates status along POS transitions (`pending→confirmed→preparing→delivered`).

---

## 7) Backend Requirements (Proposed)

### 7.1 Data model changes

**Orders**
- Add `order_source` enum with values: `online`, `pos` (default `online` for backfill).
- Add optional POS identity fields (if using Option A):
  - `pos_customer_name` (nullable)
  - `pos_customer_phone` (nullable)

**Indexes**
- Add index on `(order_source, status)` for admin filtering.

### 7.2 Transition validation changes

- Replace unconditional `Order::getValidTransitions($status)` with a method that considers source:
  - `Order::getValidTransitions($currentStatus, $orderSource)`
  - or instance method that uses `$this->order_source`

Admin `PATCH /orders/{id}/status` must:
- Validate `status` against source-specific allowed statuses.
- Continue creating `OrderStatusLog` as today.

### 7.3 New POS endpoints

Introduce admin endpoints (all under existing admin auth middleware):

- `POST /api/admin/pos/orders`
  - Creates a POS order directly (no user cart).
  - Validates stock similarly to user order creation.

- `GET /api/admin/pos/orders`
  - Lists POS orders (could reuse `/orders` with `order_source=pos`).

Note: We can avoid new list endpoints if we extend existing `/api/admin/orders` to filter by `order_source`.

---

## 8) Frontend Requirements (Proposed)

### 8.1 State + routing guard

- Add a `PosModeContext` in admin app.
- On app load, read `localStorage.posMode`.
- If POS mode enabled:
  - Only allow POS routes.
  - Any navigation to non-POS routes redirects to `/admin/pos`.

### 8.2 Sidebar/Header changes

- Add a POS toggle (likely in header action area or sidebar footer).
- In POS mode:
  - Sidebar items list replaced with POS-only links.
  - Prominent POS indicator.

### 8.3 POS screens

- `AdminPOSHome` (product list/search + current sale cart)
- `AdminPOSOrders` (recent POS orders)
- `AdminPOSOrderDetail` (status updates)

---

## 9) Reporting & Metrics

Minimum tracking:
- Count of POS orders per day/week.
- Revenue split by `order_source`.
- Average time from creation to delivered for POS orders.

---

## 10) Permissions / Security

- POS mode is a UI restriction; backend still requires admin auth.
- Only authenticated admins/staff can create POS orders.
- Consider creating a dedicated role in the future (cashier vs admin). Current codebase uses `users.is_admin` boolean only.

---

## 11) Acceptance Criteria

### POS Mode
- Toggling POS mode ON restricts admin UI to POS pages only.
- Direct URL access to `/admin/users`, `/admin/products`, etc. is blocked in POS mode.

### Order Source
- Every order has an `order_source` persisted and returned by admin order APIs.
- Admin order list shows a badge and supports filtering by source.

### POS Workflow
- POS orders cannot transition into `out_for_delivery`.
- Admin status update API rejects invalid transitions for POS orders with a clear error.

### POS Order Creation
- Staff can create a POS order that:
  - creates items and variants correctly
  - calculates subtotal/tax/total correctly
  - decreases stock when `track_stock=true`

---

## 12) Rollout Plan

Phase 1 (MVP):
- Add `order_source` + basic POS UI + POS order creation
- POS mode UI restriction (localStorage)

Phase 2:
- Better cashier UX (keyboard shortcuts, barcode)
- Backend-persisted POS mode preference
- Optional roles/permissions

---

## 13) Open Questions

1. Should POS orders require a customer record, or can they be guest-only?
2. Should POS orders start at `confirmed` automatically to reduce clicks?
3. For POS, do we need a concept of “paid” vs “unpaid”, or is payment method enough?
4. Should delivery fields be required/hidden for POS orders (recommended hidden)?

---

## 14) Appendix: Relevant Existing Components

- Order model & transitions: [backend/app/Models/Order.php](../backend/app/Models/Order.php)
- Admin order API: [backend/app/Http/Controllers/Admin/OrderController.php](../backend/app/Http/Controllers/Admin/OrderController.php)
- User order creation: [backend/app/Http/Controllers/User/OrderController.php](../backend/app/Http/Controllers/User/OrderController.php)
- Admin routes: [backend/routes/admin.php](../backend/routes/admin.php)
- Admin sidebar nav: [frontend/src/admin/components/layout/AdminSidebar.jsx](../frontend/src/admin/components/layout/AdminSidebar.jsx)
- Admin status constants: [frontend/src/admin/constants/orderStatus.js](../frontend/src/admin/constants/orderStatus.js)
