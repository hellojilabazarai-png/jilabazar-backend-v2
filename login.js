// POST /api/login
// Body: { role: "customer" | "seller", mobile, password }
// Password yahan verify hota hai (hash ke against) — plain password kabhi
// database mein compare nahi hota, is liye database leak hone par bhi passwords surakshit rehte hain.

const bcrypt = require("bcryptjs");
const { DOC_REF } = require("./_firebaseAdmin");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { role, mobile, password } = req.body || {};
    if (!role || !mobile || !password) {
      return res.status(400).json({ error: "role, mobile aur password zaroori hain" });
    }

    const snap = await DOC_REF.get();
    const data = snap.data() || {};
    const users = data.users || [];

    const user = users.find(u => u.role === role && u.mobile === mobile);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid mobile ya password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid mobile ya password" });
    }

    const { passwordHash: _omit, ...safeUser } = user;
    return res.status(200).json({ ok: true, user: safeUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error, dubara try karein" });
  }
};
