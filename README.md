# JilaBazar Backend (Vercel)

Ye chhota backend password hashing, admin login, aur OpenAI calls ko
**server par** (browser se door) handle karta hai.

## Deploy karne ke steps

1. **GitHub par upload karein**
   - Is poore `jilabazar-backend` folder ko ek naye GitHub repo mein daalein
     (GitHub website se "Add file → Upload files" se seedha ho jayega).

2. **Vercel par account banayein**
   - [vercel.com](https://vercel.com) → GitHub se sign up (free, card nahi chahiye)

3. **Project import karein**
   - Vercel dashboard → "Add New" → "Project" → apna GitHub repo select karein
   - Baaki sab default rehne dein → "Deploy" dabayein

4. **Environment Variables set karein** (Vercel Project → Settings → Environment Variables)
   - `FIREBASE_SERVICE_ACCOUNT` — Firebase Console → Project Settings → Service Accounts →
     "Generate new private key" se jo JSON file milegi, uska **poora content** yahan paste karein (ek hi line mein)
   - `OPENAI_API_KEY` — aapki OpenAI key

5. Deploy hone ke baad Vercel ek URL dega, jaise:
   ```
   https://jilabazar-backend.vercel.app
   ```
   **Ye URL mujhe (Claude ko) bhej dijiye** — agla step iske baad hoga: frontend ko
   is backend se connect karna (taaki register/login/admin/AI sab yahi se hoke jayein).

## Kya-kya hai isme
- `api/register.js` — naya customer/seller banata hai, password hash karke save karta hai
- `api/login.js` — login verify karta hai (hash se, plain password se nahi)
- `api/admin-login.js` — admin password + authenticator code dono yahan verify hote hain
- `api/ai.js` — OpenAI ki saari calls yahan se jaati hain, key kabhi browser mein nahi aati
