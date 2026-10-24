# Frontend

The frontend is a set of standalone HTML pages using HTML, CSS, and JavaScript.

## Pages

- `index.html` — campus homepage, event search/category filter, and event registration form.
- `event-details.html` — event details page.
- `login.html` — student login form connected to the login API.
- `dashboard.html` — recent registrations loaded from the API.

## Run the frontend locally

1. Start the backend first. From the repository root, run:

   ```powershell
   cd backend
   npm install
   node server.js
   ```

2. Keep the terminal running the server open.
3. Open `index.html` in a browser. Use `Ctrl+O` in Chrome to select the file if needed.
4. Open `dashboard.html` the same way to view saved registrations.

The pages call the backend at `http://localhost:5000`. If the backend is stopped, API-backed registration, login, and dashboard features cannot load.
