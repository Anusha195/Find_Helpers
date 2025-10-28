# 🧰 Find Helpers

## 📌 Overview
**Find Helpers** is a MERN stack web application that connects users with local service providers such as electricians, plumbers, cleaners, and other daily helpers.  
The platform allows users to search, hire, and manage helper services efficiently, while admins maintain control over users, categories, and helper approvals.  
It bridges the gap between people who need quick help and verified helpers offering their services.

---

## 🚀 Features

### 🔹 Authentication & Authorization
- Secure login and signup using JWT authentication.
- Role-based access control for **Users**, **Helpers**, and **Admins**.
- Passwords encrypted using **bcrypt** before saving to the database.

### 🔹 Role-Based Access
- **Users:** Search helpers, view profiles, and send service requests.
- **Helpers:** Create and manage service profiles, update availability, and view incoming requests.
- **Admins:** Approve or reject helper registrations, manage categories, cities, and platform data.

### 🔹 Search & Filter
- Search helpers based on **city** or **service category**.
- Dynamic filtering for active/verified helpers.
- Smooth UI for browsing and selecting services.

### 🔹 Service Management
- Helpers can register with details like name, category, experience, and contact info.
- Users can submit service requests to available helpers.
- Admins can manage and verify helper accounts.

### 🔹 Dashboard Views
- **User Dashboard:** View requests, history, and profile details.
- **Helper Dashboard:** Manage availability, profile updates, and job requests.
- **Admin Dashboard:** Monitor platform data, manage categories, and approve new helpers.

### 🔹 Notifications & Flash Messages
- Real-time feedback for user actions (login, registration, requests, etc.).
- Toast alerts using **React-Toastify** or similar notification libraries.

### 🔹 Security
- JWT-based session handling for protected routes.
- Passwords secured using **bcrypt**.
- Role-based route protection in both frontend and backend.

### 🔹 Database Management
- **MongoDB** with **Mongoose** models:
  - **User Model:** name, email, role, and contact details.
  - **Helper Model:** service info, category, experience, city, and status.
  - **Category Model:** predefined service types (Electrician, Maid, etc.).
  - **City Model:** supported service locations.

---

## 🛠️ Technologies Used

### **Frontend (React)**
- React.js  
- React Router DOM  
- Axios for API requests  

### **Backend (Node.js + Express)**
- Node.js  
- Express.js  
- JWT for authentication  
- bcrypt for password encryption  
- CORS enabled for frontend-backend connection

### **Database**
- MySQL

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/find-helpers.git
cd find-helpers
