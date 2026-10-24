# Database and API Guide

The backend uses SQLite. On startup, it creates `campus_events.db` in this folder, creates the tables if they do not exist, and inserts two sample events if the events table is empty. The local database file is ignored by Git and should not be committed.

## Database tables

### `users`

Stores student accounts. Passwords are saved as bcrypt hashes, not plain text.

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key, generated automatically |
| `name` | Text | Required |
| `email` | Text | Required and unique |
| `password` | Text | Required; bcrypt hash |

### `events`

Stores the events students can browse and register for.

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key, generated automatically |
| `title` | Text | Required event name |
| `description` | Text | Event information |
| `date` | Text | Required event date (`YYYY-MM-DD`) |
| `time` | Text | Event time |
| `location` | Text | Venue |
| `category` | Text | Event category |
| `capacity` | Integer | Maximum attendee count; defaults to 100 |

### `registrations`

Stores each student's registration for an event.

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key, generated automatically |
| `name` | Text | Required student name |
| `email` | Text | Required student email |
| `event_id` | Integer | Required event ID; references `events.id` |
| `registration_date` | Text | Defaults to the current SQLite timestamp |

## API routes

| Method | Endpoint | Request body / result |
|---|---|---|
| GET | `/api/events` | Returns all events ordered by date |
| GET | `/api/events/:id` | Returns one event; 404 if missing |
| POST | `/api/events` | Requires `title` and `date`; accepts description, time, location, category, capacity |
| PUT | `/api/events/:id` | Updates event fields; 404 if missing |
| DELETE | `/api/events/:id` | Deletes an event; 404 if missing |
| POST | `/api/register` | Requires `name`, `email`, and `event_id` |
| GET | `/api/registrations` | Returns registrations with their event title |
| POST | `/api/signup` | Requires `name`, `email`, and `password`; returns 409 for a duplicate email |
| POST | `/api/login` | Requires `email` and `password`; returns 401 for invalid credentials |

## Start the backend

Open PowerShell at the repository root and run:

```powershell
cd backend
npm install
node server.js
```

Keep this terminal open. The server listens at `http://localhost:5000`.

## Manually verify events and registrations

Open a second PowerShell terminal while the server is running.

List the sample events:

```powershell
Invoke-RestMethod http://localhost:5000/api/events
```

Register a sample student for event ID 1:

```powershell
$body = @{ name = "Test Student"; email = "test@example.com"; event_id = 1 } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/register -Method Post -ContentType "application/json" -Body $body
```

Confirm the registration was saved:

```powershell
Invoke-RestMethod http://localhost:5000/api/registrations
```

The registration should include the student name, email, event ID, registration date, and event title.
