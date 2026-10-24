const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("@neondatabase/serverless");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Add your Neon connection string to backend/.env.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

function postgresSql(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

async function run(sql, values = []) {
  const statement = sql.trim().replace(/;$/, "");
  const isInsert = /^INSERT\s/i.test(statement);
  const query = isInsert && !/\bRETURNING\b/i.test(statement)
    ? `${statement} RETURNING id`
    : statement;
  const result = await pool.query(postgresSql(query), values);
  return { id: result.rows[0]?.id, changes: result.rowCount };
}

async function get(sql, values = []) {
  const result = await pool.query(postgresSql(sql), values);
  return result.rows[0];
}

async function all(sql, values = []) {
  const result = await pool.query(postgresSql(sql), values);
  return result.rows;
}

let schemaPromise;
async function initializeDatabase() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await run(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`);

      await run(`CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        location TEXT,
        category TEXT,
        capacity INTEGER DEFAULT 100
      )`);

      await run(`CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        event_id INTEGER NOT NULL REFERENCES events(id),
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      const eventCount = await get("SELECT COUNT(*)::int AS count FROM events");
      if (eventCount.count === 0) {
        await run(
          `INSERT INTO events (title, description, date, time, location, category, capacity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            "AI Workshop",
            "Learn about artificial intelligence and build a small project.",
            "2026-11-15", "10:00", "Main Hall", "Technology", 100,
          ]
        );
        await run(
          `INSERT INTO events (title, description, date, time, location, category, capacity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            "Campus Sports Day",
            "Join students for a day of sports and activities.",
            "2026-11-20", "09:00", "Sports Ground", "Sports", 200,
          ]
        );
      }
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  return schemaPromise;
}

app.use(async (_req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    res.status(500).json({ error: "Database is unavailable. Check DATABASE_URL." });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (_error) {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.get("/api/events", async (_req, res) => {
  try {
    res.json(await all("SELECT * FROM events ORDER BY date"));
  } catch (_error) {
    res.status(500).json({ error: "Could not load events." });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await get("SELECT * FROM events WHERE id = ?", [req.params.id]);
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (_error) {
    res.status(500).json({ error: "Could not load the event." });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, time, location, category, capacity } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Title and date are required." });
    const result = await run(
      `INSERT INTO events (title, description, date, time, location, category, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || "", date, time || "", location || "", category || "", Number(capacity) || 100]
    );
    res.status(201).json(await get("SELECT * FROM events WHERE id = ?", [result.id]));
  } catch (_error) {
    res.status(500).json({ error: "Could not create the event." });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const { title, description, date, time, location, category, capacity } = req.body;
    const result = await run(
      `UPDATE events SET title = ?, description = ?, date = ?, time = ?,
       location = ?, category = ?, capacity = ? WHERE id = ?`,
      [title, description || "", date, time || "", location || "", category || "", Number(capacity) || 100, req.params.id]
    );
    if (!result.changes) return res.status(404).json({ error: "Event not found." });
    res.json(await get("SELECT * FROM events WHERE id = ?", [req.params.id]));
  } catch (_error) {
    res.status(500).json({ error: "Could not update the event." });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const result = await run("DELETE FROM events WHERE id = ?", [req.params.id]);
    if (!result.changes) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (_error) {
    res.status(500).json({ error: "Could not delete the event." });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, event_id } = req.body;
    if (!name || !email || !event_id) {
      return res.status(400).json({ error: "Name, email, and event_id are required." });
    }
    const event = await get("SELECT * FROM events WHERE id = ?", [event_id]);
    if (!event) return res.status(404).json({ error: "Event not found." });
    const result = await run(
      "INSERT INTO registrations (name, email, event_id) VALUES (?, ?, ?)",
      [name, email, event_id]
    );
    res.status(201).json({ message: "Registration successful.", registration_id: result.id });
  } catch (_error) {
    res.status(500).json({ error: "Could not register for the event." });
  }
});

app.get("/api/registrations", async (_req, res) => {
  try {
    res.json(await all(`
      SELECT registrations.id, registrations.name, registrations.email,
             registrations.event_id, registrations.registration_date,
             events.title AS event_title
      FROM registrations
      LEFT JOIN events ON events.id = registrations.event_id
      ORDER BY registrations.registration_date DESC
    `));
  } catch (_error) {
    res.status(500).json({ error: "Could not load registrations." });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Account created.", user_id: result.id });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "This email is already used." });
    res.status(500).json({ error: "Could not create the account." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    res.json({ message: "Login successful.", user: { id: user.id, name: user.name, email: user.email } });
  } catch (_error) {
    res.status(500).json({ error: "Could not log in." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
