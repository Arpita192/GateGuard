# 🏫 GateGuard: A Secure Hostel Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to digitize and streamline the student leave pass process, featuring role-based access control and QR code verification for enhanced security and efficiency.

---

## 🚀 The Problem It Solves

Traditional hostel management often relies on manual, paper-based systems for tracking student leave, which can be inefficient, prone to errors, and insecure.
GateGuard addresses these challenges by providing a centralized, digital platform that automates the entire leave pass lifecycle — from application and approval to secure verification.

---

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)

A secure authentication system with distinct dashboards and permissions for different user roles:

* Super Admin: Manages all user accounts and oversees the entire system.
* Student: Can apply for leave passes and view their pass history and status.
* Warden: Can approve or reject leave pass requests from students.
* Clerk: Manages student records and assists with administrative tasks.
* Security: Verifies students entering or leaving the premises by scanning QR codes.

### 🧾 Digital Leave Pass System

A seamless workflow for students to submit leave pass requests. Wardens receive notifications and can approve or reject requests with a single click.

### 🧭 QR Code Verification

Upon approval, a unique, tamper-proof QR code is generated for each leave pass. Security personnel can scan this code using a dedicated scanner interface to instantly verify pass details and log the student's entry or exit.

### 🗃️ Centralized Management

Provides a single source of truth for student information, leave history, and user roles — eliminating paperwork and improving record-keeping.

---

## 🔄 System Workflow

A complete flow from a student’s initial leave request to the final security verification using QR code scanning.

---

## 🛠️ Tech Stack

### Frontend

* React.js – Dynamic, responsive user interface.
* React Router – Client-side routing and navigation.
* Axios – For communicating with the backend API.
* CSS – Custom styling and animations.

### Backend

* Node.js – JavaScript runtime for the server-side.
* Express.js – Web framework for building RESTful APIs.

### Database

* MongoDB – NoSQL database to store user and leave pass data.
* Mongoose – Elegant ODM (Object Data Modeling) library for MongoDB, providing schema-based data validation and easy CRUD operations.

### Authentication & Security

* JSON Web Tokens (JWT) – Secure, stateless user authentication and session management.
* bcrypt.js – For hashing passwords before storing them in the database.

---

## ⚙️ Getting Started

### Prerequisites

* Node.js and npm (or yarn) installed
* A running MongoDB instance (local or cloud, e.g. MongoDB Atlas)
* Git installed

---

### 1. Clone the Repository

```bash
git clone https://your-repository-url/GateGuard.git
cd GateGuard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder and add your environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gateguard
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The `"proxy"` in `package.json` automatically routes API requests to the backend.

---

## 🚀 Usage

Once both servers are running:

* Backend API: [http://localhost:5000](http://localhost:5000)
* Frontend App: [http://localhost:3000](http://localhost:3000)

You can register a new user or log in with the Super Admin account to begin managing the system.

---

## 🤝 Contributing

Contributions make the open-source community amazing!

1. Fork the project
2. Create a branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

Would you like me to format this as a Markdown file (README.md) so you can copy-paste or download it directly into your repo?
