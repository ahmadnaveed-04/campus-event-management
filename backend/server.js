const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_PATH =
  process.env.DATABASE_PATH || path.join(__dirname, "campus_events.db");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const db = new sqlite3.Database(
  DATABASE_PATH,
  (error) => {
    if (error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

function run(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, values, function (error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, values, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, values, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function startServer() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      category TEXT,
      capacity INTEGER DEFAULT 100
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      event_id INTEGER NOT NULL,
      registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `);

  const eventCount = await get("SELECT COUNT(*) AS count FROM events");

  if (eventCount.count === 0) {
    await run(
      `INSERT INTO events
        (title, description, date, time, location, category, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "AI Workshop",
        "Learn about artificial intelligence and build a small project.",
        "2026-11-15",
        "10:00",
        "Main Hall",
        "Technology",
        100,
      ]
    );

    await run(
      `INSERT INTO events
        (title, description, date, time, location, category, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Campus Sports Day",
        "Join students for a day of sports and activities.",
        "2026-11-20",
        "09:00",
        "Sports Ground",
        "Sports",
        200,
      ]
    );
  }

  app.get("/", (req, res) => {
    res.send("Campus Event Management API is running.");
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await all("SELECT * FROM events ORDER BY date");
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Could not load events." });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await get("SELECT * FROM events WHERE id = ?", [
        req.params.id,
      ]);

      if (!event) return res.status(404).json({ error: "Event not found." });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Could not load the event." });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const { title, description, date, time, location, category, capacity } =
        req.body;

      if (!title || !date) {
        return res.status(400).json({ error: "Title and date are required." });
      }

      const result = await run(
        `INSERT INTO events
          (title, description, date, time, location, category, capacity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || "",
          date,
          time || "",
          location || "",
          category || "",
          Number(capacity) || 100,
        ]
      );

      const event = await get("SELECT * FROM events WHERE id = ?", [result.id]);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Could not create the event." });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const { title, description, date, time, location, category, capacity } =
        req.body;

      const result = await run(
        `UPDATE events
         SET title = ?, description = ?, date = ?, time = ?,
             location = ?, category = ?, capacity = ?
         WHERE id = ?`,
        [
          title,
          description || "",
          date,
          time || "",
          location || "",
          category || "",
          Number(capacity) || 100,
          req.params.id,
        ]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Event not found." });
      }

      const event = await get("SELECT * FROM events WHERE id = ?", [
        req.params.id,
      ]);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Could not update the event." });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const result = await run("DELETE FROM events WHERE id = ?", [
        req.params.id,
      ]);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Event not found." });
      }

      res.json({ message: "Event deleted." });
    } catch (error) {
      res.status(500).json({ error: "Could not delete the event." });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, event_id } = req.body;

      if (!name || !email || !event_id) {
        return res
          .status(400)
          .json({ error: "Name, email, and event_id are required." });
      }

      const event = await get("SELECT * FROM events WHERE id = ?", [event_id]);

      if (!event) return res.status(404).json({ error: "Event not found." });

      const result = await run(
        "INSERT INTO registrations (name, email, event_id) VALUES (?, ?, ?)",
        [name, email, event_id]
      );

      res.status(201).json({
        message: "Registration successful.",
        registration_id: result.id,
      });
    } catch (error) {
      res.status(500).json({ error: "Could not register for the event." });
    }
  });

  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await all(`
        SELECT registrations.id, registrations.name, registrations.email,
               registrations.event_id, registrations.registration_date,
               events.title AS event_title
        FROM registrations
        LEFT JOIN events ON events.id = registrations.event_id
        ORDER BY registrations.registration_date DESC
      `);

      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Could not load registrations." });
    }
  });

  app.post("/api/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Name, email, and password are required." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      res.status(201).json({ message: "Account created.", user_id: result.id });
    } catch (error) {
      if (error.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "This email is already used." });
      }

      res.status(500).json({ error: "Could not create the account." });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      const user = await get("SELECT * FROM users WHERE email = ?", [email]);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Email or password is incorrect." });
      }

      res.json({
        message: "Login successful.",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ error: "Could not log in." });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start the server:", error.message);
  process.exit(1);
});
