// Ye file Firebase se server-side (poori tarah trusted) connect karti hai.
// Browser se alag — yahan hum FIREBASE_SERVICE_ACCOUNT secret use karte hain jo
// sirf Vercel ke environment variables mein rehta hai, kabhi bhi frontend/browser mein nahi jaata.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const DOC_REF = db.collection("jilabazar").doc("database");

module.exports = { admin, db, DOC_REF };
