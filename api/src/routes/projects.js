import { Router } from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = Router();

// GET /projects
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /projects  (admin only)
router.post(
  "/",
  requireAuth,
  [
    body("title").notEmpty().trim(),
    body("description").notEmpty().trim(),
    body("tech_stack").isArray(),
    body("github_url").optional().isURL(),
    body("live_url").optional().isURL(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, tech_stack, github_url, live_url, sort_order } =
      req.body;

    try {
      const [result] = await pool.query(
        `INSERT INTO projects (title, description, tech_stack, github_url, live_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, JSON.stringify(tech_stack), github_url, live_url, sort_order ?? 0]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /projects/:id  (admin only)
router.put("/:id", requireAuth, async (req, res, next) => {
  const { title, description, tech_stack, github_url, live_url, sort_order } =
    req.body;
  try {
    await pool.query(
      `UPDATE projects SET title=?, description=?, tech_stack=?, github_url=?, live_url=?, sort_order=?
       WHERE id=?`,
      [
        title, description, JSON.stringify(tech_stack),
        github_url, live_url, sort_order ?? 0, req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /projects/:id  (admin only)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM projects WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
