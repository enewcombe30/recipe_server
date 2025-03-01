const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // ✅ Get Users
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, name, role, passcode FROM users"
      ); // Exclude passcodes for security
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
