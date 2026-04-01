# 🏀 Basketball Club Management System – Claude Code Prompt

## 🎯 Goal

Build a simple web application for managing a basketball club. The system should handle **member profiling**, **attendance tracking**, and **membership fee management**.

The application should be clean, simple, and production-ready for small clubs (barangay / amateur teams).

---

## 🧱 Tech Stack

### Frontend

* Angular (latest version)
* Angular Material (UI components)
* Reactive Forms
* mat-table for data display

### Backend

* NestJS (REST API)
* Modular architecture

### Database

* Firebase Firestore

---

## 📦 Core Features (MVP)

### 1. Member Management

#### Requirements:

* Create, update, delete, and list members

#### Fields:

* name (string, required)
* nickname (string, optional)
* age (number, required)
* contactNumber (string, required)
* position (enum: Guard | Forward | Center)
* dateJoined (auto-set to current date)
* status (default: "active")

#### Rules:

* Do NOT include jersey number
* Do NOT allow manual input for:

  * dateJoined
  * status (default to active on creation)

---

### 2. Attendance Tracking

#### Requirements:

* Create attendance per date
* Mark members as present

#### Structure:

* date
* eventType (Practice | Game)
* attendees (array of memberIds)

#### UI Behavior:

* Display all members with checkboxes
* Allow "Mark All Present"
* Save attendance per date

---

### 3. Membership Fee Tracking

#### Requirements:

* Record payments per member

#### Fields:

* memberId
* amount
* paymentType (Monthly | Registration)
* status (Paid | Partial | Unpaid)
* date

#### Features:

* View payment history per member
* Calculate total payments
* Show unpaid members

---

## 🧱 Backend Structure (NestJS)

### Modules:

* members
* attendance
* payments

### Example Endpoints:

#### Members

* POST /members
* GET /members
* PUT /members/:id
* DELETE /members/:id

#### Attendance

* POST /attendance
* GET /attendance?date=YYYY-MM-DD

#### Payments

* POST /payments
* GET /payments?memberId=ID

---

## 🗃️ Firestore Collections

### members

```json
{
  "name": "string",
  "nickname": "string (optional)",
  "age": "number",
  "contactNumber": "string",
  "position": "Guard | Forward | Center",
  "dateJoined": "timestamp",
  "status": "active | inactive"
}
```

### attendance

```json
{
  "date": "YYYY-MM-DD",
  "eventType": "Practice | Game",
  "attendees": ["memberId1", "memberId2"]
}
```

### payments

```json
{
  "memberId": "string",
  "amount": "number",
  "paymentType": "Monthly | Registration",
  "status": "Paid | Partial | Unpaid",
  "date": "timestamp"
}
```

---

## 🎨 Frontend Pages

### 1. Dashboard

* Total members
* Today’s attendance
* Total collected fees

### 2. Members Page

* Table of members (mat-table)
* Add/Edit dialog (Reactive Form)
* Status toggle (Active / Inactive)

### 3. Attendance Page

* Date picker
* List of members with checkboxes
* Save attendance

### 4. Payments Page

* Member dropdown
* Payment form
* Payment history table

---

## ⚙️ Key Behaviors

* Automatically set:

  * `dateJoined = current date`
  * `status = active`
* Use Firestore timestamps where applicable
* Use Angular Material dialogs for forms
* Use clean and reusable components

---

## 📈 Nice-to-Have (Optional)

* Export to Excel (xlsx)
* Attendance reports
* Payment summary dashboard
* Notifications for unpaid members

---

## 🚀 Output Expectations

Claude Code should generate:

1. Full Angular frontend (components, services, UI)
2. NestJS backend (modules, controllers, services)
3. Firestore integration
4. Clean folder structure
5. Ready-to-run project setup instructions

---

## 🧠 Notes

* Keep UI simple and mobile-friendly
* Avoid over-engineering
* Focus on usability for non-technical users (team managers)

---

## ✅ Final Instruction

Generate the full working project with:

* Clean architecture
* Best practices
* Minimal but scalable design

Ensure the app can be deployed easily (Firebase + Node backend or serverless if possible).
