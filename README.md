# File and Go - Deed Preparation Platform

Production MVP for a managed deed preparation service. Phase 1 covers the **customer persona** — guided intake, payment, and order tracking.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Start PostgreSQL (e.g. via Docker)
docker run -d --name deed-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=deed_platform -p 5432:5432 postgres:16
# Then set DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deed_platform" in .env

# 4. Push schema to database
npm run db:push

# 5. Generate Prisma client
npm run db:generate

# 6. Seed demo data
npm run db:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@fileandgo.com` / `demo1234`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 (JWT) |
| Payments | Stripe Checkout + Webhooks |
| UI | Tailwind CSS + Radix UI (shadcn pattern) |
| Forms | React Hook Form + Zod validation |
| Email | Pluggable abstraction (console in dev) |

## Architecture Overview

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Login / Register pages
│   ├── api/                # REST API endpoints
│   │   ├── auth/           # NextAuth + registration
│   │   ├── orders/         # Order CRUD + document upload
│   │   ├── stripe/         # Checkout session + webhook
│   │   └── scenarios/      # Recommendation engine
│   ├── portal/             # Customer portal (protected)
│   └── wizard/             # Intake wizard
├── components/
│   ├── layout/             # Header, Footer
│   ├── portal/             # Order list, detail, timeline
│   ├── shared/             # Step indicator, trust badges, file upload
│   ├── ui/                 # Reusable primitives (button, card, input, etc.)
│   └── wizard/             # All wizard step components + context
├── config/                 # Scenarios, document types, geography, screening rules
├── lib/                    # Database, auth, Stripe, email, audit, utils
└── types/                  # Zod schemas, TypeScript types, NextAuth extensions
```

## Key Design Decisions

### Two Entry Paths
1. **Guided scenario selector** — primary path for users who don't know what they need
2. **Direct document type picker** — for advanced users who know their deed type

### Role-Aware Foundation
Only the `CUSTOMER` role is active in Phase 1. The data model includes:
- `CUSTOMER`, `OPS`, `ATTORNEY`, `TITLE_PARTNER`, `ADMIN`

### Order Status Pipeline
```
DRAFT → SUBMITTED → PAYMENT_PENDING → PAID → INTAKE_REVIEW → 
AWAITING_DOCUMENTS → IN_PROGRESS → TITLE_SEARCH → ATTORNEY_REVIEW → 
NOTARIZATION → RECORDING → COMPLETED
```
Customer portal shows a simplified 5-step view. Internal statuses exist for future ops workflows.

### Screening / Compliance
Configurable rules engine in `src/config/screening-rules.ts`. Evaluates transaction factors and outputs:
- `standard` — normal processing
- `enhanced_review` — additional team review needed
- `fincen_review` — compliance review required

Rules are pluggable — add new rules without changing the evaluation logic.

### Audit Trail
All important actions are logged to `AuditLog` via `src/lib/audit.ts`:
- order_created, payment_initiated, payment_confirmed, status_changed, documents_uploaded, etc.

### Email Abstraction
`src/lib/email.ts` defines an `EmailProvider` interface. Swap `ConsoleEmailProvider` for SendGrid, SES, Resend, etc. without changing any callers.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | App base URL (http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook endpoint secret |
| `UPLOAD_DIR` | No | File upload directory (default: ./uploads) |
| `MAX_FILE_SIZE_MB` | No | Max upload size in MB (default: 10) |

## Stripe Setup

1. Create a [Stripe account](https://stripe.com) and get test keys
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env`
3. For local webhook testing, install [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env
```

## Database Schema

Core entities:
- **User** — auth, roles (CUSTOMER, OPS, ATTORNEY, TITLE_PARTNER, ADMIN)
- **Order** — central entity linking all order data
- **DocumentType** — deed types with pricing
- **OrderParty** — grantors/grantees with entity type support
- **OrderDocument** — uploaded files with versioning
- **Payment** — Stripe payment records
- **AuditLog** — complete audit trail
- **Notification** — email/notification records

See `prisma/schema.prisma` for the complete schema.

## Extension Points for Future Phases

### Phase 2: Ops Portal
- Add ops dashboard at `/ops`
- Internal order management, status transitions
- Assignment and workflow routing

### Phase 3: Attorney Review
- Attorney portal at `/attorney`
- Document review and approval workflow
- E-signature integration point

### Phase 4: Title Search Partner
- Partner portal at `/title-search`
- API integration for title search requests/results

### Phase 5: Full Compliance
- FinCEN filing automation
- Identity/entity verification integration
- Enhanced screening rules

### Integration Points
- **Title search**: extend `Order` with title search results, add partner API
- **E-sign / notarization**: add document signing status and integration
- **Recording**: add recording submission tracking
- **Identity verification**: add verification status to `OrderParty`

## Data Model Diagram

```
User 1──* Order 1──* OrderParty
                 1──* OrderDocument
                 1──* Payment
                 1──* AuditLog
                 1──* Notification
                 *──1 DocumentType
```

## Development Notes

- Run `npm run db:studio` to open Prisma Studio for data inspection
- All API routes use Zod validation for request bodies
- Client-side forms use React Hook Form + Zod resolvers
- The wizard state is managed via React Context + useReducer
- Portal pages are protected by NextAuth middleware
- Stripe webhook handler is idempotent (safe to receive duplicate events)

## License

Private — all rights reserved.
