# 🍲 FoodBridge - Surplus Food Donation & Rescue Platform

> A full-stack web application connecting food providers (hotels, hostels, caterers, and food stalls) with NGOs and orphanages so surplus food can be collected and served to people in need rather than being wasted.

---

## 🌟 The Core Workflow

$$\text{Food Provider} \longrightarrow \text{Extra Food Available} \longrightarrow \text{Food Posted} \longrightarrow \text{NGO Notified} \longrightarrow \text{Food Accepted} \longrightarrow \text{Food Collected}$$

1. **Food Provider**: Posts surplus food specifying quantity, estimated servings, safe consumption limit, and pickup address.
2. **Instant Notification**: System triggers a notification alert for nearby registered NGOs and orphanages.
3. **NGO / Orphanage**: Discovers available surplus food on their live feed and clicks **"Accept Food"** to reserve collection.
4. **Coordination**: Contact information is shared between the provider and claimant.
5. **Collection & Verification**: Once food is handed over, the status is marked as **"Collected"**, closing the rescue loop and incrementing community impact counters.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios, React Router v6
* **Backend**: Node.js, Express.js REST API, Morgan logger, CORS
* **Database**: MongoDB Atlas via Mongoose ODM
* **Security & Auth**: JWT (JSON Web Tokens) with `bcryptjs` password encryption and role authorization

---

## 📂 Project Structure

```
Food Donation Management System/
├── client/                     # React.js + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FoodCard, StatusBadge, StatusStepper, Modal, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT & roles), NotificationContext (polling alerts)
│   │   ├── pages/              # Home, Login, Register, ProviderDashboard, CreateDonation, NgoDashboard, DonationDetails, Profile
│   │   ├── services/           # api.js (Axios client with JWT interceptor)
│   │   └── utils/              # helpers.js (countdowns, formatters)
│   └── vite.config.js          # Vite config with API proxy to port 5000
│
├── server/                     # Express.js REST API
│   ├── config/                 # db.js (MongoDB Atlas Mongoose connection)
│   ├── controllers/            # authController, donationController, notificationController
│   ├── middleware/             # authMiddleware (JWT protect & roles), errorHandler
│   ├── models/                 # User.js, Donation.js, Notification.js
│   ├── routes/                 # authRoutes, donationRoutes, notificationRoutes
│   ├── seed.js                 # Realistic seed data script with demo accounts
│   ├── .env                    # Environment configurations
│   └── server.js               # Express application entry
│
├── package.json                # Root package.json with concurrent run scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the command below in the root directory to install root, backend, and frontend packages:
```bash
npm run install:all
```
*(Or install in `server` and `client` individually with `npm install`)*

### 2. Configure MongoDB Atlas
In `server/.env`, configure your MongoDB Atlas connection string:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/food_donation?retryWrites=true&w=majority
JWT_SECRET=super_secret_food_donation_jwt_key_9921_secure
JWT_EXPIRE=7d
NODE_ENV=development
```
> **Tip**: You can also use a local MongoDB instance: `mongodb://127.0.0.1:27017/food_donation`.

### 3. Seed Demo Data (Optional but Recommended)
Populate sample hotels, hostel mess, orphanages, active surplus food, and notifications:
```bash
npm run seed
```

### 4. Run Both Frontend and Backend Concurrently
From the project root:
```bash
npm run dev
```

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Accounts (1-Click Fill Available on Login Page)

| Role | Email | Password | Organization Name |
|---|---|---|---|
| **Food Provider** | `hotel@demo.com` | `password123` | Grand Orchid Luxury Hotel |
| **Food Provider (Hostel)** | `hostel@demo.com` | `password123` | Sunrise College Hostel Mess |
| **NGO / Orphanage** | `orphanage@demo.com` | `password123` | Sunshine Children Orphanage |
| **Community NGO** | `ngo@demo.com` | `password123` | Care & Feed Community NGO |

---

## 🛡️ Key Features

1. **Role-Based Access Control**:
   * Distinct dashboards and permission controls for **Food Providers** and **NGOs / Orphanages**.
2. **Surplus Food Posting with Expiry Tracking**:
   * Timed consumption limit with visual urgency badges (*"Collect within 2h 30m!"*).
3. **Interactive 3-Step Lifecycle Stepper**:
   * *Available* ➔ *Accepted (Pickup in progress)* ➔ *Collected & Delivered*.
4. **Live In-App Notification Bell**:
   * Automatic alert delivery when food is posted or claimed, with unread badge counter.
5. **Impact Tracking**:
   * Real-time metrics counting total meals saved, active postings, and partner organizations.
6. **Responsive Design**:
   * Optimized for mobile smartphones, tablets, and desktop displays.
