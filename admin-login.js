// POST /api/admin-login
// Body: { stage: "creds", mobile, password }  →  password check
// Body: { stage: "totp", mobile, code }        →  authenticator code check
// Admin ka password aur authenticator secret — dono sirf yahan (server par) verify hote hain.

const bcrypt = require("bcryptjs");
const { authenticator } = require("otplib");
const { DOC_REF } = require("./_firebaseAdmin");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { stage, mobile, password, code } = req.body || {};
    if (!mobile) return res.status(400).json({ error: "mobile zaroori hai" });

    const snap = await DOC_REF.get();
    const data = snap.data() || {};
    const admin = (data.users || []).find(u => u.role === "admin" && u.mobile === mobile);
    if (!admin) return res.status(401).json({ error: "Invalid admin credentials" });

    if (stage === "creds") {
      const match = admin.passwordHash && (await bcrypt.compare(password || "", admin.passwordHash));
      if (!match) return res.status(401).json({ error: "Invalid admin credentials" });
      return res.status(200).json({ ok: true, stage: "totp-required" });
    }

    if (stage === "totp") {
      const valid = admin.authSecret && authenticator.verify({ token: String(code || ""), secret: admin.authSecret });
      if (!valid) return res.status(401).json({ error: "Invalid authenticator code" });
      const { passwordHash: _p, authSecret: _s, ...safeAdmin } = admin;
      return res.status(200).json({ ok: true, user: safeAdmin });
    }

    return res.status(400).json({ error: "Invalid stage" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error, dubara try karein" });
  }
};
