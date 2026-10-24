# Database and API Guide

The hosted application uses Neon PostgreSQL. The API creates the tables and two sample events on the first request. Set `DATABASE_URL` to the Neon connection string before starting the backend. Keep that connection string private and do not commit `.env` files.

## Database tables

### `users`

Stores student accounts. Passwords are saved as bcrypt hashes, not plain text.

| Column | Type | Notes |
|---|---|---|
| `id` | Serial | Primary key, generated automatically |
| `name` | Text | Required |
| `email` | Text | Required and unique |
| `password` | Text | Required; bcrypt hash |

### `events`

Stores the events students can browse and register for.

| Column | Type | Notes |
|---|---|---|
| `id` | Serial | Primary key, generated automatically |
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
| `id` | Serial | Primary key, generated automatically |
| `name` | Text | Required student name |
| `email` | Text | Required student email |
| `event_id` | Integer | Required; references `events.id` |
| `registration_date` | Timestamp | Defaults to the database's current timestamp |

## API routes

| Method | Endpoint | Request body / result |
|---|---|---|
| GET | `/api/health` | Database health status |
| GET | `/api/events` | Returns all events ordered by date |
| GET | `/api/events/:id` | Returns one event; 404 if missing |
| POST | `/api/events` | Requires `title` and `date`; accepts description, time, location, category, capacity |
| PUT | `/api/events/:id` | Updates event fields; 404 if missing |
| DELETE | `/api/events/:id` | Deletes an event; 404 if missing |
| POST | `/api/register` | Requires `name`, `email`, and `event_id` |
| GET | `/api/registrations` | Returns registrations with event titles |
| POST | `/api/signup` | Requires `name`, `email`, and `password`; returns 409 for a duplicate email |
| POST | `/api/login` | Requires `email` and `password`; returns 401 for invalid credentials |

## Run locally

1. Create a free Neon project and copy its pooled PostgreSQL connection string.
2. Copy `.env.example` to `.env` in this folder and set `DATABASE_URL` to that connection string.
3. From the repository root, run:

   ```powershell
   npm install --prefix backend
   npm start --prefix backend
   ```

4. Open `http://localhost:5000`. The first request initializes the tables and sample events.

Never put the Neon connection string in frontend code or commit it to GitHub.
