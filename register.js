// POST /api/register
// Body: { role: "customer" | "seller", name, mobile, password, ...extra fields }
// Password yahan hash hota hai — asli (plain) password kabhi Firestore mein nahi jaata.

const bcrypt = require("bcryptjs");
const { DOC_REF } = require("./_firebaseAdmin");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { role, mobile, password, ...rest } = req.body || {};
    if (!role || !mobile || !password) {
      return res.status(400).json({ error: "role, mobile aur password zaroori hain" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password kam se kam 6 characters ka ho" });
    }

    const snap = await DOC_REF.get();
    const data = snap.data() || {};
    const users = data.users || [];

    if (users.some(u => u.mobile === mobile)) {
      return res.status(409).json({ error: "Ye mobile number pehle se registered hai" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      role,
      mobile,
      passwordHash, // asli password kabhi save nahi hota, sirf uska hash
      createdAt: new Date().toISOString(),
      ...rest,
    };

    users.push(newUser);
    await DOC_REF.update({ users });

    const { passwordHash: _omit, ...safeUser } = newUser;
    return res.status(200).json({ ok: true, user: safeUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error, dubara try karein" });
  }
};
