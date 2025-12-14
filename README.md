# Deploy Checklist for Real Estate Tool

1. **Environment Variables**:
   In `.env.local`:
   ```bash
   BREVO_API_KEY=your_key
   SENDER_EMAIL=your_email
   ```

2. **Run Locally**:
   ```bash
   npm install
   npm run dev
   ```

3. **Deploy to Vercel**:
   - Push to GitHub
   - Import project in Vercel
   - Add env vars

## Features
- Calcs: Mortage, Cap Rate, Cash Flow, CoC
- Teaser Mode blurred results
- Email Capture for full unlock
