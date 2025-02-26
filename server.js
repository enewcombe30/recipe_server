const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3001;

require("dotenv").config();

// ✅ Database Connection Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

app.use(cors());
app.use(express.json());

// ✅ Fetch Recipes with Ingredients
const getRecipes = async (req, res) => {
  try {
    const query = `
    SELECT 
    r.id AS recipe_id,
    r.name AS recipe_name,
    r.version,
    sd.id AS sub_division_id,
    sd.name AS sub_division_name,
    d.id AS division_id,
    d.name AS division_name,
    COALESCE(json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
    ), '{}') AS created_by,
    COALESCE(json_agg(
        json_build_object(
            'id', i.id,
            'name', i.name,
            'amount', ri.amount,
            'allergies', (
                SELECT COALESCE(json_agg(a.name), '[]') 
                FROM ingredient_allergens ia
                JOIN allergens a ON ia.allergen_id = a.id 
                WHERE ia.ingredient_id = i.id
            ),
            'dietary_tags', (
                SELECT COALESCE(json_agg(t.name), '[]') 
                FROM ingredient_tags it
                JOIN tags t ON it.tag_id = t.id 
                WHERE it.ingredient_id = i.id
            )
        )
    ) FILTER (WHERE i.id IS NOT NULL), '[]') AS ingredients
FROM recipes r
LEFT JOIN users u ON r.created_by = u.id  -- ✅ Fix: Ensure user details are included
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id  
LEFT JOIN ingredients i ON ri.ingredient_id = i.id
LEFT JOIN sub_divisions sd ON r.sub_division_id = sd.id  
LEFT JOIN divisions d ON sd.division_id = d.id
GROUP BY r.id, sd.id, d.id, u.id;

  `;

    // ✅ Execute Query & Log Results
    const result = await pool.query(query);

    // ✅ Restructure Data
    const recipesMap = {};

    result.rows.forEach((row) => {
      const recipeId = row.recipe_id;

      if (!recipesMap[recipeId]) {
        recipesMap[recipeId] = {
          id: recipeId,
          name: row.recipe_name,
          version: row.version,
          sub_division: {
            id: row.sub_division_id,
            name: row.sub_division_name,
          },
          division: {
            id: row.division_id,
            name: row.division_name,
          },
          created_by: row.created_by,
          ingredients: [],
        };
      }

      if (row.ingredients) {
        recipesMap[recipeId].ingredients = row.ingredients;
      }
    });

    res.json(Object.values(recipesMap));
  } catch (error) {
    console.error("❌ Error fetching recipes:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Define API Route
app.get("/recipes", getRecipes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
