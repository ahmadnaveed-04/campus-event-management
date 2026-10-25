# Campus Event Management System

A student team project for browsing campus events and registering for them. It has a responsive HTML/CSS/JavaScript frontend, a Node.js/Express API, and a Neon PostgreSQL database for deployment.

## Features

- Browse campus events and search/filter the event list.
- Open an event details page.
- Register a student for an event.
- Create an account and log in through the API.
- View recent registrations on the student dashboard.
- Store users, events, and registrations in PostgreSQL.

## Project structure

```text
campus-event-management/
├── backend/
│   ├── server.js       # Express API and PostgreSQL initialization
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
├── api/               # Vercel serverless API entry point
├── vercel.json        # Vercel deployment configuration
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

3. Create a Neon database, copy its connection string, and put it in `backend/.env`:

   ```text
   DATABASE_URL=your-Neon-connection-string
   ```

   Start the API server:

   ```powershell
   node server.js
   ```

   Keep this terminal open. The API runs at `http://localhost:5000` and creates its tables and sample events on first request.

4. Open `frontend/index.html` in a browser. In Chrome, press `Ctrl+O` and choose the file, or open it from File Explorer.
5. To see saved registrations, open `frontend/dashboard.html` in the browser while the backend is running.

When opened directly from disk, the frontend calls the local API at `http://localhost:5000`. When hosted, it uses the same site's API routes.

## Deploy on Vercel with Neon

The repository includes a Vercel serverless API entry point. The static frontend and API are deployed together; Neon stores registrations and accounts in PostgreSQL.

1. Create a free Neon project and copy its pooled connection string. Keep it private.
2. Push the project to GitHub, then import `ahmadnaveed-04/campus-event-management` into Vercel.
3. Keep the project root as the root directory. The included `vercel.json` installs the backend dependencies and configures the API function.
4. In Vercel project settings, add the environment variable `DATABASE_URL` with the Neon connection string, for **Production**, **Preview**, and **Development**.
5. Deploy. Open the Vercel URL; `/` is the home page, `/dashboard.html` is the dashboard, and `/api/health` checks the API and database.

The free plans and signup requirements can change. Use only the Free/Hobby options and do not upgrade to a paid plan. Never commit `backend/.env` or share the database connection string.

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


## Screenshots

### Website

![Home page](screenshots/home-page.png)

![Event listing](screenshots/event-listing.png)

![Search result](screenshots/search-result.png)

![Event details](screenshots/event-details.png)

![Login page](screenshots/login-page.png)

![Registration form](screenshots/registration-form.png)

![Registration successful](screenshots/registration-successful.png)

### Running the project

![npm install](screenshots/npm-install.png)

![Server running](screenshots/server-running.png)

![Events API](screenshots/api-events.png)

### API testing (Postman)

![Postman collection](screenshots/postman-collection.png)

![Postman GET](screenshots/postman-get-event-200.png)

![Postman POST](screenshots/postman-post-event-201.png)

![Postman PUT](screenshots/postman-put-event-200.png)

![Postman DELETE](screenshots/postman-delete-event-200.png)

![Postman register](screenshots/postman-register-201.png)

![Postman duplicate registration](screenshots/postman-duplicate-409.png)

![Postman registrations](screenshots/postman-get-registrations-200.png)

### Deployment (AWS EC2)

![EC2 instance running](screenshots/deploy-01-ec2-instance-running.png)

![Clone on server](screenshots/deploy-02-clone-repo-on-server.png)

![npm install on server](screenshots/deploy-03-npm-install-on-server.png)

![systemd service](screenshots/deploy-04-systemd-service.png)

![Nginx config](screenshots/deploy-05-nginx-config.png)

![Service active](screenshots/deploy-06-service-active-health-ok.png)

![Live website](screenshots/deploy-07-live-website-on-ec2.png)

![Live registration](screenshots/deploy-08-live-registration-successful.png)

### Team collaboration on GitHub

![Repository front page](screenshots/github-repo.png)

![Contributors](screenshots/github-contributors.png)

![Labels](screenshots/github-labels.png)

![Issues list](screenshots/github-issues-list.png)

![Issue 4](screenshots/github-issue-4-frontend.png)

![Issue 6](screenshots/github-issue-6-backend.png)

![Issue 8](screenshots/github-issue-8-database.png)

![Merged Pull Requests](screenshots/github-pull-requests-merged-list.png)

![PR 1](screenshots/github-pr-1-frontend-ui.png)

![PR 5](screenshots/github-pr-5-frontend-functionality.png)

![PR 7](screenshots/github-pr-7-backend-api.png)

![PR 9 request review](screenshots/github-pr-9-request-review.png)

![PR 9 approved and merged](screenshots/github-pr-9-approved-merged.png)

![PR 10 screenshots added](screenshots/github-pr-10-add-screenshots-merged.png)
![Sign-up page](screenshots/signup-page.png)

![Branches](screenshots/github-branches.png)

![Commit history](screenshots/github-commits.png)

![PR 10 screenshots added](screenshots/github-pr-10-add-screenshots-merged.png)
