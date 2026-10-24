# Frontend

The frontend is a set of standalone HTML pages using HTML, CSS, and JavaScript.

## Pages

- `index.html` — campus homepage, event search/category filter, and event registration form.
- `event-details.html` — event details page.
- `login.html` — student login form connected to the login API.
- `dashboard.html` — recent registrations loaded from the API.

## Run the frontend locally

1. Create a Neon PostgreSQL database and put its connection string in `backend/.env` as `DATABASE_URL=...`.
2. Start the backend from the repository root:

   ```powershell
   cd backend
   npm install
   node server.js
   ```

3. Keep the terminal running the server open.
4. Open `index.html` in a browser. Use `Ctrl+O` in Chrome to select the file if needed.
5. Open `dashboard.html` the same way to view saved registrations.

The pages call the backend at `http://localhost:5000`. If the backend is stopped, API-backed registration, login, and dashboard features cannot load.
