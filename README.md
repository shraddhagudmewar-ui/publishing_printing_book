# KA Group of Publications — Full-Stack MERN Platform

> **"Where Words Become Legacy."**

An end-to-end, enterprise-grade publishing house web application built with the **MERN** stack (MongoDB, Express.js, React 19 + Vite, Node.js). 

---

## 🎨 Brand Colour Palette
- **Navbar background**: `#202020` (Charcoal, dark)
- **Navbar accent border**: `#48779E` (Royal Blue, 2px bottom border)
- **Page background**: `#EAF1F7` (Light Blue, soft archival tone)
- **Card background**: `#FFFFFF` (White)
- **Card border**: `#A8B9C8` (Steel Blue, subtle)
- **Primary button**: `#48779E` (hover: `#3A6486`)
- **Active navigation**: `#48779E` with white text
- **Headings & text**: `#202020`
- **Meta text**: `#A8B9C8`

---

## 📁 System Architecture

```text
KA_GROUPS/
├── backend/
│   ├── src/
│   │   ├── config/db.js             # Mongoose MongoDB connection
│   │   ├── models/                  # 14 Mongoose Schema Models
│   │   ├── controllers/             # Business Logic & CRUD operations
│   │   ├── middleware/              # JWT protection & role authorizations
│   │   ├── routes/                  # Express RESTful route endpoints
│   │   └── server.js                # Express app entrypoint
│   ├── uploads/                     # Local storage for manuscripts & covers
│   ├── .env                         # Backend environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/              # Buttons, Cards, Modals, Tables, Navbar, Footer
    │   ├── context/                 # AuthContext (JWT) & CartContext (Global Cart)
    │   ├── i18n/                    # Multilingual support (English, Hindi, Marathi)
    │   ├── layouts/                 # Public, Customer, Author, Admin layouts
    │   ├── pages/                   # 16 Public Pages + 3 Dedicated Role Dashboards
    │   ├── services/api.js          # Centralized Axios with JWT interceptors
    │   ├── App.jsx                  # React Router DOM routing
    │   └── main.jsx                 # Provider hierarchy entrypoint
    ├── vite.config.js               # Vite config + Tailwind v4 plugin + API proxy
    └── package.json
```

---

## 🚀 Step-by-Step Installation & Running

### 1. Prerequisites
- **Node.js**: v18+ or v20+ installed ([Download Node.js](https://nodejs.org/))
- **MongoDB Community Server**: Running locally on `mongodb://127.0.0.1:27017`
- **MongoDB Compass**: GUI to inspect collections and documents

---

### 2. MongoDB Compass Setup
1. Open **MongoDB Compass**.
2. In the "New Connection" field, enter the URI:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. You will see the database: `ka_publications`.
5. Inside, all 14 collections are populated and active:
   - `users`, `books`, `categories`, `authors`, `publishingrequests`, `orders`, `payments`, `reviews`, `wishlists`, `carts`, `publishingpackages`, `printingrequests`, `notifications`, `addresses`.

---

### 3. Backend Setup & Run

Open a terminal in the root directory:
```bash
cd backend
npm install
npm run dev
# or: node src/server.js
```
The backend server will start on **port 5000**:
```text
=================================================
 KA Group of Publications API running on port 5000
 Database Target: mongodb://127.0.0.1:27017/ka_publications
 Health check: http://localhost:5000/api/health
=================================================
[MongoDB Connected]: 127.0.0.1
[Database Active]: ka_publications
```

#### Seed Account Credentials (Pre-loaded):
| Role | Email | Password |
|---|---|---|
| **Admin / Publisher** | `admin@kagroup.com` | `password123` |
| **Author** | `author@kagroup.com` | `password123` |
| **Customer / Reader** | `customer@kagroup.com` | `password123` |

---

### 4. Frontend Setup & Run

Open a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The application will launch on **[http://localhost:5173/](http://localhost:5173/)**.

---

## 🌐 Features & Workflows

### 1. Multilingual Support
Switch between **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** using the language selector in the top navbar. Language preference is preserved in browser `localStorage`.

### 2. Author Workflow
1. Register or login as an **Author**.
2. Navigate to **Author Studio** (`/author/dashboard`).
3. Click **Submit New Manuscript** (`/author/submit`) with title, genre, synopsis, word count, tier package, and manuscript file.
4. Track manuscript lifecycle: `Draft → Submitted → Under Review → Approved/Rejected → Publishing → Published`.
5. View editorial suggestions and review monthly royalty payouts.

### 3. Customer Workflow
1. Browse bookstore (`/books`), filter by category, sort by price, search by title/author/ISBN.
2. Toggle book format between **Paperback**, **Hardcover**, and **eBook**.
3. Add titles to Cart or Wishlist.
4. Proceed to **Checkout** (`/checkout`), enter delivery details, select payment method (UPI / Card / COD), and place order.
5. Track courier fulfillment status: `Placed → Confirmed → Processing → Printing → Shipped → Delivered`.
6. Access purchased digital folios in the **eBook Library**.

### 4. Admin / Publisher Workflow
1. Login with `admin@kagroup.com`.
2. Access the **Executive Publisher Console** (`/admin/dashboard`).
3. **Manuscript Approvals**: Review author submissions, write feedback notes, approve/reject, and publish directly to the live bookstore catalog.
4. **Catalogue Management**: Add, edit, or remove books and manage stock inventory.
5. **Orders & Deliveries**: Update dispatch status and manage courier tracking.
6. **Finance & Ledgers**: Review transactions and process refunds.

---

## 🔒 Security Architecture
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **JWT Authorization**: HTTP Bearer token verification with role checking middleware (`protect`, `authorize('admin')`).
- **Registration Protection**: The `admin` role is strictly forbidden from being selected during public registration.
- **File Validation**: `multer` validates file extensions and mime types, enforcing a 25MB ceiling on uploads.
