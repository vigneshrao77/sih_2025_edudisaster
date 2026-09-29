# 🌪️ EduDisaster 
**Personalized Disaster Preparedness Platform**

[![Smart India Hackathon 2025](https://img.shields.io/badge/Event-SIH_2025-orange.svg?style=for-the-badge)](https://www.sih.gov.in)
[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg?style=for-the-badge&logo=supabase)](https://supabase.com/)

EduDisaster is an interactive, localized, and role-based web application designed to educate students, teachers, and parents on vital disaster preparedness. Built as a prototype for the **Smart India Hackathon (SIH) 2025**, this platform transforms rigid safety guidelines into engaging virtual drills, analytics-driven dashboards, and accessible training modules.

---

## ✨ Key Features

- **🛡️ Role-Based Architecture:** Tailored experiences and dashboards for Primary Students, Secondary Students, Teachers/Admins, and Parents.
- **📊 Real-Time Analytics:** Interactive telemetry tracking student participation, drill scores, and school-wide preparedness using Recharts.
- **🎮 Virtual Drills:** Gamified scenario-based testing to build muscle memory for earthquake, fire, and flood protocols.
- **🗺️ Regional Hazard Mapping:** Context-aware data showing disaster probability based on geographic location.
- **🌍 Bilingual Support:** Seamless context switching between English (EN) and Hindi (HI) for high accessibility.
- **🔐 Secure Backend:** Fully integrated with **Supabase** for robust authentication, Row Level Security (RLS), and real-time database management.

## 🛠️ Technology Stack

**Frontend Architecture:**
*   **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for end-to-end type safety
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) utilizing a bespoke, high-contrast Light Mode design system
*   **Data Visualization:** [Recharts](https://recharts.org/) for responsive radar and bar charts

**Backend Infrastructure:**
*   **Platform:** [Supabase](https://supabase.com/) (Open-source Firebase alternative)
*   **Authentication:** Supabase Auth (Email/Password)
*   **Database:** PostgreSQL with strict Row Level Security (RLS) policies

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/vigneshrao77/sih_2025_edudisaster.git
cd sih_2025_edudisaster
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure the Environment
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 5. Setup the Database
Execute the SQL migration file located at `supabase/migrations/20260929000000_initial_schema.sql` in your Supabase SQL Editor to instantly construct the necessary tables, policies, and seed data.

### 6. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🎨 Design System

The application utilizes a meticulously crafted Light Mode color palette optimized for readability, trust, and alertness:
- **Warm White (`#F7F7F2`)**: Primary Application Background
- **Deep Navy (`#172B3A`)**: Headers, Navigation, and High-Contrast Elements
- **Forest Green (`#34765A`)**: Primary Actions and Safe Statuses
- **Muted Orange (`#E6A23C`)**: Alerts and Warnings
- **Emergency Red (`#C74747`)**: Critical Actions and Hazard States

## 🤝 Contributing
This project is currently under active development for SIH 2025. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Empowering a disaster-resilient generation.*
