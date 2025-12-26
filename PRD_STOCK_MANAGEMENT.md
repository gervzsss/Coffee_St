# Product Requirements Document (PRD)
## Stock Management & Inventory Control System

---

### Document Information
- **Feature Name**: Stock Management & Inventory Control
- **Version**: 1.0
- **Date**: December 26, 2025
- **Status**: Draft
- **Owner**: Coffee St. Development Team

---

## 1. Executive Summary

This PRD outlines the implementation of a comprehensive stock management system for Coffee St., enabling real-time inventory tracking, automated stock alerts, and customer-facing availability information. The system will prevent overselling, provide admins with inventory control, and enhance the customer experience with accurate product availability.

---

## 2. Background & Context

### 2.1 Current State
- Products have an `is_available` boolean toggle (manual admin control)
- No inventory tracking or quantity management
- No automated sold-out notifications
- No prevention of overselling
- Customers have no visibility into stock levels

### 2.2 Problem Statement
Without inventory management:
- Risk of selling products that are out of stock
- Manual work required to mark items unavailable
- No data-driven restocking decisions
- Poor customer experience when orders can't be fulfilled
- No early warning system for low stock

### 2.3 Opportunity
Implementing stock management will:
- Automate availability management
- Prevent order fulfillment issues
- Provide data for business decisions
- Improve customer trust and satisfaction
- Reduce manual administrative burden

---

## 3. Goals & Objectives

### 3.1 Primary Goals
1. **Accurate Inventory**: Real-time stock tracking for all products
2. **Prevent Overselling**: Customers can only purchase available quantity
3. **Automated Notifications**: Alert admins when products need restocking
4. **Admin Control**: Easy stock quantity updates and management
5. **Customer Transparency**: Clear stock status visibility

### 3.2 Success Metrics
- Zero overselling incidents
- 95% reduction in manual availability updates
- < 2 hour average response time to low stock alerts
- 100% order fulfillment rate for in-stock items
- Improved customer satisfaction scores

### 3.3 Non-Goals (Out of Scope)
- Multi-warehouse inventory management
- Automatic reordering from suppliers
- Historical inventory reporting/analytics (Phase 2)
- Predictive stock forecasting (Phase 2)
- Barcode/SKU scanning system

---

## 4. User Personas & Stories

### 4.1 Admin User
**Persona**: Coffee shop manager/administrator managing daily operations

**User Stories**:
- As an admin, I want to set initial stock quantities for products so customers know what's available
- As an admin, I want to receive notifications when products are sold out so I can restock promptly
- As an admin, I want to receive low stock warnings so I can restock before running out
- As an admin, I want to easily update stock quantities after receiving shipments
- As an admin, I want to see stock levels at a glance in the products list
- As an admin, I want stock to automatically decrease when orders are placed
- As an admin, I want to manually adjust stock for damaged/expired items
- As an admin, I want to see which products need immediate attention

### 4.2 Customer User
**Persona**: Coffee shop customer browsing and purchasing products

**User Stories**:
- As a customer, I want to see if a product is in stock before adding to cart
- As a customer, I want to see how many items are available for low-stock products
- As a customer, I want to be prevented from ordering more than the available quantity
- As a customer, I want to see "Sold Out" badges on unavailable products
- As a customer, I want my cart to reflect stock availability during checkout
- As a customer, I want to be notified if items in my cart become unavailable

---

## 5. Functional Requirements

### 5.1 Stock Quantity Management

#### 5.1.1 Database Schema
**New Fields for `products` table**:
```sql
stock_quantity (integer, nullable) - Current available stock
  - NULL = unlimited/no tracking
  - 0 = sold out
  - > 0 = available quantity

track_stock (boolean, default: false) - Whether to track stock for this product

low_stock_threshold (integer, nullable, default: 5) - Alert threshold

stock_updated_at (timestamp, nullable) - Last stock modification time
```

**New Table: `stock_logs`** (for audit trail):
```sql
id (bigint, primary key)
product_id (bigint, foreign key)
admin_user_id (bigint, foreign key, nullable)
order_id (bigint, foreign key, nullable)
quantity_change (integer) - Can be negative or positive
quantity_before (integer)
quantity_after (integer)
reason (enum: 'sale', 'restock', 'adjustment', 'damaged', 'expired', 'returned')
notes (text, nullable)
created_at (timestamp)
```

**New Table: `stock_notifications`**:
```sql
id (bigint, primary key)
product_id (bigint, foreign key)
notification_type (enum: 'sold_out', 'low_stock')
is_read (boolean, default: false)
is_resolved (boolean, default: false)
created_at (timestamp)
resolved_at (timestamp, nullable)
```

#### 5.1.2 Stock Tracking Toggle
- Each product has a `track_stock` boolean field
- When enabled:
  - `stock_quantity` field becomes active
  - Stock decreases with each sale
  - Sold-out logic applies
- When disabled:
  - Product treated as always available (existing behavior)
  - `stock_quantity` value ignored

#### 5.1.3 Stock Update Operations
**Admin can update stock via**:
1. Manual entry in product edit form
2. Quick update from products list view
3. Bulk stock adjustment (future enhancement)

**Stock auto-decreases when**:
1. Order is successfully placed
2. Order status changes to "confirmed" or "paid"

**Stock auto-increases when**:
1. Order is cancelled before fulfillment
2. Order is refunded/returned (future)

### 5.2 Availability Toggle Integration

#### 5.2.1 Relationship Between Stock and Availability
**Proposed Logic** (Recommended Approach):

```
Product Display Status = {
  if (!track_stock) {
    return is_available ? "Available" : "Unavailable"
  }
  
  if (stock_quantity === 0) {
    return "Sold Out"  // Automatically unavailable
  }
  
  if (stock_quantity > 0 && !is_available) {
    return "Unavailable"  // Manually disabled
  }
  
  if (stock_quantity > 0 && is_available) {
    return "Available"
  }
}
```

**Key Rules**:
1. **Stock = 0** → Product automatically becomes unavailable (cannot purchase)
2. **`is_available` toggle** → Manual override (admin can disable even with stock)
3. **Stock > 0 + is_available = true** → Product is purchaseable
4. **No stock tracking** → Relies solely on `is_available` toggle

**Why This Approach**:
- ✅ Stock depletion naturally marks items unavailable
- ✅ Admins retain manual control via toggle
- ✅ Toggle can temporarily disable in-stock items (quality issues, seasonal, etc.)
- ✅ Clear hierarchy: stock quantity overrides availability when depleted
- ✅ Backward compatible with existing products

**UI Behavior**:
- When stock = 0, display "Sold Out" badge (red)
- When stock > 0 but is_available = false, display "Unavailable" badge (gray)
- When not tracking stock and is_available = false, display "Unavailable" badge (gray)
- When available, display stock quantity if < low_stock_threshold

### 5.3 Customer-Facing Features

#### 5.3.1 Product Display
**Products Page**:
- Show "Sold Out" overlay badge on product cards when stock = 0
- Show "Only X left!" badge when stock ≤ low_stock_threshold
- Disable "Add to Cart" button for sold out items
- Show "Unavailable" badge when manually disabled

**Product Detail Page** (future):
- Display remaining quantity for low stock items
- Show availability status prominently
- Prevent quantity selection beyond available stock

#### 5.3.2 Cart Validation
**When Adding to Cart**:
- Check current stock quantity
- Prevent adding if quantity exceeds available stock
- Show error message: "Only X items available"
- If stock = 0, show "This item is currently sold out"

**Cart Page**:
- Validate stock before proceeding to checkout
- Display warnings for items with updated stock
- Auto-adjust quantities if stock decreased
- Remove items that became unavailable

**Checkout**:
- Final stock validation before order placement
- Lock stock during checkout process (future: reserved stock)
- Handle race conditions (multiple users buying last item)

#### 5.3.3 Order Placement
**Stock Deduction Flow**:
1. User clicks "Place Order"
2. System validates stock availability (transaction)
3. If available: deduct stock + create order
4. If insufficient: reject order + show error
5. Log stock change in `stock_logs`

### 5.4 Admin Notifications

#### 5.4.1 Notification Types
1. **Sold Out Alert**
   - Triggered when: stock_quantity reaches 0
   - Priority: High
   - Message: "Product '[Name]' is sold out"
   - Action: Restock Now button

2. **Low Stock Warning**
   - Triggered when: stock_quantity ≤ low_stock_threshold
   - Priority: Medium
   - Message: "Product '[Name]' is running low (X remaining)"
   - Action: Update Stock button

#### 5.4.2 Notification Delivery
**In-App Notifications**:
- Badge counter in admin sidebar
- Notification panel/dropdown in admin header
- Real-time updates (no page refresh required)

**Email Notifications** (Phase 2):
- Daily digest of sold-out items
- Immediate alert for high-priority items
- Admin email preferences

#### 5.4.3 Notification Management
- Mark as read (dismisses from active list)
- Mark as resolved (after restocking)
- Snooze notification (remind later)
- Notification history view

### 5.5 Admin UI Requirements

#### 5.5.1 Products List Page
**New Columns**:
- **Stock Status**: Visual indicator (icon + color)
  - 🟢 Healthy (stock > threshold)
  - 🟡 Low Stock (stock ≤ threshold)
  - 🔴 Sold Out (stock = 0)
  - ⚪ Not Tracked (track_stock = false)
  
- **Stock Quantity**: Numeric display with quick edit
  - Click to edit inline
  - Shows "N/A" if not tracking

**Filters**:
- Show only sold-out products
- Show only low-stock products
- Show only products needing attention

**Bulk Actions** (future):
- Bulk stock update (CSV import)
- Bulk enable/disable stock tracking

#### 5.5.2 Product Edit Form
**Stock Management Section**:
```
┌─────────────────────────────────────┐
│ Stock Management                    │
├─────────────────────────────────────┤
│ ☑ Track inventory for this product │
│                                     │
│ Current Stock: [_100_] items       │
│                                     │
│ Low Stock Alert: [__5__] items     │
│                                     │
│ Last Updated: Dec 26, 2025 2:30 PM │
│                                     │
│ [Update Stock] [View History]      │
└─────────────────────────────────────┘
```

**Stock Update Modal**:
```
┌─────────────────────────────────────┐
│ Update Stock - Cappuccino           │
├─────────────────────────────────────┤
│ Current Stock: 15 items             │
│                                     │
│ Adjustment Type:                    │
│ ○ Add Stock (Restock)              │
│ ○ Remove Stock (Damage/Expired)    │
│ ○ Set Exact Quantity               │
│                                     │
│ Quantity: [____]                    │
│                                     │
│ Reason:                             │
│ ▼ Received Shipment                │
│                                     │
│ Notes (optional):                   │
│ [________________________]          │
│                                     │
│ New Stock: 0 items                  │
│                                     │
│ [Cancel] [Update Stock]             │
└─────────────────────────────────────┘
```

#### 5.5.3 Stock History View
- Tabular view of all stock changes
- Filters: date range, reason, admin user
- Export to CSV
- Shows before/after quantities
- Links to related orders

#### 5.5.4 Dashboard Widget
**Stock Overview Card**:
- Total products tracking stock
- Sold out count (red badge)
- Low stock count (yellow badge)
- Quick link to problem products

---

## 6. Technical Specifications

### 6.1 Backend Changes

#### 6.1.1 Database Migrations
1. Add columns to `products` table
2. Create `stock_logs` table
3. Create `stock_notifications` table
4. Seed low_stock_threshold default values

#### 6.1.2 API Endpoints

**Products**:
```
GET    /api/admin/products
       - Add stock fields to response
       - Add ?filter=low_stock,sold_out params

GET    /api/admin/products/{id}
       - Include stock details

POST   /api/admin/products/{id}/stock
       - Update stock quantity
       Request: { 
         adjustment_type: 'add|remove|set',
         quantity: number,
         reason: string,
         notes?: string
       }
       Response: updated product + stock_log entry

GET    /api/admin/products/{id}/stock-history
       - Return stock_logs for product

PATCH  /api/admin/products/{id}
       - Include track_stock, low_stock_threshold updates
```

**Notifications**:
```
GET    /api/admin/notifications/stock
       - Return unread/unresolved stock notifications
       Response: {
         sold_out: [...],
         low_stock: [...],
         unread_count: number
       }

PATCH  /api/admin/notifications/{id}
       - Mark as read/resolved
       Request: { is_read?: boolean, is_resolved?: boolean }

POST   /api/admin/notifications/{id}/snooze
       - Snooze notification (future)
```

**Customer-Side**:
```
GET    /api/products
       - Include stock_quantity if < low_stock_threshold
       - Include is_in_stock boolean

POST   /api/cart/items
       - Validate stock before adding
       - Return error if insufficient stock

POST   /api/orders
       - Transaction with stock deduction
       - Rollback if stock insufficient
```

#### 6.1.3 Business Logic

**StockService Class**:
```php
class StockService {
  // Check if product has sufficient stock
  public function hasStock(Product $product, int $quantity): bool
  
  // Decrease stock (on order placement)
  public function decreaseStock(Product $product, int $quantity, Order $order): void
  
  // Increase stock (on order cancellation)
  public function increaseStock(Product $product, int $quantity, ?Order $order = null): void
  
  // Update stock with reason
  public function updateStock(Product $product, int $quantity, string $reason, ?User $admin, ?string $notes): StockLog
  
  // Check if stock is low and create notification
  public function checkLowStock(Product $product): void
  
  // Get products needing attention
  public function getProductsNeedingAttention(): Collection
}
```

**Order Event Listeners**:
```php
OrderPlaced -> Decrease stock + log
OrderCancelled -> Increase stock + log
OrderRefunded -> Increase stock + log (future)
```

**Notification Logic**:
```php
// After stock decrease
if ($product->track_stock && $product->stock_quantity === 0) {
  StockNotification::create([
    'product_id' => $product->id,
    'notification_type' => 'sold_out'
  ]);
}

if ($product->track_stock && 
    $product->stock_quantity <= $product->low_stock_threshold &&
    $product->stock_quantity > 0) {
  StockNotification::create([
    'product_id' => $product->id,
    'notification_type' => 'low_stock'
  ]);
}
```

#### 6.1.4 Database Transactions
- Order placement must use database transactions
- Stock check + deduction must be atomic
- Handle concurrent order attempts (pessimistic locking)

```php
DB::transaction(function () use ($order, $items) {
  foreach ($items as $item) {
    $product = Product::lockForUpdate()->find($item['product_id']);
    
    if (!$product->hasStock($item['quantity'])) {
      throw new InsufficientStockException();
    }
    
    $product->decreaseStock($item['quantity'], $order);
  }
  
  $order->save();
});
```

### 6.2 Frontend Changes

#### 6.2.1 Customer UI Components

**ProductCard Component**:
```jsx
// Add stock badges
{product.is_sold_out && (
  <span className="badge-sold-out">Sold Out</span>
)}

{product.is_low_stock && product.stock_quantity && (
  <span className="badge-low-stock">
    Only {product.stock_quantity} left!
  </span>
)}

// Disable button if sold out
<button 
  disabled={product.is_sold_out || !product.is_available}
>
  {product.is_sold_out ? 'Sold Out' : 'Add to Cart'}
</button>
```

**Cart Validation**:
```jsx
// Before checkout
const validateCart = async () => {
  const response = await api.validateCartStock();
  
  if (response.has_errors) {
    // Show warnings/errors
    // Auto-adjust quantities
    // Remove unavailable items
  }
};
```

#### 6.2.2 Admin UI Components

**StockStatusBadge Component**:
```jsx
const StockStatusBadge = ({ product }) => {
  if (!product.track_stock) {
    return <Badge color="gray">Not Tracked</Badge>;
  }
  
  if (product.stock_quantity === 0) {
    return <Badge color="red" icon="⚠️">Sold Out</Badge>;
  }
  
  if (product.stock_quantity <= product.low_stock_threshold) {
    return <Badge color="yellow" icon="⚠">Low Stock</Badge>;
  }
  
  return <Badge color="green" icon="✓">In Stock</Badge>;
};
```

**StockUpdateModal Component**:
- Input for quantity adjustment
- Dropdown for reason selection
- Textarea for notes
- Real-time calculation of new stock level

**NotificationDropdown Component**:
- Dropdown in admin header
- Badge with unread count
- Grouped by priority (sold-out first)
- Quick actions (view product, mark resolved)

**StockHistoryTable Component**:
- Sortable/filterable table
- Date range picker
- Reason filter
- Export functionality

---

## 7. UI/UX Design Specifications

### 7.1 Visual Design

#### Stock Status Colors
- 🟢 **Healthy Stock**: Green (#10B981)
- 🟡 **Low Stock**: Yellow/Amber (#F59E0B)
- 🔴 **Sold Out**: Red (#EF4444)
- ⚪ **Not Tracked**: Gray (#6B7280)

#### Badge Styles
- **Sold Out**: Red background, white text, prominent
- **Low Stock**: Yellow background, dark text, medium emphasis
- **Unavailable**: Gray background, white text, medium emphasis
- **Only X left**: Orange background, white text, small

### 7.2 User Flows

#### Admin: Restock Product Flow
1. Admin receives notification (sold out/low stock)
2. Clicks notification → redirects to product
3. Clicks "Update Stock" button
4. Modal opens with current stock
5. Selects "Add Stock" + enters quantity + reason
6. Clicks "Update Stock"
7. Success message shown
8. Stock updated + notification marked resolved
9. Stock history logged

#### Customer: Purchasing Last Item Flow
1. Customer views product (shows "Only 1 left!")
2. Adds to cart
3. Another customer simultaneously adds same item
4. First customer proceeds to checkout
5. Second customer sees "This item is no longer available"
6. Stock correctly decremented once
7. Losing customer's cart auto-updates

---

## 8. Business Rules & Edge Cases

### 8.1 Core Business Rules

1. **Stock cannot go negative**: Validation prevents over-selling
2. **Zero stock = sold out**: Automatic unavailability
3. **Manual toggle overrides stock**: Admin can disable available items
4. **No tracking = unlimited**: Products without tracking always available (if toggle on)
5. **Notifications created once**: Don't duplicate alerts
6. **Admin changes logged**: All adjustments tracked for audit

### 8.2 Edge Cases

#### Scenario 1: Race Condition (Multiple Users, Last Item)
- **Problem**: Two users try to buy last item simultaneously
- **Solution**: Database pessimistic locking + transaction
- **Behavior**: First completed checkout wins, second sees error

#### Scenario 2: Cart Sitting for Hours
- **Problem**: User adds item to cart, stock sells out, user checks out later
- **Solution**: Validate stock at checkout, not just when adding
- **Behavior**: Show error, remove item, allow user to continue with remaining items

#### Scenario 3: Admin Updates Stock While Order Processing
- **Problem**: Admin adds stock during checkout process
- **Solution**: Transaction isolation ensures consistency
- **Behavior**: Order uses stock state at transaction start

#### Scenario 4: Order Cancellation After Partial Fulfillment
- **Problem**: Should stock be returned if order partially shipped?
- **Solution**: Phase 1 - return full stock on cancellation
- **Future**: Track item-level fulfillment status

#### Scenario 5: Negative Adjustment Exceeds Current Stock
- **Problem**: Admin tries to remove 10 items but only 5 in stock
- **Solution**: Validation prevents adjustment, show error
- **Behavior**: "Cannot remove more items than current stock"

#### Scenario 6: Enabling Stock Tracking Mid-Operations
- **Problem**: Product has existing orders, admin enables tracking
- **Solution**: Require admin to set initial stock quantity
- **Behavior**: Modal prompts for starting stock count

#### Scenario 7: Product Variants (Future)
- **Problem**: Variants have separate stock levels
- **Solution**: Out of scope for Phase 1 (track product-level only)
- **Future**: Add stock_quantity to product_variants table

---

## 9. Implementation Phases

### Phase 1: Core Stock Management (MVP) - Week 1-2
**Backend**:
- Database migrations (products table updates)
- StockService class
- Basic API endpoints (update stock, get products)
- Stock deduction on order placement

**Frontend Admin**:
- Stock quantity field in product form
- Stock status column in products list
- Basic stock update modal

**Frontend Customer**:
- Display sold-out badge
- Disable add-to-cart for sold-out items
- Basic cart validation

**Deliverables**:
- Stock tracking works end-to-end
- Orders deduct stock correctly
- Admins can manually update stock

### Phase 2: Notifications & Alerts - Week 3
**Backend**:
- Stock notifications table
- Notification creation logic
- Notification API endpoints

**Frontend Admin**:
- Notification dropdown in header
- Notification badge counter
- Mark as read/resolved functionality

**Deliverables**:
- Admins receive sold-out alerts
- Admins receive low-stock warnings
- Notifications can be managed

### Phase 3: Enhanced UX & History - Week 4
**Backend**:
- Stock logs table
- Stock history API endpoint
- Advanced filtering

**Frontend Admin**:
- Stock history view
- Inline quick-edit for stock
- Filters (sold-out, low-stock)

**Frontend Customer**:
- "Only X left" badges
- Enhanced cart validation with messages
- Stock checks at multiple points

**Deliverables**:
- Full audit trail of stock changes
- Better customer experience with stock visibility
- Advanced admin filtering and controls

### Phase 4: Polish & Optimization - Week 5
**All Areas**:
- Performance optimization (caching, indexing)
- Comprehensive testing
- Bug fixes
- Documentation
- Admin user guide

**Deliverables**:
- Production-ready system
- Complete test coverage
- User documentation

---

## 10. Testing Requirements

### 10.1 Unit Tests
- StockService methods
- Stock validation logic
- Notification creation logic
- Stock calculation accuracy

### 10.2 Integration Tests
- Order placement decreases stock
- Order cancellation increases stock
- Concurrent order handling
- API endpoint responses

### 10.3 End-to-End Tests
- Complete purchase flow with stock deduction
- Admin stock update flow
- Notification creation and management
- Cart validation scenarios

### 10.4 Load/Stress Tests
- Concurrent checkouts for last item
- High-volume order processing
- Notification system under load

### 10.5 User Acceptance Testing
- Admin can easily update stock
- Notifications are helpful and timely
- Customer experience is smooth
- No overselling occurs

---

## 11. Security & Performance Considerations

### 11.1 Security
- **Authorization**: Only admins can update stock
- **Validation**: Server-side validation for all stock changes
- **Audit Trail**: All changes logged with user ID
- **Transaction Safety**: Prevent race conditions with locking

### 11.2 Performance
- **Database Indexing**: 
  - Index on `stock_quantity` for filtering
  - Index on `track_stock` for queries
  - Composite index on (track_stock, stock_quantity)
  
- **Caching**:
  - Cache product availability status
  - Invalidate cache on stock updates
  
- **Query Optimization**:
  - Eager load relationships
  - Use database-level atomic operations
  
- **Background Jobs**:
  - Send email notifications via queue
  - Generate stock reports asynchronously

### 11.3 Monitoring
- Alert on frequent stock-out situations
- Monitor order failure rate due to stock
- Track notification response times
- Log race condition occurrences

---

## 12. Future Enhancements (Phase 2+)

### 12.1 Advanced Features
1. **Reserved Stock**: Hold stock during checkout process
2. **Backorder Support**: Allow orders when out of stock
3. **Auto-Restock**: Integration with supplier systems
4. **Predictive Analytics**: Forecast stock needs based on sales
5. **Multi-Location**: Track stock across multiple locations
6. **Variant-Level Stock**: Independent tracking for product variants
7. **Bundled Products**: Stock management for product bundles
8. **Stock Transfer**: Move stock between locations
9. **Expiration Tracking**: FIFO inventory for perishables
10. **Low Stock Auto-Hide**: Automatically hide products from storefront

### 12.2 Reporting & Analytics
1. **Stock Reports**: Daily/weekly/monthly stock summaries
2. **Sales Velocity**: Track how fast products sell
3. **Restock Recommendations**: AI-driven restocking suggestions
4. **Waste Tracking**: Monitor expired/damaged inventory
5. **Profitability Analysis**: Stock value vs. revenue

### 12.3 Integration Opportunities
1. **Email Notifications**: Configurable admin alerts
2. **SMS Alerts**: Critical low-stock notifications
3. **Slack/Discord**: Team notifications
4. **Inventory Management Systems**: Third-party integrations
5. **POS Systems**: Sync with physical store inventory

---

## 13. Success Criteria & KPIs

### 13.1 Launch Criteria
- ✅ All Phase 1 features implemented and tested
- ✅ Zero overselling in testing
- ✅ Admin can update stock in < 30 seconds
- ✅ Notifications delivered within 1 minute of trigger
- ✅ Load testing passed (100 concurrent orders)
- ✅ Documentation complete

### 13.2 Key Performance Indicators
**Technical**:
- Stock accuracy: 100%
- Order rejection rate due to stock: < 1%
- API response time: < 200ms for stock checks
- Notification delivery time: < 1 minute

**Business**:
- Overselling incidents: 0
- Manual availability updates: -95%
- Average restock response time: < 2 hours
- Customer complaints about availability: -80%
- Order fulfillment rate: > 99%

**User Experience**:
- Admin satisfaction score: > 4.5/5
- Time to update stock: < 30 seconds
- Customer cart abandonment due to stock: < 5%

---

## 14. Risks & Mitigation

### 14.1 Technical Risks

| Risk                                         | Impact | Likelihood | Mitigation                      |
| -------------------------------------------- | ------ | ---------- | ------------------------------- |
| Race conditions causing overselling          | High   | Medium     | Database locking, transactions  |
| Performance degradation with high traffic    | High   | Low        | Caching, indexing, load testing |
| Data inconsistency between cart and checkout | Medium | Medium     | Multiple validation points      |
| Notification spam overwhelming admins        | Medium | Low        | Smart grouping, snooze feature  |

### 14.2 Business Risks

| Risk                                          | Impact | Likelihood | Mitigation                           |
| --------------------------------------------- | ------ | ---------- | ------------------------------------ |
| Users frustrated by stock limitations         | Medium | Medium     | Clear messaging, low-stock alerts    |
| Initial stock data entry burden               | Low    | High       | Bulk import tools, optional tracking |
| Over-conservative stock leading to lost sales | Medium | Low        | Analytics to optimize thresholds     |
| Resistance to new admin workflows             | Low    | Medium     | Training, intuitive UI               |

---

## 15. Dependencies & Prerequisites

### 15.1 Technical Dependencies
- Laravel framework (existing)
- React frontend (existing)
- PostgreSQL database (existing)
- Queue system for background jobs
- Real-time notification system (WebSockets/Polling)

### 15.2 Data Requirements
- Product data cleaning (ensure data quality)
- Initial stock quantities (admin data entry)
- Low stock thresholds (per product or global default)

### 15.3 Team Requirements
- Backend developer (migrations, API, logic)
- Frontend developer (admin UI, customer UI)
- UI/UX designer (notification designs, badges)
- QA engineer (comprehensive testing)

---

## 16. Documentation Requirements

### 16.1 Technical Documentation
- API endpoint documentation
- Database schema documentation
- StockService class documentation
- Integration guide for developers

### 16.2 User Documentation
- Admin user guide: "How to Manage Stock"
- Admin user guide: "Understanding Notifications"
- FAQ: Common stock management questions
- Video tutorial: Stock management walkthrough

### 16.3 Process Documentation
- Stock update standard operating procedure
- Incident response: Overselling event
- Restocking workflow
- Inventory audit process

---

## 17. Questions & Decisions Needed

### 17.1 Open Questions
1. **Stock Reservation**: Should we reserve stock during checkout or only deduct on order completion?
2. **Variant Support**: Start with product-level or wait for variant-level stock tracking?
3. **Notification Channels**: Email immediately or just in-app for Phase 1?
4. **Historical Data**: How long to retain stock logs (forever vs. archiving)?
5. **Unlimited Stock**: Use NULL vs. -1 vs. large number to represent unlimited?

### 17.2 Design Decisions Made
1. **Availability Toggle + Stock**: Stock = 0 auto-disables, toggle provides manual override ✅
2. **Stock Tracking Toggle**: Per-product opt-in (backward compatible) ✅
3. **Notification Priority**: Sold-out > low-stock > resolved ✅
4. **Customer Visibility**: Show quantity only when low stock ✅
5. **Audit Trail**: Log all stock changes forever (compliance) ✅

### 17.3 Decisions Needed From Stakeholders
1. **Low Stock Threshold**: Global default of 5 items? Product-specific?
2. **Email Notifications**: Immediate, daily digest, or configurable?
3. **Cart Expiry**: Should cart items expire after X hours?
4. **Backorders**: Support in Phase 1 or defer to Phase 2?
5. **Stock Display**: Show exact quantity or just "low stock" message?

---

## 18. Appendix

### 18.1 Glossary
- **Stock Quantity**: Current available inventory count
- **Track Stock**: Boolean indicating whether to enforce stock limits
- **Low Stock Threshold**: Trigger point for low stock warnings
- **Sold Out**: State when stock quantity = 0
- **Stock Log**: Audit record of stock change
- **Stock Notification**: Alert for admins about stock status
- **Availability Toggle**: Manual admin control to enable/disable product
- **Race Condition**: Multiple users attempting to purchase last item simultaneously
- **Pessimistic Locking**: Database technique to prevent concurrent modifications

### 18.2 References
- Laravel Database Transactions: https://laravel.com/docs/database#database-transactions
- Inventory Management Best Practices
- E-commerce Stock Management Patterns
- Race Condition Handling in Web Applications

### 18.3 Revision History

| Version | Date         | Author   | Changes       |
| ------- | ------------ | -------- | ------------- |
| 1.0     | Dec 26, 2025 | Dev Team | Initial draft |

---

## Approval & Sign-off

| Role           | Name | Signature | Date |
| -------------- | ---- | --------- | ---- |
| Product Owner  |      |           |      |
| Tech Lead      |      |           |      |
| UI/UX Designer |      |           |      |
| QA Lead        |      |           |      |

---

**End of Document**
