# EduDisaster 🌪️📚
**A Personalized Disaster Preparedness Platform**

EduDisaster is an interactive, role-based educational platform designed to empower students, parents, and administrators with the knowledge and tools needed to respond to natural disasters and emergencies effectively.

Built for the **Smart India Hackathon (SIH) 2025**.

---

## 🌟 Key Features

*   **Role-Based Access Control:** Highly customized dashboards and permissions for varying user personas (Primary Students, Secondary Students, College Students, Parents, Admins, and Guests).
*   **Interactive Virtual Drills:** Gamified emergency scenario simulations to test and build real-time preparedness.
*   **Regional Hazard Mapping:** Geolocation-aware insights detailing specific disaster risks based on the user's local area.
*   **Actionable Data Visualizations:** Admin telemetry tracking student participation, drill scores, and school-wide preparedness levels using Recharts.
*   **Multi-language Support:** Accessible in both English and Hindi (with extensibility for regional languages).
*   **Accessible & Responsive UI:** A carefully crafted, high-contrast Light Mode interface optimized for both desktop and mobile emergency access.

## 💻 Tech Stack

*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS (Custom Semantic Palette)
*   **Data Visualization:** Recharts
*   **Routing & State:** React Hooks & Context API
*   **AI Integration:** `@google/genai` (for the EduDisaster Chatbot)

## 🎨 Design System

The application utilizes a custom semantic design language aimed at instilling trust, clarity, and alertness:
*   **Deep Navy (`#172B3A`)**: Structural elements, navigation, and primary typography.
*   **Forest Green (`#34765A`)**: Positive actions, safe statuses, and successful drill completions.
*   **Emergency Red (`#C74747`)**: Critical hazard warnings and emergency contacts.
*   **Muted Orange (`#E6A23C`)**: Active alerts and warning states.
*   **Warm White (`#F7F7F2`)**: The foundational background for high readability and reduced eye strain.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vigneshrao77/sih_2025_edudisaster.git
   cd sih_2025_edudisaster
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🛡️ User Roles

*   **Admin/Teacher:** Can view global telemetry, participation rates, and trigger school-wide alerts.
*   **Student (Primary/Secondary/College):** Access to age-appropriate curriculum, virtual drills, and hazard maps.
*   **Parent:** Access to family disaster planning tools and student progress tracking.
*   **Guest:** Limited access to basic emergency preparedness resources and hazard maps.

---
*Empowering a disaster-resilient generation.*
