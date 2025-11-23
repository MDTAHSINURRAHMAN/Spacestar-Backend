**Project Title & Tagline**

- **SpaceStar Backend** — Robust Node.js API for an e‑commerce storefront with S3 media hosting and bKash payment integration.

**Overview**

- SpaceStar Backend is an Express-based API that powers a product storefront and order/checkout flow for a Next.js frontend. It provides product and category management, image upload and signed S3 access, order lifecycle handling, admin authentication (cookie-based JWT), and bKash sandbox payment integration. The server uses a MongoDB database (MongoClient) and is structured to separate routing, controllers, models and services for maintainability.

**Key Features**

- **REST API Endpoints**: Product, Order, Checkout, Auth, Reviews, Settings and more under `/api/*` routes (see `server.js`).
- **S3 Media Uploads & Signed URLs**: Upload images to AWS S3 using `@aws-sdk/client-s3` and return signed URLs for secure access (`services/s3Service.js`).
- **bKash Payment Integration**: Create, verify and query bKash payments via tokenized endpoints (`services/bkashHelper.js` and `config/bkashConfig.js`).
- **Admin Authentication**: Cookie-based JWT auth with middleware protection (`middlewares/authMiddleware.js`) and admin helpers in `models/Admin.js`.
- **File Uploads**: In-memory `multer` upload handling with image validation and size limits (`middlewares/uploadMiddleware.js`).
- **Modular MVC-like Layout**: Clear separation of `routes/`, `controllers/`, `models/`, and `services/` to simplify feature additions and maintenance.

**Tech Stack & Tools**

- **Languages**: JavaScript (ES Modules)
- **Frameworks & Libraries**:
  - **Server**: `express` (v5.1.0)
  - **DB drivers**: `mongodb` (native MongoClient, see `config/db.js`) — `package.json` also lists `mongoose` (v8.14.1)
  - **Auth / Security**: `jsonwebtoken` (v9.0.2), `bcryptjs` (v3.0.2)
  - **File Uploads**: `multer` (v1.4.5) and `multer-s3` (v3.0.1)
  - **AWS SDK**: `@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner` (v3.797.0)
  - **HTTP / Utilities**: `axios`, `cookie-parser`, `cors`, `dotenv`, `uuid`
- **Infrastructure**: AWS S3 (signed URLs), MongoDB (connection via `config/db.js`). Next.js frontend hinted by `next.config.js` (external image domain configured for S3).
- **Dev Tools**: `nodemon` (dev dependency), Node.js (run with `node server.js` / `npm run dev`).

**Project Structure (simplified)**

```
d:/Spacestar-Backend
├─ server.js                # App entry, route registration, CORS
├─ package.json             # Dependencies & run scripts
├─ config/
│  ├─ db.js                 # MongoDB connection (MongoClient)
│  └─ bkashConfig.js        # bKash credentials + URLs
├─ controllers/             # Route handlers (business logic)
├─ models/                  # Database access helpers (collection wrappers)
├─ routes/                  # Express routers mapping to controllers
├─ services/                # Integrations: S3, bKash helper, token generator
├─ middlewares/             # Auth, upload handling, validation
└─ next.config.js           # Next.js image host config (frontend integration)
```

**Getting Started**

Prerequisites

- Node.js (14+ / current LTS recommended)
- An AWS account with an S3 bucket (for product images)
- A MongoDB connection string (Atlas or self-hosted)
- bKash sandbox credentials for payment testing (if using bKash flows)

Installation

```powershell
cd d:/Spacestar-Backend
npm install
```

Environment variables

- Create a `.env` file in the project root and set the following keys (used by the code):

```
MONGO_URI=your-mongo-connection-string
PORT=5000
NODE_ENV=development

JWT_SECRET=your_jwt_secret

AWS_REGION=eu-north-1
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=space-star-aws-bucket

BKASH_APP_KEY=...
BKASH_APP_SECRET=...
BKASH_USERNAME=...
BKASH_PASSWORD=...
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_CALLBACK_URL=https://your-callback-url
```

How to run

```powershell
# Development (auto-restart)
npm run dev

# Production
npm start
```

**Testing**

- There are no automated tests configured in `package.json` (the `test` script is a placeholder). To add tests, integrate a test runner such as `jest` or `mocha` and author tests under a `tests/` folder.


**Design Decisions & Architecture Notes**

- The codebase follows a modular, MVC-like pattern: `routes` map to `controllers`, which orchestrate `models` (database access) and `services` (external integrations). This separation keeps route handlers thin and makes database/testing/logic boundaries clear.

- The project uses the MongoDB native `MongoClient` abstraction in `config/db.js` for direct control over connections and to avoid implicit ORM behavior; however, `package.json` also lists `mongoose`—this may be a leftover or for future use. Use of `MongoClient` gives explicit control over projections and transactions when needed.

- Media is stored in AWS S3 and returned to clients as signed URLs (`services/s3Service.js`). This approach keeps the server stateless for media delivery and puts access control on limited-time URLs rather than on-hosted files.

- Payment flows are implemented against bKash tokenized APIs in `services/bkashHelper.js`. The service caches tokens with an expiry window and exposes create/verify/query helpers used by `controllers/paymentController.js` and `controllers/checkoutController.js` to orchestrate order updates.

**Contact & Attribution**

- Built with care by MDTAHSINURRAHMAN. GitHub: `https://github.com/MDTAHSINURRAHMAN` (or add your preferred contact).