require("dotenv").config({ path: "./.env" });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); // Add this line to import the CORS package

const app = express();
const port = 3001;

// Enable CORS for all origins (can be adjusted later to be more specific)
app.use(cors()); // Use CORS middleware globally for all routes

// Create a new pool to connect to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to parse JSON
app.use(express.json());

// Define a route to fetch all recipes
app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json(result.rows); // Send back the result in JSON format
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Define a route to fetch a specific recipe
app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Recipe not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
