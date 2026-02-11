# 🩺 Doctor-Patient Portal System

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A full-stack web application for managing doctor-patient interactions, appointment scheduling, medical records, and organ donation registration/search.**

Patients can book appointments, view their medical history, and register/search for organ donation.  
Doctors can manage slots, view patient history (even before visits), add consultation notes, and access organ donor data.

> **Important**: This is a personal/academic project. **Not for real medical use**. Handles sensitive data only in development/testing environments.

## Problem Statement

We here propose a doctor patient handling, managing system that helps doctors in their work and also patients to book doctor appointments and view medical progress. The system allows doctors to manage their booking slots online. Patients are allowed to book empty slots online and those slots are reserved in their name. The system manages the appointment data for multiple doctors for various date and times. Each time a user visits a doctor his/her medical entry is stored in the database by doctor. Next time a user logs in he may view his/her entire medical history as and when needed. At the same time a doctor may view patients medical history even bore the patient visits him. This allows for an automated patient doctor handling system through an online interface. Our system also consists of organ donor module. This module allows for organ donation registration as well as organ search. The module is designed to help urgent organ requirements through easy/instant searches.


## ✨ Features

- 👤 **Two main roles**: Patient & Doctor (with role-based access control)
- 🗓️ **Appointment booking** — patients see available slots, book instantly
- 📅 **Doctor slot management** — doctors set availability for dates & times
- 📋 **Medical history** — secure storage of consultation notes & prescriptions
- 👁️ **Pre-visit history access** — doctors can review patient records before appointments
- 🫀 **Organ Donor Module** — registration as donor + urgent organ search (type, blood group, urgency filters)
- 🔐 **Authentication & Authorization** — login/signup, protected routes
- 📱 **Responsive design** — works on mobile, tablet, desktop
- ⚡ **Real-time feedback** — loading states, success/error messages
- 🛡️ **Environment variables** — secure handling of secrets (DB URI, JWT secret, etc.)

## 🛠️ Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React.js                    |
| Backend        | Node.js + Express           |
| Database       | MongoDB                     |
| Authentication | JWT / bcrypt                |
| Styling        | Tailwind CSS                |
| State Management | React Context / Redux (optional) |
| API Client     | Axios                       |
| License        | MIT                         |

**Project Presentation**: [Doctor-Patient Portal Presentation (PDF)](Doctor-Patient%20Portal.pptx.pdf)

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/doctor-patient-portal.git
cd doctor-patient-portal
```
### 2. Backend Setup (Spring Boot)
```Bash
# Install dependencies
mvn clean install
```
## Create or update src/main/resources/application.properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_patient_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
# JWT
jwt.secret=your_very_long_random_secret_key_2025
jwt.expiration=86400000   # 24 hours in ms

server.port=8080
```

```Bash
# Run the application
mvn spring-boot:run
# or
java -jar target/*.jar
```
### API available at: http://localhost:8080/api/...
### 3. Frontend Setup (React):
Assuming you have a separate frontend/ folder (or repo):
```Bash
cd ../frontend           # adjust path if needed
npm install
Create .env in frontend root:
envVITE_API_URL=http://localhost:8080/api
# or (if using Create React App)
# REACT_APP_API_URL=http://localhost:8080/api
```
```Bash
npm run dev
# or
npm start
```
### Frontend usually opens at http://localhost:5173 (Vite) or http://localhost:3000 (CRA)

### 3. Frontend Setup
```Bash
cd ../frontend          # or your frontend folder
npm install
```
### 📸 Diagarams
#### Use Case Diagarm![Usecase Diagram ](demo_images/u1.png)

### DFD diagram
#### First refinement of DFD diagram![DFD](demo_images/rfd1.png)
#### Second refinement of DFD diagram![DFD](demo_images/rfd2.png)
#### FIinal (Working) refinement of DFD diagram![DFD](demo_images/rfd3.png)

#### Module Diagram
![Module Diagram](demo_images/module1.png)

#### MinCase Study
![MinCase Study](demo_images/mincase.png)

### 📸 Screenshots
### Login Page![Login Page ](demo_images/1.png)

### Register Page![Register Page ](demo_images/2.png)

### Patient Dashboard
![Patient Dashboard](demo_images/4.png)
![Patient Dashboard](demo_images/4.1.png)

### Doctor Dashboard
![Doctor Dashboard](demo_images/3.png)
![Doctor Dashboard](demo_images/3.1.png)

### Organ Donor Registration & Search
![Organ Donor Registration & Search](demo_images/5.png)



## 🗂️ Project Structure (Recommended Monorepo)
```
doctor-patient-portal/
├── backend/                  
Doctor-Patient-Port-al-Backend
│   ├── src/
│   ├── config/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   ├── .env
│   └── package.json
├── screenshots/
├── .gitignore
└── README.md
```

### 🤝 Contributing & Future Ideas

Contributions welcome!

Suggested improvements
1. Admin dashboard (manage users, stats)
2. Email notifications (appointment confirmations, reminders)
3. File uploads (prescriptions, lab reports)
4. Real-time updates (Socket.io)
5. Search & filters enhancements in organ module
6. PDF export of medical records
7. Docker + docker-compose
8. Unit & integration tests
9. Deploy to Vercel (frontend) + Railway/Render (backend)

## Standard flow:

1. Fork
2. git checkout -b feature/your-feature
3. Commit & push
4. Open Pull Request

## 📜 License
MIT License — see LICENSE file.

Free to use, modify, distribute (even commercially) with original copyright notice.
💬 Contact

⭐ Star the repo if this project helps or inspires you!

Built with care — for learning & demonstration purposes. 🩺