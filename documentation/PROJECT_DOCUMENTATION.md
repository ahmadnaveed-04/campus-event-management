# Campus Event Management System

## 1. Project overview

Campus Event Management System is a university project that lets students browse campus events, search and filter them, view event details, and register. The project uses a static HTML/CSS/JavaScript frontend, a Node.js/Express API, and an SQLite database.

## 2. Features

- Responsive campus events homepage
- Event search and category filtering
- Event details page
- Student registration form connected to the API
- Login page connected to the login API
- Dashboard showing recent registrations
- SQLite storage for events, student accounts, and registrations

## 3. Project screenshots

Screenshots shared during the mini-project work are saved in the repository's `screenshots/` folder and grouped below.

### Website pages and local run

![Campus Events homepage](../screenshots/home-page.png)

![Dashboard showing recent registrations](../screenshots/dashboard-registrations.png)

![VS Code project and README](../screenshots/vscode-project-and-readme.png)

![Starting the frontend from the terminal](../screenshots/open-frontend-html-terminal.png)

![Windows file picker used to open the frontend](../screenshots/windows-open-file-dialog.png)

### Backend and API verification

![Express dependency missing error](../screenshots/backend-missing-express-error.png)

![Backend server running](../screenshots/backend-server-running.png)

![Backend server terminal](../screenshots/backend-server-terminal.png)

![Events API response](../screenshots/api-events-response.png)

![Successful student registration API response](../screenshots/api-registration-created.png)

![Registrations API response](../screenshots/api-registrations-response.png)

### GitHub issues, labels, and contributors

![Issue 8 opened](../screenshots/github-issue-08-created.png)

![Open issues list](../screenshots/github-open-issues-list.png)

![Issue 8 details](../screenshots/github-issue-08-details.png)

![GitHub label filter](../screenshots/github-label-filter.png)

![Issue 8 with assignees and labels](../screenshots/github-issue-08-assignees-labels.png)

![Issue with two assignees](../screenshots/github-issue-two-assignees.png)

![Final issue list](../screenshots/github-issue-list-final.png)

![Repository contributors](../screenshots/github-contributors-four.png)

![GitHub contributors chart](../screenshots/github-contributors-chart.png)

### Pull requests and database documentation workflow

![Pull request 7 overview](../screenshots/github-pr-07-overview.png)

![Pull request 7 package changes](../screenshots/github-pr-07-package-diff.png)

![Database documentation branch status](../screenshots/git-database-doc-status.png)

![Staging the database documentation](../screenshots/git-stage-database-doc.png)

![Committing the database documentation](../screenshots/git-commit-database-doc.png)

![Pushing the database documentation branch](../screenshots/git-push-database-branch.png)

![Creating the documentation pull request](../screenshots/github-create-pr-form.png)

![Documentation pull request](../screenshots/github-pr-09-created.png)

![Selecting a pull request reviewer](../screenshots/github-reviewer-menu.png)

![Documentation pull request merged](../screenshots/github-pr-09-merged.png)

![Pulling the merged database documentation](../screenshots/git-pull-database-doc.png)

![Pulling the latest main branch](../screenshots/git-pull-main.png)

## 4. Technology stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express
- Database: SQLite (`sqlite3`)
- Password hashing: `bcryptjs`
- Cross-origin requests: `cors`
- Collaboration: Git and GitHub

## 5. Project files

```text
campus-event-management/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── DATABASE.md
├── documentation/
│   └── PROJECT_DOCUMENTATION.md
├── frontend/
│   ├── index.html
│   ├── event-details.html
│   ├── login.html
│   └── dashboard.html
├── screenshots/
└── README.md
```

`backend/server.js` starts the Express server, creates the SQLite tables if needed, and inserts sample events when the events table is empty. The database file is created locally as `backend/campus_events.db` and is ignored by Git.

## 6. Requirements

- Node.js and npm installed
- A web browser such as Chrome
- A copy of this repository

## 7. Run the project on Windows

1. Open PowerShell or the VS Code terminal at the repository folder.
2. Install the backend dependencies:

   ```powershell
   cd backend
   npm install
   ```

3. Start the backend server:

   ```powershell
   node server.js
   ```

4. Keep the terminal running the server open. The API address is `http://localhost:5000`.
5. In Chrome, press `Ctrl+O` and open `frontend/index.html` from the repository folder.
6. To view registrations, press `Ctrl+O` again and open `frontend/dashboard.html`.

The frontend pages use `http://localhost:5000` for API requests. Registration, login, and dashboard data need the backend server to be running.

## 8. Deploy the project on Render

The repository's `render.yaml` configures one Render web service to serve both the frontend pages and Express API.

1. Push the project files to the GitHub repository's `main` branch.
2. Sign in to Render and choose **New → Blueprint**.
3. Connect the `ahmadnaveed-04/campus-event-management` GitHub repository. Render reads the deployment settings from `render.yaml`.
4. Create the service and wait until Render reports that the deploy is live.
5. Open the provided `onrender.com` address. The homepage is `/`, dashboard is `/dashboard.html`, and health check is `/api/health`.
6. Verify events at `/api/events`, submit a registration from the homepage, and check the dashboard.

Render's free web service may sleep after inactivity and uses an ephemeral filesystem. Since this project stores data in a local SQLite file, registrations can disappear after sleep, a restart, or a redeploy. This setup is for a demo; use persistent storage or a managed database if the data must be retained.

## 9. API reference

All routes use the base address `http://localhost:5000`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | Return all events, ordered by date |
| GET | `/api/events/:id` | Return one event |
| POST | `/api/events` | Create an event; `title` and `date` are required |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/register` | Register a student; requires `name`, `email`, and `event_id` |
| GET | `/api/registrations` | Return registrations with event titles |
| GET | `/api/health` | Health check for hosting platform |
| POST | `/api/signup` | Create an account; requires `name`, `email`, and `password` |
| POST | `/api/login` | Check an account's email and password |

### Example registration request

```json
{
  "name": "Test Student",
  "email": "test@example.com",
  "event_id": 1
}
```

## 10. Database schema

### `users`

Stores student accounts. Password values are saved as bcrypt hashes.

| Column | Description |
|---|---|
| `id` | Automatically generated primary key |
| `name` | Student name |
| `email` | Required unique email address |
| `password` | Required hashed password |

### `events`

| Column | Description |
|---|---|
| `id` | Automatically generated primary key |
| `title` | Required event name |
| `description` | Event details |
| `date` | Required date in `YYYY-MM-DD` format |
| `time` | Event time |
| `location` | Event venue |
| `category` | Event category |
| `capacity` | Event capacity; defaults to 100 |

### `registrations`

| Column | Description |
|---|---|
| `id` | Automatically generated primary key |
| `name` | Registered student's name |
| `email` | Registered student's email |
| `event_id` | ID of the selected event |
| `registration_date` | Registration timestamp |

## 11. Manually verify the API

Keep the backend running. Open a second PowerShell terminal at the repository folder.

List events:

```powershell
Invoke-RestMethod http://localhost:5000/api/events
```

Register a sample student for event ID 1:

```powershell
$body = @{ name = "Test Student"; email = "test@example.com"; event_id = 1 } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/register -Method Post -ContentType "application/json" -Body $body
```

Confirm the registration appears in the database response:

```powershell
Invoke-RestMethod http://localhost:5000/api/registrations
```

The result should include the student's name, email, event ID, registration date, and event title.

## 12. Demo flow

1. Start the backend and keep its terminal open.
2. Open the homepage and show the event list, search, and category filter.
3. Open event details and submit a registration.
4. Open the dashboard and show the saved registration.
5. Explain that the API stores the event and registration data in SQLite.

## 13. Team responsibilities

- Student 1: Team lead and GitHub repository coordination
- Student 2: Homepage design and responsive frontend
- Student 3: Search, event details, registration, login, and dashboard pages
- Student 4: Express server and API routes
- Student 5: Database documentation and API verification

## 14. Current project notes

- The backend seeds two sample events when the database has no events.
- The registration API verifies that the selected event exists.
- Event capacity is stored, but the current registration route does not enforce a capacity limit.
- The login route verifies credentials but does not issue a login token or maintain a server-side session.
- The frontend selects the local API when opened from disk and same-origin API routes when hosted through Express.
- Render's free service uses temporary local storage, so the SQLite database is not durable there.
