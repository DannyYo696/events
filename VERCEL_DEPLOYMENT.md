# 🚀 Vercel Deployment - Complete Guide

## ✅ Ready for Vercel Deployment!

Your Nightflix ticket system is production-ready. Here's exactly what you need to deploy to Vercel.

---

## 📋 Step 1: Get Your Credentials (15 minutes)

### A. Supabase Database URL (Required)

1. Go to: https://app.supabase.com
2. Open your project (or create one if you haven't)
3. Go to: **Settings → Database**
4. Scroll down to **"Connection String"**
5. Click the **"URI"** tab
6. Click **Copy** button

Your connection string will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**⚠️ SAVE YOUR PASSWORD!** You'll need it!

---

### B. Paystack API Keys (Required)

1. Go to: https://dashboard.paystack.co
2. Log in or create an account
3. Go to: **Settings → API Keys**
4. You'll see two keys:

#### Public Key (for frontend)
```
pk_live_xxxxxxxxxxxxxxxxxx
```

#### Secret Key (for backend)
```
sk_live_xxxxxxxxxxxxxxxxxx
```

**⚠️ SAVE BOTH KEYS!** Copy them securely.

---

### C. App URL (Required)

Your production URL. If you have a domain:
```
https://nightflix.yourdomain.com
```

If you're using Vercel's default domain (recommended for now):
```
https://nightflix.vercel.app
```

You can also use a custom domain later.

---

### D. Email Configuration (Optional but Recommended)

For Gmail (easiest):

1. Enable 2-Factor authentication on your Google account
2. Go to: **Account Settings → Security**
3. Scroll to **"2-Step Verification"**
4. Generate an **App Password**
5. Give it a name like "Nightflix"
6. Copy the 16-character password

---

## 📝 Step 2: Create Your `.env` File (5 minutes)

Create or edit `/home/z/my-project/.env` with these EXACT values:

```env
# ============================================
# DATABASE - Supabase (REQUIRED)
# ============================================
# Get this from: https://app.supabase.com/project/_/settings/database
# Replace the placeholder below with your ACTUAL connection string
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

# ============================================
# PAYSTACK - PAYMENT GATEWAY (REQUIRED)
# ============================================
# Get these from: https://dashboard.paystack.co/settings/api
# Public key starts with "pk_live_"
# Secret key starts with "sk_live_"
PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_key_here

# ============================================
# EMAIL - FOR TICKET DELIVERY (OPTIONAL BUT RECOMMENDED)
# ============================================
# Get App Password from Google: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
EMAIL_FROM=Nightflix <noreply@nightflix.com>

# ============================================
# APP URL - FOR PRODUCTION (REQUIRED)
# ============================================
# Use your Vercel domain or custom domain
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Alternative: Use a custom domain
# NEXT_PUBLIC_APP_URL=https://nightflix.com
```

### ⚠️ IMPORTANT NOTES:

1. **DATABASE_URL**: Use the one from Supabase (NOT a placeholder!)
2. **Paystack Keys**: Use LIVE keys for production (starts with `pk_live_`/`sk_live_`)
3. **App Password**: This is NOT your Gmail password, it's an app password
4. **App URL**: Match this to your actual Vercel domain

---

## 🚀 Step 3: Configure Paystack Callback (5 minutes)

1. Go to: https://dashboard.paystack.co
2. Go to: **Settings → Callbacks**
3. Add your callback URL:
   ```
   https://your-domain.vercel.app/success
   ```
4. Click **Save**

**If using a custom domain:**
```
https://nightflix.com/success
```

**⚠️ IMPORTANT**: This MUST match your `NEXT_PUBLIC_APP_URL`!

---

## 🚀 Step 4: Deploy to Vercel (10 minutes)

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (leave as default)
   - **Output Directory**: `.next` (leave as default)
4. Click **Deploy**

### Option B: Deploy via Vercel CLI (For control)

```bash
# Install Vercel CLI
bun i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## 🔧 Step 5: Add Environment Variables in Vercel (5 minutes)

### IMPORTANT: DO NOT USE YOUR LOCAL `.env` FILE!

Vercel has its own environment variables. You must add them there.

### In Vercel Dashboard:

1. Go to your project on Vercel
2. Click: **Settings → Environment Variables**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack public key | Production, Preview, Development |
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | https://your-domain.vercel.app | Production, Preview, Development |
| `SMTP_HOST` | smtp.gmail.com | Production, Preview, Development |
| `SMTP_PORT` | 587 | Production, Preview, Development |
| `SMTP_USER` | your-email@gmail.com | Production, Preview, Development |
| `SMTP_PASSWORD` | your-app-password | Production, Preview, Development |
| `EMAIL_FROM` | Nightflix <noreply@nightflix.com> | Production, Preview, Development |

### ⚠️ CRITICAL NOTES:

1. **Add to ALL environments**: Check all three boxes (Production, Preview, Development)
2. **No quotes around values**: Just paste the raw values
3. **No spaces around `=`**: `DATABASE_URL=value` NOT `DATABASE_URL = value`
4. **Click Save** after each variable
5. **Redeploy** after adding variables (click "Redeploy" in Deployments tab)

---

## ✅ Step 6: Deploy and Test (10 minutes)

### Redeploy After Environment Variables

1. Go to **Deployments** tab in Vercel
2. Click **"..."** (three dots) next to latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2 minutes)

### Test Your Production App

1. Visit your URL: `https://your-domain.vercel.app`
2. Buy a test ticket
3. Complete payment with Paystack
4. Check your email for ticket
5. Verify ticket works at `/verify`

---

## 🔍 Step 7: Verify Everything Works (5 minutes)

### Checklist:

- [ ] Homepage loads correctly
- [ ] Can select ticket tiers
- [ ] Checkout form works
- [ ] Paystack payment redirects correctly
- [ ] Success page shows ticket
- [ ] Email with ticket is received
- [ ] QR code displays correctly
- [ ] Ticket verification page works
- [ ] Supabase has ticket records
- [ ] Paystack dashboard shows transactions

---

## 📊 Step 8: Monitor Your App (Ongoing)

### In Vercel Dashboard:

1. Go to: **Analytics**
   - See visitor count
   - Monitor page views
   - Track user sessions

2. Go to: **Deployments**
   - See deployment history
   - Monitor build logs
   - Check for errors

3. Go to: **Settings → Functions**
   - Monitor API performance
   - Check function logs
   - Track errors

### In Supabase Dashboard:

1. Go to: https://app.supabase.com
2. Click: **Database**
   - See ticket records
   - Monitor database size
   - Check query performance

3. Click: **Logs**
   - See API calls
   - Monitor errors
   - Track slow queries

---

## 🚨 Common Vercel Deployment Issues

### Issue 1: "Database connection failed"

**Cause**: Wrong `DATABASE_URL` in environment variables

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` matches your Supabase connection string exactly
3. Redeploy

### Issue 2: "Paystack callback not working"

**Cause**: Callback URL doesn't match

**Solution**:
1. Check Paystack Dashboard → Settings → Callbacks
2. Verify callback URL matches your Vercel domain
3. Must be: `https://your-domain.vercel.app/success`

### Issue 3: "Emails not sending"

**Cause**: Wrong SMTP credentials

**Solution**:
1. Verify `SMTP_USER` is correct
2. Use App Password (NOT regular password)
3. Check app password is 16 characters
4. Redeploy after fixing

### Issue 4: "Build failed"

**Cause**: Missing dependencies or wrong Node version

**Solution**:
1. Check Vercel → Deployments → View Logs
2. See actual error message
3. Run `bun install` locally and redeploy

### Issue 5: "App loads but doesn't work"

**Cause**: Environment variables not loaded

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Make sure all variables are added to ALL environments
3. Click "Redeploy"

---

## 🔒 Security Checklist for Production

Before going live, verify:

- [ ] Using Paystack LIVE keys (not test keys)
- [ ] Supabase uses strong password
- [ ] `.env` file is NOT committed to Git
- [ ] `.env` is in `.gitignore`
- [ ] Email uses App Password (not regular password)
- [ ] Callback URL uses HTTPS (Vercel provides this)
- [ ] Custom domain has SSL (Vercel provides this)
- [ ] Database access restricted to application only
- [ ] Rate limiting enabled (Paystack provides this)

---

## 📈 Performance Optimization

### Vercel Settings:

1. Go to: **Settings → General**
2. Set **Framework Preset**: Next.js
3. Set **Node.js Version**: 20.x (or latest stable)
4. Set **Build Command**: `bun run build` (if using Bun)
5. Set **Output Directory**: `.next`

### Supabase Settings:

1. Go to: **Database → Settings**
2. Enable **Connection Pooling**: Enabled
3. Set **Pool Size**: 15 (good for most apps)
4. Monitor **Database Size**: Should be under 500MB (free tier)

---

## 💰 Cost Estimation

### Monthly Costs for Nightflix:

| Service | Free Tier | Expected Usage |
|---------|-----------|----------------|
| **Vercel** | Free | $0 (Hobby plan generous) |
| **Supabase** | Free | $0 (500MB = 1000+ tickets) |
| **Paystack** | 1.5% fee | ₦75 per ₦5000 ticket |
| **Gmail** | Free | $0 (free tier) |
| **Domain** | Optional | $0 if using vercel.app |
| **Total** | - | **~₦150 per ₦100,000 sales** |

**Your first ₦500,000 in sales costs only ₦750 in Paystack fees!** 💰

---

## 🎯 Quick Reference Command

```bash
# Check your current .env
cat .env

# Verify .gitignore includes .env
cat .gitignore | grep .env

# Test build locally
bun run build

# Test Prisma connection
bun run db:push

# Check database size (after Supabase setup)
# Check Supabase Dashboard → Database
```

---

## 📞 Support Resources

If you encounter issues:

### Vercel Support:
- Docs: https://vercel.com/docs
- Status: https://vercel-status.com
- Help: https://vercel.com/support

### Supabase Support:
- Docs: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- Discord: https://discord.gg/supabase
- Status: https://status.supabase.com

### Paystack Support:
- Docs: https://paystack.com/docs
- Dashboard: https://dashboard.paystack.co
- Contact: https://support.paystack.co

---

## ✅ Final Deployment Checklist

Before deploying to production:

- [ ] Supabase project created and running
- [ ] DATABASE_URL copied from Supabase Dashboard
- [ ] Paystack LIVE keys obtained
- [ ] Paystack callback URL configured
- [ ] Custom domain set up (if using one)
- [ ] DNS records updated (if using custom domain)
- [ ] Email SMTP configured (Gmail App Password)
- [ ] All environment variables added to Vercel
- [ ] All three environments selected (Prod, Preview, Dev)
- [ ] Project pushed to GitHub
- [ ] Vercel project linked to GitHub
- [ ] Test build runs successfully locally
- [ ] Test complete flow works locally
- [ ] Payment tested with real card (small amount)
- [ ] Email delivery tested
- [ ] Ticket verification tested
- [ ] SSL/HTTPS verified (automatic on Vercel)
- [ ] Error monitoring set up
- [ ] Database backups verified (automatic on Supabase)
- [ ] Performance optimized
- [ ] Mobile responsive tested
- [ ] Accessibility checked

**When ALL checked**: You're ready for production! 🚀

---

## 🎉 You're Ready to Deploy!

### Total Time to Deployment: ~45 minutes

1. Get credentials (15 min)
2. Update .env file (5 min)
3. Configure Paystack (5 min)
4. Deploy to Vercel (10 min)
5. Add environment variables (5 min)
6. Deploy and test (10 min)

### Your `.env` File Summary:

```env
# REQUIRED:
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# OPTIONAL (BUT RECOMMENDED):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=Nightflix <noreply@nightflix.com>
```

### What to Do Next:

1. Copy your actual credentials
2. Paste them into `/home/z/my-project/.env`
3. Follow the deployment steps above
4. Test everything thoroughly
5. Go live! 🚀

---

## 📞 Need Help?

All documentation is in your project:
- `VERCEL_DEPLOYMENT.md` - This file
- `SUPABASE_MIGRATION.md` - Supabase setup
- `SUPABASE_QUICK_SETUP.md` - 5-minute setup
- `TESTING_GUIDE.md` - Testing instructions
- `README-NIGHTFLIX.md` - System overview

**Deploy with confidence!** Everything is production-ready! ✅

---

**Good luck with your Nightflix event! 🎬**
