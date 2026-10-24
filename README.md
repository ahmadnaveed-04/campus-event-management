# Campus Event Management System

A student team project for browsing campus events and registering for them. The project has a responsive HTML/CSS/JavaScript frontend and a Node.js/Express API backed by SQLite.

## Features

- Browse campus events and search/filter the event list.
- Open an event details page.
- Register a student for an event.
- Create an account and log in through the API.
- View recent registrations on the student dashboard.
- Store users, events, and registrations in SQLite.

## Project structure

```text
campus-event-management/
├── backend/
│   ├── server.js       # Express API and SQLite initialization
│   ├── package.json    # Backend dependencies
│   └── DATABASE.md     # Database schema and API verification guide
├── documentation/     # Additional project documents
├── frontend/
│   ├── index.html     # Homepage, event list, and registration form
│   ├── event-details.html
│   ├── login.html
│   ├── dashboard.html
│   └── README.md
├── screenshots/       # Project demo images
└── README.md
```

## Requirements

- Node.js and npm
- A web browser

## Run locally on Windows

1. Open PowerShell or the VS Code terminal at the repository folder.
2. Install backend packages (first run, or after dependencies change):

   ```powershell
   cd backend
   npm install
   ```

3. Start the API server:

   ```powershell
   node server.js
   ```

   Keep this terminal open. The API runs at `http://localhost:5000` and creates `backend/campus_events.db` automatically with sample events on first run.

4. Open `frontend/index.html` in a browser. In Chrome, press `Ctrl+O` and choose the file, or open it from File Explorer.
5. To see saved registrations, open `frontend/dashboard.html` in the browser while the backend is running.

When opened directly from disk, the frontend calls the local API at `http://localhost:5000`. When served by Express (including the hosted deployment), it uses the same site's API routes.

## Deploy on Render

The repository includes a `render.yaml` Blueprint for deploying the frontend and Express API together as one web service.

1. Push the project changes to the GitHub repository's `main` branch.
2. Sign in to Render and choose **New → Blueprint**.
3. Connect `ahmadnaveed-04/campus-event-management` and let Render read `render.yaml`.
4. Create the service and wait for the deploy to finish.
5. Open the `onrender.com` URL shown in the Render dashboard. The home page is `/`, the dashboard is `/dashboard.html`, and the API health check is `/api/health`.

The free Render service is suitable for a classroom demo. It can sleep after inactivity and its filesystem is temporary, so the SQLite database and registrations can reset after a restart, sleep, or redeploy. Use persistent database storage for data that must be kept.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/register` | Register a student for an event |
| GET | `/api/registrations` | List registrations with event titles |
| POST | `/api/signup` | Create a student account |
| POST | `/api/login` | Verify student login credentials |

Request fields and database tables are documented in [backend/DATABASE.md](backend/DATABASE.md).

## Team roles

- Student 1: Team lead and repository coordination
- Student 2: Frontend homepage and visual design
- Student 3: Frontend search, event pages, registration, login, and dashboard
- Student 4: Express server and API
- Student 5: Database documentation and API verification

## Demo flow

1. Start the backend server.
2. Show the homepage, event search, and category filter.
3. Open an event and submit a registration.
4. Open the dashboard and show the saved registration.

See `frontend/README.md` for frontend file details and `backend/DATABASE.md` for the schema and manual API verification steps.
