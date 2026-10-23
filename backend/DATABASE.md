# Database and API Guide

The backend creates `campus_events.db` inside the `backend` folder when the server starts. The database file is local and should not be committed to Git.

## SQLite tables

### `users`

Stores student accounts.

| Column | Purpose |
|---|---|
| `id` | Unique account ID |
| `name` | Student name |
| `email` | Unique email address |
| `password` | Hashed password |

### `events`

Stores campus events.

| Column | Purpose |
|---|---|
| `id` | Unique event ID |
| `title` | Event name |
| `description` | Event details |
| `date` | Event date |
| `time` | Event time |
| `location` | Event location |
| `category` | Event category |
| `capacity` | Maximum number of attendees |

### `registrations`

Stores student event registrations.

| Column | Purpose |
|---|---|
| `id` | Unique registration ID |
| `name` | Student name |
| `email` | Student email |
| `event_id` | ID of the selected event |
| `registration_date` | Time the student registered |

## Start the backend

From the project folder, run:

```cmd
cd backend
node server.js