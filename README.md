# 🏥 AIMS Prime Super Speciality Hospital & Healthcare Management Platform

**Location:** Guntur, Andhra Pradesh, India  
**Tagline:** "Advanced Healthcare. Compassionate Care."  
**Website & System:** Full-Stack Multi-Speciality Hospital Website + Online Appointment Booking Engine + Hospital Management System

---

## 🌟 Key Features

### 1. Public Healthcare Website
- **Cinematic Hero with 3D WebGL Canvas**: Three.js interactive medical DNA/heart structure with mouse parallax and smooth lighting.
- **24/7 Emergency Wing & Ambulance Dispatch**: Live pulsating ECG line, direct hotlines (`+91 863 234 5678`), and instant dispatch request form.
- **Dynamic Clinical Departments**: Cardiology, Neurology, Robotic Orthopedics, Pediatrics (Level-III NICU), Obstetrics & Gynecology, Diabetology, and Emergency Medicine.
- **Doctor Directory & Profiles**: Search doctors by name, department, or experience, with fee display, APMC registration details, and direct scheduling.
- **Interactive Multi-Step Appointment Booking Wizard**:
  - Step 1: Department Selection
  - Step 2: Specialist Doctor
  - Step 3: Date Selection (Next 14 days)
  - Step 4: Real-time Time Slots (Morning/Afternoon/Evening)
  - Step 5: Patient Demographics & Reason for Visit
  - Step 6: Instant Transactional Confirmation with Token ID & Printable Slip
- **Preventive Master Health Checkup Packages**: Executive Master Health Checkup, Cardiac Wellness, Senior Citizen, and Well Women packages.
- **Patient Recovery Stories & Testimonials**: Verified testimonials from patients across Guntur and the Amaravati capital region.
- **Health Education Articles**: Evidence-based clinical guidance written by specialist doctors.
- **Global Search (`Ctrl+K`)**: Live autocomplete across doctors, departments, packages, and health articles.

---

### 2. Multi-Role SaaS Portals (RBAC)

| Role | Demo Credentials | Portal Link | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@aimshospital.com` / `Admin@1234` | `/admin/dashboard` | Executive KPIs, doctor onboarding, department configuration, hospital settings, and audit logs. |
| **Doctor** | `dr.ramesh@aimshospital.com` / `Doctor@1234` | `/doctor/dashboard` | Live patient queue, consultation status updates, prescription/clinical notes, and schedule. |
| **Receptionist** | `reception@aimshospital.com` / `Reception@1234` | `/reception/dashboard` | Front desk triage, walk-in patient check-in, token slip printing, and waiting room management. |
| **Patient** | `patient@aimshospital.com` / `Patient@1234` | `/patient/dashboard` | Upcoming appointment countdown, consultation history, reschedule, and cancellation with slot release. |

---

## 🛠️ Technology Stack

- **Frontend & Full-Stack**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS + Custom Medical Design Tokens (Navy `#0A192F`, Sapphire `#0284C7`, Teal `#0D9488`, Soft Cyan `#E0F2FE`)
- **3D Visualization**: Three.js WebGL interactive canvas
- **Database & ORM**: Prisma ORM with SQLite (`prisma/dev.db`) for zero-friction local run + PostgreSQL ready
- **Authentication**: Secure JWT sessions with HTTP-only cookies (`jose`, `bcryptjs`)
- **Icons & Micro-Interactions**: Lucide Icons, Canvas Confetti

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/nareshpagadala-14/hospital.git
cd hospital
npm install
```

### 2. Database Setup & Seeding
```bash
# Push Prisma schema to local database
npx prisma db push

# Seed authentic Guntur hospital master data & demo accounts
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live hospital platform.

---

## 🔒 Security & Data Integrity

- **Double-Booking Guard**: Strict database-level unique constraints and transactions prevent simultaneous duplicate bookings for the same doctor and slot.
- **Password Security**: Bcryptjs salt hashing; never stores plaintext passwords.
- **Audit Logging**: Tamper-evident logging for logins, appointments, cancellations, and doctor additions.
- **Role-Based Protection**: Strict middleware and route guards ensuring patients cannot access staff consoles and unauthorized requests are rejected.
