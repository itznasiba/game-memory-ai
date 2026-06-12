# 🎮 Game Memory AI

Your personal RPG journal that records, remembers, and analyzes your gaming adventures with Claude AI.
It collects memories from the games you play — screenshots and sessions — turns them into a timeline, and helps you pick up right where you left off with the "Continue Journey" feature.

## ✨ Key Features

- 🔐 JWT-based authentication (register / login)
- 🎮 Game library management (My Games)
- 🧠 AI-powered screenshot analysis with Claude Vision
- 📅 Chronological session timeline
- 💬 AI chat about your gaming history
- 🏆 Achievements
- 🚀 "Continue Journey" — smart summary to jump back into a game


## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript, Tailwind CSS (CDN)

**Backend:** FastAPI, SQLAlchemy 2.0, PostgreSQL (asyncpg), Alembic, Pydantic, JWT (python-jose), Anthropic Claude API

## 🚀 Getting Started

### Backend (with Docker)

1. Go to the `game-memory-backend` folder and create a `.env` file (based on `.env.example`):

```bash
cd game-memory-backend
cp .env.example .env
```

2. Fill in `SECRET_KEY` and `ANTHROPIC_API_KEY` in the `.env` file.

3. Start the backend and database with Docker Compose:

```bash
docker-compose up --build
```

4. The API will be available at:
   - API: http://localhost:8000
   - Swagger docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

All endpoints are registered under the `/api/v1` prefix (`auth`, `games`, `memories`, `chat`).

### Frontend

Serve the HTML files in `frontend/pages/` with a static server (e.g. VS Code Live Server or):

```bash
cd frontend/pages
python -m http.server 5500
```

Then open `http://localhost:5500/login.html` in your browser.

> Note: `http://localhost:5500` is already included in the allowed CORS origins.

