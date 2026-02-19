# 🔄 CleanSync Fullstack

CleanSync is a modern, full-stack application designed to streamline customer management and booking workflows through an intuitive dashboard.

---

## 🚀 Features

* 📊 **Dashboard** – High-level overview of key business metrics.
* 👥 **Customer CRM** – Centralized database to add, edit, and track customer profiles.
* 📅 **Booking Engine** – Real-time creation and monitoring of service appointments.
* ⚡ **High Performance** – Optimized backend and responsive frontend for a lag-free experience.
* 🔧 **Scalable Architecture** – Modular code structure ready for feature expansion.

---

## 🛠️ Tech Stack

* **Backend:** FastAPI (Python), SQLAlchemy, Pydantic
* **Frontend:** React/Next.js, Tailwind CSS
* **API Documentation:** Swagger UI & ReDoc

---

## 🖥️ Run Locally

Follow these steps to get your development environment up and running.

### 1️⃣ Backend Setup
Navigate to the `/backend` directory in your terminal:

```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
