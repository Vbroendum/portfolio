import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

// POST /admin/login
// Credentials come from env — no DB needed for a single-user admin
router.post("/login", async (req, res) => {
  const { password } = req.body;

  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

export default router;

// ── How to generate your password hash ────────────────────────────────────────
// Run once locally:
//   node -e "import('bcryptjs').then(b => b.default.hash('yourpassword', 12).then(console.log))"
// Paste the output into your .env as ADMIN_PASSWORD_HASH
