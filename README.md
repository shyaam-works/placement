# Placement Management & Analytics Portal

A full‑stack, production‑oriented placement management system designed to handle **real college placement workflows** with **data‑driven decision support**. The platform centralizes student data, company eligibility criteria, round‑wise progress tracking, analytics, and AI‑assisted shortlisting — all in one place.

> Built with scalability, fairness, and interview‑readiness in mind.

---

## Overview

This application is built to solve a real problem faced by placement cells:

* Managing **hundreds of students and companies**
* Tracking **round‑wise progress** across multiple companies
* Ensuring **eligibility filtering** based on company criteria
* Providing **transparent, unbiased student shortlisting** when companies request top candidates

The system combines **traditional CRUD workflows**, **machine‑learning–based recommendations**, and **analytics dashboards** to support placement officers in making informed decisions.

---

## Key Features

### Company Management with Eligibility Filtering

* Add companies along with **eligibility criteria** (CGPA, specialization, etc.)
* Dedicated company pages display **only eligible students**
* If no criteria are applied, **all students are shown** by default
* Real‑time filtering powered by backend validation

---

### Student Management & Profiles

* Centralized student list with:

  * Companies applied
  * Rounds cleared per company
* Dedicated **student profile page** showcasing:

  * 10th & 12th percentages / CGPA
  * Undergraduate details
  * LeetCode profile link
  *LeetCode statistics fetched via an external API, providing real‑time coding performance insights

---

### Round‑Wise Tracking & Database Updates

* Interactive table to track student progress
* One‑click actions to:

  * Mark a student as having **cleared a specific round**
  * Mark a student as **selected** for a company
* Each action updates the database instantly, maintaining consistency across dashboards

---

### Analytics & Insights Dashboard

* Dedicated analytics page showing:

  * Company‑wise student participation
  * Round‑wise drop‑off statistics
  * Number of students cleared per round per company
* Designed to provide **quick, high‑level insights** for placement officers

---

### AI‑Assisted Student Shortlisting

When companies request a limited number of candidates (e.g., *Top 10 students*), the system provides **unbiased recommendations** using a hybrid approach:

#### Phase 1 — Weighted Scoring (Cold Start)

* Used when **no company data is available**
* Students are ranked using a **weighted average** of:

  * Academics
  * Coding performance
  * Other normalized signals

#### Phase 2 — K‑Nearest Neighbors (KNN)

* Activated once sufficient placement data is available
* Uses historical outcomes to identify students **similar to previously successful candidates**
* Helps reduce manual bias and supports **data‑driven shortlisting**

> The ML logic is implemented in **Python** and prototyped via **Jupyter Notebook**, then integrated into the system workflow.

---

### Authentication & Security

* **JWT‑based authentication**
* Passwords securely hashed using **bcrypt**
* Authentication stored in **HTTP‑only, secure cookies**
* Designed with best practices to prevent common security flaws

---

## Tech Stack

### Frontend

* **React** — Component‑based UI
* **Tailwind CSS** — Utility‑first styling
* **Framer Motion** — Professional page‑level animations

### Backend

* **Node.js** & **Express** — REST API
* **MongoDB** — Scalable NoSQL database

### Machine Learning

* **Python** — KNN & weighted scoring logic
* **Jupyter Notebook** — Model experimentation & validation

### Security

* **JWT Authentication**
* **bcrypt** — Password hashing
* **Secure HTTP‑only cookies**

---

## 🎥 Demo

📺 **Video Walkthrough**: *(Coming Soon)*

> A complete walkthrough covering company setup, eligibility filtering, analytics, and AI‑assisted shortlisting.

---

> *Designed to reflect how modern placement systems should be built — structured, secure, and data‑driven.*
