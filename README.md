# 🏥 MediCare - Hospital Management System

A modern, full-featured **Hospital Management System (HMS)** web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. MediCare provides role-based dashboards for **Admins**, **Doctors**, **Receptionists**, and **Patients** to streamline healthcare management, patient registration, appointment scheduling, digital prescriptions, and medical report tracking.

---

## 🌐 Live Public Access

The application is deployed and live on **Vercel**:

- ⚡ **Official Live Production URL**: [https://hospital-management-system-omega-ten-15.vercel.app/](https://hospital-management-system-omega-ten-15.vercel.app/)
- 🔗 **Alternative Reverse Proxy URL**: [https://stale-pears-fail.loca.lt](https://stale-pears-fail.loca.lt) *(Password: `152.57.80.228`)*
- 💻 **Local Development Server**: `http://localhost:5173`

---

## 🔑 Login Credentials

Use the following pre-configured demo credentials to access the different portal roles:

| Role | Email Address | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@hospital.com` | `admin123` | Full system access, user role management, system analytics, CSV data exports |
| **🩺 Doctor** | `doctor@hospital.com` | `doctor123` | Patient management, schedule completion, digital prescription issuance, lab report uploads |
| **📋 Receptionist** | `receptionist@hospital.com` | `receptionist123` | Patient registration, doctor schedule availability check, appointment booking, conflict detection |
| **👤 Patient** | `patient@hospital.com` | `patient123` | Personal profile, upcoming & past appointments, downloadable prescriptions, medical reports |

---

## ✨ Key Features by Role

### 👑 Admin Portal
- **Dashboard Analytics**: Real-time counters for total users, registered patients, total appointments, and today's schedule.
- **User Management**: Create, edit, and remove system users (Doctors, Receptionists, Patients, Admins).
- **Data Export**: One-click CSV exports for User Records, Patient Databases, and Appointment Logs.

### 🩺 Doctor Portal
- **Daily Schedule**: View today's queue and mark appointments as completed.
- **Patient Roster**: Access complete patient histories and contact details.
- **Digital Prescriptions**: Create multi-medication digital prescriptions with dosage, frequency, and duration.
- **Medical Reports**: Upload consultation reports and lab test results directly to patient profiles.

### 📋 Receptionist Portal
- **Patient Onboarding**: Register new patients with medical history, emergency contacts, and demographic details.
- **Smart Appointment Booking**: Real-time doctor availability check preventing overlapping booking conflicts.
- **Record Search**: Instant search filter across patient records by name, email, or phone number.

### 👤 Patient Portal
- **Personal Health Hub**: View demographics, emergency contact info, and medical history.
- **Appointment Tracker**: Monitor upcoming visits and review historical consultations.
- **Downloadable Prescriptions**: Download digital prescriptions formatted as printable document files (`.txt`).
- **Lab & Imaging Reports**: Access medical reports uploaded by attending physicians.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Iconography**: Lucide React
- **Data Persistence**: HTML5 LocalStorage state engine
- **Public Hosting**: Vercel (Production Cloud Deployment) / Localtunnel

---

## 🚀 Local Installation & Setup

Follow these steps to run MediCare locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

```bash
node -v
npm -v
```

### 2. Install Dependencies
Navigate to the project root directory and run:

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```
Serves the optimized build at `http://localhost:5173`.

### 6. Make Publicly Accessible

To expose your local instance to the web:

```bash
npx localtunnel --port 5173
```

---

## 📁 Project Directory Structure

```text
Hospital Management/
├── components/
│   ├── Auth/
│   │   └── LoginForm.tsx           # Login form with quick demo role selectors
│   ├── Dashboard/
│   │   ├── AdminDashboard.tsx      # User management & system analytics
│   │   ├── DashboardContainer.tsx  # Dynamic dashboard router
│   │   ├── DoctorDashboard.tsx     # Appointments, prescriptions & reports
│   │   ├── PatientDashboard.tsx    # Patient profile & document downloads
│   │   └── ReceptionistDashboard.tsx # Registration & smart booking
│   └── Layout/
│       ├── Header.tsx              # Navigation bar with user status & logout
│       └── Sidebar.tsx             # Role-aware navigation sidebar
├── contexts/
│   └── AuthContext.tsx             # Auth state provider & seed data initializer
├── types/
│   └── index.ts                    # TypeScript interfaces & models
├── utils/
│   └── storage.ts                  # LocalStorage helper functions & CSV export
├── App.tsx                         # Main app wrapper
├── main.tsx                        # Entry point
├── index.html                      # HTML root template
├── vite.config.ts                  # Vite build configuration
└── package.json                    # Project metadata & dependencies
```

---

## 🛡️ License

This project is licensed under the MIT License - feel free to use and customize for your healthcare organization or portfolio.
