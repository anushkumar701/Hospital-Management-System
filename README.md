# 🏥 MediCare Super Speciality Hospital System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://hospital-management-system-omega-ten-15.vercel.app/)

A production-ready **Private Super Speciality Hospital Management System (HMS)** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. MediCare provides role-based portals for **Admins**, **Doctors**, **Receptionists**, and **Patients** across multi-speciality hospital centres in Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem).

---

## 🌐 Live Public Access

The web application is deployed live on Vercel:

- ⚡ **Official Live Application**: [https://hospital-management-system-omega-ten-15.vercel.app/](https://hospital-management-system-omega-ten-15.vercel.app/)
- 💻 **Local Development**: `http://localhost:5173`

---

## 🔑 Demo Credentials

Use these pre-configured credentials to explore the different role portals:

| Role | Email Address | Password | Hospital Hub / Specialty | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@hospital.com` | `admin123` | Hospital Executive Office | User management, revenue analytics, CSV data exports |
| **🩺 Doctor (Cardiology)** | `doctor@hospital.com` | `doctor123` | Dr. K. Arumugam *(Chennai)* | Appointments queue, digital prescriptions, lab reports |
| **🩺 Doctor (Neurology)** | `doctor2@hospital.com` | `doctor123` | Dr. S. Meenakshi *(Madurai)* | Neurological consultations, patient medical records |
| **🩺 Doctor (Pediatrics)** | `doctor3@hospital.com` | `doctor123` | Dr. R. Karthikeyan *(Coimbatore)* | Pediatric checkups, vaccination tracking |
| **🩺 Doctor (Orthopedics)** | `doctor4@hospital.com` | `doctor123` | Dr. V. Sundaram *(Trichy)* | Joint evaluations, mobility checkups |
| **📋 Receptionist** | `receptionist@hospital.com` | `receptionist123` | Deepa Anbarasan *(Chennai Hub)* | Patient registration, smart booking with conflict check |
| **👤 Patient** | `patient@hospital.com` | `patient123` | M. Anandkumar *(Chennai)* | Self-service booking, Telehealth links, Invoices & Prescriptions |

---

## ✨ Core Features & Modules

### 💳 1. Healthcare Billing & Invoices (INR ₹)
- **Revenue Analytics**: Track total collected revenue, unpaid balances, and invoice counts.
- **Invoice Generation**: Create line-item billing statements with custom services and due dates.
- **Payment Collection**: Mark invoices as paid with automatic timestamp recording.
- **Patient Billing Portal**: Patients can view their billing statements, line items, and payment status in Indian Rupees (₹).
- **Financial Export**: Export all billing and invoice data directly to CSV.

### 🎥 2. Telehealth & Video Consultations
- **Virtual Appointments**: Web-based video consultation meeting links (Jitsi integration) embedded into appointment schedules.
- **One-Click Join**: Patients and doctors can join secure video rooms directly from their appointment tables.

### 📅 3. Patient Self-Service & Booking
- **Direct Appointment Booking**: Patients can schedule consultations by choosing doctors, preferred date/time slots, and visit reasons.
- **Conflict Prevention**: Built-in scheduling conflict detector prevents double-booking doctors.
- **Cancellation Management**: Patients can cancel upcoming visits directly with automatic status updates.

### 📜 4. Digital Prescriptions & Medical Reports
- **Multi-Medication Issuance**: Doctors create digital prescriptions with detailed dosages, intake frequency, and instructions.
- **Dynamic Text Export**: Prescriptions export as formatted, printable `.txt` documents.
- **Lab & Radiology Reports**: Upload and view ECG, X-Ray, Echo, and MRI diagnostic reports.

### 🔔 5. Modern UI & Toast Notifications
- Clean micro-animations, glassmorphism card designs, and fully responsive layouts.
- Non-intrusive floating toast notifications for user action feedback.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 with TypeScript
- **Build Engine**: Vite 5
- **Styling**: Vanilla CSS3 + Tailwind CSS 3
- **Iconography**: Lucide React
- **Data Persistence**: Client-side HTML5 LocalStorage state engine
- **Cloud Hosting**: Vercel CI/CD Production Pipeline

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
Ensure **Node.js** (v18+) and **npm** are installed:
```bash
node -v
npm -v
```

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/anushkumar701/Hospital-Management-System.git
cd Hospital-Management-System
npm install
```

### 3. Start Local Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

### 4. Build & Preview Production Bundle
```bash
npm run build
npm run preview
```

---

## 📁 Directory Architecture

```text
Hospital-Management-System/
├── components/
│   ├── Auth/
│   │   └── LoginForm.tsx           # Login screen with quick-fill demo buttons
│   ├── Billing/
│   │   └── InvoicesView.tsx        # Hospital billing, payments & invoice generator
│   ├── Dashboard/
│   │   ├── AdminDashboard.tsx      # User management & analytics
│   │   ├── DashboardContainer.tsx  # Dynamic dashboard router
│   │   ├── DoctorDashboard.tsx     # Appointments, prescriptions & lab reports
│   │   ├── PatientDashboard.tsx    # Self-service booking, invoices & profile
│   │   └── ReceptionistDashboard.tsx # Patient registration & scheduling
│   └── Layout/
│       ├── Header.tsx              # Private hospital header & session navigation
│       └── Sidebar.tsx             # Role-aware navigation drawer
├── contexts/
│   ├── AuthContext.tsx             # Authentication provider
│   └── ToastContext.tsx            # Floating toast notification system
├── types/
│   └── index.ts                    # TypeScript interfaces (Invoice, Patient, etc.)
├── utils/
│   ├── seedData.ts                 # Tamil Nadu hospital sample dataset
│   └── storage.ts                  # LocalStorage state engine & CSV exporter
├── App.tsx                         # Primary application container
├── main.tsx                        # Application DOM entry point
└── package.json                    # Dependencies & build scripts
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
