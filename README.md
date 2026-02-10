# 🛡️ AI Image Guardian

**AI Image Guardian** is a full-stack, AI-powered image moderation platform that scans user-uploaded images for unsafe content such as nudity, violence, and weapons. Risky images are automatically flagged and visually shielded using a blur + warning interface to protect viewers.

The system is privacy-first, user-centric, and designed to demonstrate real-world AI moderation workflows.

---

## ✨ Key Features

### 🔍 AI Moderation Pipeline

* Images are uploaded and analyzed using the **Sightengine Image Moderation API**
* Each image is stored with:

  * Safety verdict (`is_safe`)
  * Confidence score (highest unsafe probability)
  * AI tags (e.g., *Nudity – explicit 84%*, *Weapon*)

### 🖼️ Privacy-Aware Gallery

* Unsafe images are **blurred by default**
* Content warning overlay with a **“View Anyway”** toggle
* Ensures user consent before displaying sensitive content

### 📊 User Dashboard & Profile

* Simple upload flow with **instant moderation feedback**
* Personal gallery of all scanned images
* Profile statistics:

  * Total images scanned
  * Safe vs flagged counts

### 🔐 Secure Authentication

* JWT-based authentication using **SimpleJWT**
* Register, login, refresh tokens
* All image and profile endpoints are protected

---

## 🧠 Tech Stack

**Frontend**

* React (Vite)
* React Router
* Axios

**Backend**

* Django
* Django REST Framework
* SimpleJWT

**AI Moderation**

* Sightengine Image Moderation API

**Database**

* SQLite (development/demo)
* Easily swappable with PostgreSQL for production

**Styling**

* Custom CSS
* Glassmorphism-inspired white/blue futuristic theme

---

## 🏗️ Architecture Overview

1. User authenticates using JWT.
2. Authenticated user uploads an image.
3. Django backend stores the image and sends it to Sightengine’s `/check.json` endpoint.
4. Sightengine response is parsed into:

   * `is_safe` (boolean)
   * `confidence_score`
   * `ai_tags`
5. Gallery and profile pages fetch data via API and render a **privacy-first UI**.

---

## 📁 Project Structure

```
AI-image-Guardian/
│
├── backend/
│   ├── core/                 # Django project (settings, URLs)
│   ├── api/                  # App: models, serializers, views, AI integration
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Register, Dashboard, Gallery, Profile
│   │   ├── components/       # Navbar, ImageCard, ProtectedRoute
│   │   ├── context/          # AuthContext (JWT handling)
│   │   └── api.js            # Axios client
│   └── vite.config.js        # Dev proxy for /api and /media
│
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Backend (Django)

```bash
cd backend/core
python -m venv venv
```

**Activate virtual environment**

* Windows (PowerShell):

```bash
.\venv\Scripts\Activate.ps1
```

* macOS / Linux:

```bash
source venv/bin/activate
```

**Install dependencies & migrate**

```bash
pip install -r requirements.txt
python manage.py migrate
```

**Create `.env` file**

```env
DJANGO_SECRET_KEY=your_dev_secret
SIGHTENGINE_API_USER=your_user_id
SIGHTENGINE_API_SECRET=your_secret
```

**Run server**

```bash
python manage.py runserver 8001
```

**API Base URL**

```
http://127.0.0.1:8001/api/
```

---

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

**Vite Dev Server**

```
http://localhost:5173
```

During development:

* `/api` and `/media` are proxied to `http://127.0.0.1:8001`

---

## 🔑 API Endpoints

### Authentication

```http
POST /api/register/   → { username, email, password }
POST /api/login/      → JWT access + refresh tokens
```

All protected routes require:

```
Authorization: Bearer <access_token>
```

### Image Operations

```http
POST /api/upload/     → Upload image (multipart/form-data)
GET  /api/gallery/    → User’s image list
GET  /api/stats/      → { total_uploads, safe_images, flagged_images }
```

---

## 🌍 Deployment

Deployment guides are available in `docs/deployment.md` and include:

* **Backend**: Render (Django REST API)
* **Frontend**: Netlify / Vercel (React SPA)

---

## 🔮 Future Improvements

* Role-based access (moderators vs regular users)
* Multiple AI providers with fallback support
* Email alerts for flagged content
* Admin dashboard for global moderation analytics
* Cloud storage (S3 / Cloudinary)

---

## 📜 License

MIT License
(You are free to modify or replace this with your preferred license.)
