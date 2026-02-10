# AI Image Guardian

Full‑stack AI-powered image guardian that scans user uploads for unsafe content (nudity, violence, weapons, etc.), automatically flags risky images, and shields viewers with a blur + warning UI.

## Features

- **AI moderation pipeline** – images are uploaded, analyzed by Sightengine, and stored with safety verdict and tags.
- **Privacy‑aware gallery** – unsafe images are blurred by default with a content warning overlay and “view anyway” toggle.
- **User dashboard** – simple upload flow with instant feedback and a personal gallery of all scanned images.
- **Profile & stats** – per‑user summary of total photos scanned, safe vs flagged counts.
- **JWT authentication** – register, login, and protect all image endpoints behind auth.

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios
- **Backend**: Django, Django REST Framework, SimpleJWT
- **AI Moderation**: Sightengine Image Moderation API
- **Database**: SQLite (dev/demo), easily swappable for Postgres
- **Styling**: Custom CSS (glassmorphism, white/blue futuristic theme)

## Architecture Overview

1. User authenticates via JWT.
2. Authenticated user uploads an image from the dashboard.
3. Django saves the file, then calls Sightengine’s `/check.json` endpoint.
4. Response is interpreted into:
   - `is_safe` (bool)
   - `confidence_score` (max unsafe score)
   - `ai_tags` (reasons like “Nudity (explicit 84%)” or “Weapon”).
5. Gallery and profile pages read from the API and render a privacy‑first UI.

## Project Structure
AI-image-Guardian/
backend/
core/
api/ # Django app: models, serializers, views, Sightengine integration
core/ # Django project: settings, URLs
manage.py
requirements.txt
frontend/
src/
pages/ # Login, Register, Dashboard (Upload), Gallery, Profile
components/ # Navbar, ImageCard, ProtectedRoute
context/ # AuthContext (JWT handling)
api.js # Axios client
vite.config.js # Dev proxy for /api and /media


## Getting Started (Local)

### 1. Backend (Django)
cd backend/core
python -m venv venv

Windows PowerShell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate

Create a `.env` (or set env vars) with:
DJANGO_SECRET_KEY=your_dev_secret
SIGHTENGINE_API_USER=your_user_id
SIGHTENGINE_API_SECRET=your_secret

Run the server:
python manage.py runserver 8001

API base: `http://127.0.0.1:8001/api/`

### 2. Frontend (React)
cd frontend
npm install
npm run dev

Vite dev server: `http://localhost:5173`

During development, `/api` and `/media` are proxied to `http://127.0.0.1:8001`.

### 3. Auth Flows (API)

- `POST /api/register/` → `{ username, email, password }`
- `POST /api/login/` → SimpleJWT `access` + `refresh`
- All image endpoints require `Authorization: Bearer <access>`.

### 4. Image Flows (API)

- `POST /api/upload/` – multipart form, field `image`
- `GET /api/gallery/` – list of current user images
- `GET /api/stats/` – `{ total_uploads, safe_images, flagged_images }`

## Deployment

See `docs/deployment.md` (or the “Step‑by‑step deployment” section in this README) for instructions using:
- Render (Django API)
- Netlify/Vercel (React SPA)

## Future Improvements

- Role‑based access (moderators vs regular users).
- Support for multiple AI providers (fallbacks if Sightengine is down).
- Email notifications when unsafe content is flagged.
- Admin dashboard for global moderation analytics.

## License

MIT (or your preferred license).
