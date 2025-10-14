# Reports Page Documentation

## Overview
The Reports page provides comprehensive financial analytics for the Saludentis dental clinic management system. It displays key performance indicators (KPIs), trends, aging reports, and detailed tables for financial tracking.

## KPI Formulas and Data Sources

### 1. Total Revenue
**Formula:** `Σ Consultation.total` over the selected date range  
**Source:** [`Consultation`](../src/models/Consultation.ts) model  
**Field:** `total`  
**Description:** Sum of all consultation totals within the date range.

### 2. Collected Payments
**Formula:** `Σ Balance.balanceDetails.amount` over the selected date range  
**Source:** [`Balance`](../src/models/Balance.ts) model  
**Field:** `balanceDetails[].amount`  
**Description:** Sum of all payment amounts recorded in balance details.

### 3. Outstanding Balances (A/R)
**Formula:** `Σ Balance.balance` (point-in-time)  
**Source:** [`Balance`](../src/models/Balance.ts) model  
**Field:** `balance`  
**Description:** Current total of all patient balances owed.

### 4. Pending Collections
**Formula:** `Σ (BalanceDetail.total − BalanceDetail.amount)`  
**Source:** [`Balance`](../src/models/Balance.ts) model  
**Fields:** `balanceDetails[].total` and `balanceDetails[].amount`  
**Description:** Total amount of unpaid portions across all consultations.

### 5. Consultations Count
**Formula:** Count of [`Consultation`](../src/models/Consultation.ts) records in date range  
**Source:** Consultation model  
**Description:** Total number of consultations performed.

### 6. Patients Seen
**Formula:** Count of unique `patientId` values in consultations  
**Source:** [`Consultation`](../src/models/Consultation.ts) model  
**Field:** `patientId`  
**Description:** Number of unique patients who had consultations.

### 7. New Patients
**Formula:** Count of [`Patient`](../src/models/Patient.ts) records where `createdAt` is within date range  
**Source:** Patient model  
**Field:** `createdAt`  
**Description:** Number of patients registered during the period.

## Revenue by Period
**Grouping:** Consultations grouped by day/week/month based on `createdAt`  
**Implementation:** [`groupRevenueByPeriod()`](../src/utils/reportMetrics.ts:82)  
**Description:** Time-series data showing revenue and collections trends.

## A/R Aging Buckets
**Buckets:**
- 0-30 days
- 31-60 days
- 61-90 days
- >90 days

**Calculation:** Based on the oldest unpaid `balanceDetail.createdAt` for each patient  
**Implementation:** [`calculateARAgingBuckets()`](../src/utils/reportMetrics.ts:122)

## Patient Payment Status
**Logic:**
- `balance > 0` → Status: "Due"
- `balance <= 0` → Status: "Clear"

**Source:** [`Balance.balance`](../src/models/Balance.ts:33)

## Quotation Funnel
**Metrics:**
- **Total Quoted:** `Σ Quotation.total`
- **Converted Amount:** Sum of consultation totals for patients who had quotations
- **Conversion Rate:** `(Converted Amount / Total Quoted) × 100`

**Sources:**
- [`Quotation`](../src/models/Quotation.ts) model
- [`Consultation`](../src/models/Consultation.ts) model

## Payment Application (FIFO)
Payments are applied using First-In-First-Out logic as implemented in [`/api/patient/balance/[id].ts`](../src/pages/api/patient/balance/[id].ts:108).

**Process:**
1. Find oldest unpaid or partially paid consultation
2. Apply payment amount to that consultation
3. If payment exceeds consultation balance, apply remainder to next oldest
4. Continue until payment is fully allocated

## API Endpoints

### GET /api/reports
**Query Parameters:**
- `startDate` (required): ISO date string
- `endDate` (required): ISO date string
- `groupBy` (optional): 'day' | 'week' | 'month' (default: 'month')
- `page` (optional): Page number for patient balances pagination
- `pageSize` (optional): Items per page (default: 10)

**Response:** [`IReportsData`](../src/interfaces/reports.ts:47)

## Components

### Main Page
**Location:** [`src/pages/reportes/index.tsx`](../src/pages/reportes/index.tsx)

**Sections:**
1. **Filters Panel** - Date range, grouping, and filter controls
2. **KPI Summary Cards** - 7 key metrics displayed prominently
3. **Revenue & Collections Trend** - Line chart using Recharts
4. **A/R Aging** - Stacked bar chart showing aging buckets
5. **Top Treatments** - Table of top 10 treatments by revenue
6. **Top Patients** - Table of top 10 patients by outstanding balance
7. **Quotation Funnel** - Conversion metrics and visualization
8. **Patient Balances Table** - Paginated table with all patient balances
9. **Consultations Table** - Recent consultations with payment details

### Chart Components
**PieChart Wrapper:** [`src/components/Chart.tsx`](../src/components/Chart.tsx)  
Uses MUI X Charts PieChart internally, exported for use in reports.

**Line/Bar Charts:** Recharts library components

## Utility Functions

### Currency Formatting
**Function:** [`formatCurrency()`](../src/utils/reportMetrics.ts:182)  
**Format:** GTQ (Guatemalan Quetzal)  
**Example:** `Q1,234.56`

### Date Formatting
**Function:** [`formatDate()`](../src/utils/reportMetrics.ts:192)  
**Format:** `dd/MM/yyyy`  
**Example:** `15/03/2024`

## Export Functionality
**CSV Export:** Exports KPI summary to CSV file  
**Print:** Browser print dialog for printer-friendly output

## Responsive Design
- Mobile-first approach
- Grid system adapts from xs (12 cols) to md (6 cols) to lg (3-4 cols)
- Tables scroll horizontally on small screens
- Charts use ResponsiveContainer for fluid sizing

## Theme Integration
Uses existing Saludentis theme colors:
- Primary: `lightSeaGreen` (#0bc0c0)
- Secondary: `robinEggBlue` (#3dccc7)
- Accent: `purple` (#7600bc)
- Additional: `tiffanyBlue`, `celeste`, `celeste2`

**Source:** [`src/themes/light-theme.ts`](../src/themes/light-theme.ts)

## Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly table structures

## Performance Considerations
- Server-side aggregations in API endpoint
- Pagination for large datasets
- Skeleton loaders during data fetch
- Memoization opportunities for expensive calculations

## Future Enhancements
- Real-time updates via WebSocket
- Advanced filtering (provider, treatment type, patient search)
- Custom date range picker
- Export to PDF
- Email report scheduling
- Drill-down capabilities from charts to detailed views
- Comparison views (period over period)