# 🚀 Supabase Quick Setup Guide

## 3 Steps to Get Your Supabase Database URL

---

### Step 1: Create Supabase Project (2 minutes)

1. Go to: https://supabase.com
2. Click **"New Project"**
3. Enter:
   - **Name**: `nightflix-tickets`
   - **Database Password**: Choose a STRONG password (you'll need this!)
   - **Region**: Pick closest to your users
4. Click **"Create new project"**
5. Wait ~30 seconds for it to be ready

---

### Step 2: Get Your Connection String (1 minute)

1. In your Supabase project, click: **Settings** → **Database**
2. Scroll down to **"Connection String"** section
3. Click the **"URI"** tab (next to "Transaction pooling")
4. Click the **"Copy"** button
5. It looks like this:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

---

### Step 3: Update Your `.env` File (30 seconds)

Open `/home/z/my-project/.env` and replace:

```env
# Current (placeholder):
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Replace with your ACTUAL connection string from Step 2:
DATABASE_URL=postgresql://postgres:REAL_PASSWORD_HERE@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

### Step 4: Run Migration (10 seconds)

```bash
# Push your schema to Supabase
bun run db:push
```

You should see:
```
✨ Done in 2.5s
✔ Generated Prisma Client
```

---

### Step 5: Verify It Works (1 minute)

1. Go to: https://app.supabase.com
2. Open your project
3. Click: **Table Editor** (left sidebar)
4. You should see:
   - ✅ `Ticket` table
   - ✅ `User` table
   - ✅ `Post` table

---

## 🎉 Done! 

Your Nightflix ticket system is now running on Supabase!

**What's different now:**
- 🚀 Production PostgreSQL database
- 📊 Better performance for multiple users
- 💾 Automatic backups
- 🔄 Real-time ready
- 📈 Can scale to 1000+ tickets easily

---

## 🧪 Test Your Supabase Setup

### Test Purchase Flow:

```bash
# 1. Start your app (if not running)
bun run dev

# 2. Go to http://localhost:3000
# 3. Buy a ticket (any tier)

# 4. Check Supabase Table Editor → Ticket table
# You should see your new ticket!
```

### Test Verification:

```bash
# 1. Copy the reference from your purchase
# 2. Visit simulation endpoint:
http://localhost:3000/api/tickets/simulate-payment?reference=YOUR_REF

# 3. Check Supabase Table Editor → Ticket table
# paymentStatus should now be "COMPLETED"
```

---

## 🔧 Switching Back to SQLite (If Needed)

If you want to use SQLite again for local development:

### Option A: Keep Both
```bash
# Create a .env.local for SQLite
cp .env .env.supabase

# Edit .env.local to use SQLite
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Use it with:
bun run dev
```

### Option B: Switch in .env

Just comment/uncomment in `.env`:

```env
# For Supabase:
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres

# For SQLite:
# DATABASE_URL=file:/home/z/my-project/db/custom.db
```

---

## 📊 What You're Getting

| Feature | SQLite | Supabase |
|---------|---------|-----------|
| Database Type | File-based | Cloud PostgreSQL |
| Performance | Good | Excellent |
| Backup | Manual | Automatic |
| Scale | Limited | Unlimited |
| Cost | Free | Free Tier Available |
| Users | 1 at a time | 1000s concurrent |

---

## ❓ Questions?

### Do I need to change my code?
**No!** Your code stays exactly the same. Prisma handles the database differences automatically.

### Can I use both SQLite and Supabase?
**Yes!** Just update `.env` to switch between them. No code changes needed.

### What if I lose my Supabase password?
**Don't worry!**
1. Go to Supabase Dashboard
2. Settings → Database
3. Scroll to "Connection String"
4. Reset password if needed

### Is my data safe?
**Yes!** Supabase provides:
- Automatic daily backups
- Point-in-time recovery
- Enterprise security

---

## 🚀 Ready for Production?

### Vercel Deployment:

1. Add this to Vercel Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:REAL_PASSWORD@db.REF.supabase.co:5432/postgres
   ```

2. Deploy as usual
3. Your app uses Supabase automatically!

---

## 💡 Quick Command Reference

```bash
# Check current database
# Look at .env file
cat .env | grep DATABASE_URL

# Run migration
bun run db:push

# Reset database (careful - deletes all data!)
bun run db:push --force-reset

# View Prisma schema
cat prisma/schema.prisma

# Regenerate Prisma Client
bun run db:generate
```

---

## 📞 Need Help?

- **Full Guide**: `SUPABASE_MIGRATION.md`
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Check Server Logs**: `tail -f dev.log`

---

**Setup Time**: ~5 minutes ⚡
**Migration Time**: Done! (Prisma handles it) ✅

Your app now runs on Supabase! 🎉
