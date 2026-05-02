import { Router } from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /experience
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM experience ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /experience  (admin only)
router.post("/", requireAuth, async (req, res, next) => {
  const { company, role, period, description, sort_order } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO experience (company, role, period, description, sort_order) VALUES (?, ?, ?, ?, ?)",
      [company, role, period, description, sort_order ?? 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /experience/:id  (admin only)
router.put("/:id", requireAuth, async (req, res, next) => {
  const { company, role, period, description, sort_order } = req.body;
  try {
    await pool.query(
      "UPDATE experience SET company=?, role=?, period=?, description=?, sort_order=? WHERE id=?",
      [company, role, period, description, sort_order ?? 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /experience/:id  (admin only)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM experience WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
