# AI Image Guardian – Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This SRS describes the functional and non‑functional requirements for **AI Image Guardian**, a web application that automatically analyzes user‑uploaded images for unsafe content and presents them through a privacy‑respecting interface.

### 1.2 Scope

The system enables registered users to:

- Upload images for automated safety analysis.
- View a personal gallery of scanned images.
- See which images are safe vs flagged, and why.
- View aggregated statistics about their own uploads.

The system is not intended to be a legal content moderation tool and does not replace human review for critical scenarios.

### 1.3 Definitions, Acronyms

- **AI Moderation Provider**: Third‑party service (Sightengine) that classifies content.
- **Safe Image**: Image that is not flagged as unsafe by the moderation provider.
- **Flagged Image / Unsafe Image**: Image for which the provider indicates a high probability of nudity, violence, weapons, etc.

## 2. Overall Description

### 2.1 Product Perspective

AI Image Guardian is a standalone web application with:

- React SPA frontend (browser).
- REST API backend (Django + DRF).
- External AI moderation provider (Sightengine).

### 2.2 User Classes

- **Regular User**: Can register, login, upload images, view their gallery and stats.
- **Administrator** (future): Manages the system via Django admin, may inspect all images.

### 2.3 Assumptions and Dependencies

- Stable internet access between backend and Sightengine API.
- Sightengine API keys are correctly configured.
- Users will not rely solely on the system for legal or compliance decisions.

## 3. Functional Requirements

### FR‑1: User Registration

- The system shall allow new users to register with `username`, `email`, and `password`.
- The system shall validate that usernames are unique.

### FR‑2: User Authentication

- The system shall allow users to log in with username and password.
- The system shall issue JWT access and refresh tokens on successful login.
- The system shall require a valid access token to call image endpoints.

### FR‑3: Image Upload

- The system shall allow authenticated users to upload an image file via a web form.
- The system shall persist the uploaded file to server storage.
- The system shall associate each image with the uploading user and timestamp.

### FR‑4: AI Moderation

- After storing the image, the backend shall call the Sightengine API with the image.
- The system shall interpret the API response into:
  - `is_safe` (boolean),
  - `confidence_score` (float),
  - `ai_tags` (string reasons).
- If the AI provider is unavailable or returns an error, the system shall:
  - mark `is_safe = false` (conservative default),
  - set `ai_tags` to an appropriate error tag (e.g. "API Error").

### FR‑5: Gallery View

- The system shall provide an endpoint to list images for the authenticated user.
- The React frontend shall display images in a card grid with:
  - thumbnail (blurred if unsafe),
  - upload date,
  - status badge (safe/unsafe),
  - confidence and tags.

### FR‑6: Privacy‑Aware Display

- The frontend shall blur unsafe images by default.
- The frontend shall show a warning overlay and allow the user to intentionally reveal the image.

### FR‑7: User Statistics

- The backend shall compute, per user:
  - total number of uploaded images,
  - count of safe images,
  - count of flagged images.
- The profile page shall display these statistics in a simple dashboard.

### FR‑8: Error Handling

- The system shall display clear, user‑friendly errors for:
  - failed login/registration,
  - failed upload,
  - failed AI moderation.
- Technical details shall be logged server‑side, not disclosed to end users.

## 4. Non‑Functional Requirements

### NFR‑1: Security

- All authenticated endpoints shall require a valid JWT access token.
- Passwords shall be stored hashed using Django’s built‑in password hashing.

### NFR‑2: Performance

- The system should process an upload + AI moderation in under 5 seconds under normal conditions.
- The UI should remain responsive while moderation is in progress (e.g. via loading states).

### NFR‑3: Usability

- The UI shall be responsive and usable on common desktop and mobile viewport sizes.
- Unsafe images shall never be shown by default; users must opt in to view them.

### NFR‑4: Reliability

- In case of AI service failure, uploads should still succeed, and images should be conservatively marked as unsafe.

### NFR‑5: Maintainability

- The system shall separate concerns into layers:
  - Django models/serializers/views for backend,
  - React components/pages/context for frontend.
- Configuration (keys, URLs) shall be stored in environment variables.

## 5. External Interface Requirements

- **REST API**: JSON over HTTPS, standard HTTP status codes.
- **Third‑party API**: Sightengine `/1.0/check.json` endpoint for image moderation.

## 6. Future Enhancements

- Role‑based moderation queue for human reviewers.
- Exportable reports for users (CSV of moderation history).
- Multi‑language UI support.
