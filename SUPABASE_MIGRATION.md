# Supabase Migration Guide

## 🚀 Why Use Supabase?

✅ **Production-Ready** - PostgreSQL database, not SQLite
✅ **Free Tier** - 500MB database, 1GB bandwidth, 50,000 monthly active users
✅ **Real-time** - Built-in real-time subscriptions
✅ **Scalable** - Handles 1000+ tickets easily
✅ **Auto-Backups** - Daily backups for 7 days on free tier
✅ **Easy Setup** - No need to manage servers
✅ **Better Performance** - Faster than SQLite for concurrent users

---

## 📋 Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Node.js/Bun installed
- Your Nightflix project

---

## 🚀 Step-by-Step Migration

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `nightflix-tickets`
   - Database Password: (choose a strong password - SAVE IT!)
   - Region: Choose closest to your users
4. Wait for project to be created (30-60 seconds)

### Step 2: Get Database Connection String

1. In your Supabase project, go to: **Settings → Database**
2. Scroll down to **Connection String**
3. Click **"URI"** tab
4. Copy the connection string
5. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Update Your `.env` File

Replace your `.env` file with:

```env
# Database - Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Paystack
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# Email (for sending tickets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=Nightflix <noreply@nightflix.com>

# App URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Install Supabase Client (Optional)

If you want to use Supabase features like authentication:

```bash
bun add @supabase/supabase-js
```

**Note**: This is optional! Your current system works perfectly with Prisma + Supabase database only.

### Step 5: Run Database Migration

Push your schema to Supabase:

```bash
# This will create tables in your Supabase database
bun run db:push
```

You should see:
```
✨ Done in 2.5s
✔ Generated Prisma Client
```

### Step 6: Verify Migration

Check that tables were created:

1. Go to Supabase → **Table Editor**
2. You should see these tables:
   - `Ticket`
   - `User`
   - `Post`

---

## 🧪 Testing with Supabase

### Test 1: Create a Ticket

1. Go to http://localhost:3000
2. Select a ticket tier
3. Fill in details and submit
4. Check Supabase Table Editor → Ticket table
5. You should see a new ticket row!

### Test 2: Verify Payment

1. Use the simulation endpoint:
   ```
   http://localhost:3000/api/tickets/simulate-payment?reference=YOUR_REF
   ```
2. Check Supabase → Ticket table
3. `paymentStatus` should be `COMPLETED`

### Test 3: Verify Ticket

1. Go to http://localhost:3000/verify
2. Enter ticket code
3. Check Supabase → Ticket table
4. `verificationStatus` should be `VERIFIED`

---

## 🔄 Switching Between Databases

### From SQLite to Supabase

```bash
# 1. Update .env with Supabase DATABASE_URL
# 2. Run migration
bun run db:push

# 3. Optional: Remove old SQLite database
rm db/custom.db
```

### From Supabase Back to SQLite (Local Dev)

```bash
# 1. Update .env with local database
DATABASE_URL=file:./db/custom.db

# 2. Update prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

# 3. Run migration
bun run db:push
```

---

## 🚀 Deploying to Vercel with Supabase

### Step 1: Add Environment Variables in Vercel

In Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=Nightflix <noreply@nightflix.com>
```

### Step 2: Deploy

```bash
# Push to GitHub
git add .
git commit -m "Migrate to Supabase"
git push origin main

# Deploy via Vercel dashboard
```

### Step 3: Verify Production

1. After deployment, test purchase flow
2. Check Supabase Dashboard → Logs
3. Monitor database performance

---

## 📊 Supabase vs SQLite

| Feature | SQLite | Supabase |
|---------|---------|-----------|
| Performance | Good for single user | Excellent for multiple users |
| Scalability | Limited | Unlimited (with plan) |
| Backups | Manual | Automatic |
| Real-time | No | Yes |
| Authentication | Need separate | Built-in (optional) |
| Storage | File system | Built-in (optional) |
| Edge Functions | No | Yes (optional) |
| Cost | Free | Free tier available |

---

## 🔧 Advanced Supabase Features (Optional)

### 1. Supabase Authentication

If you want user accounts:

```bash
bun add @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Row Level Security (RLS)

Add RLS policies in Supabase SQL Editor:

```sql
-- Only allow users to see their own tickets
CREATE POLICY "Users can see own tickets"
ON Ticket FOR SELECT
USING (auth.uid()::text = buyer_email);

-- Allow only system to verify tickets
CREATE POLICY "Only system can verify"
ON Ticket FOR UPDATE
TO authenticated
WITH CHECK (verification_status = 'VERIFIED');
```

### 3. Database Functions

Create functions in Supabase:

```sql
-- Get ticket stats
CREATE OR REPLACE FUNCTION get_ticket_stats()
RETURNS TABLE (
  total_tickets BIGINT,
  completed_payments BIGINT,
  verified_tickets BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tickets,
    COUNT(*) FILTER (WHERE payment_status = 'COMPLETED') as completed_payments,
    COUNT(*) FILTER (WHERE verification_status = 'VERIFIED') as verified_tickets
  FROM Ticket;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔍 Monitoring Supabase

### View Database Logs

1. Go to Supabase Dashboard → **Logs**
2. Filter by:
   - Database
   - Auth (if using)
   - Functions

### View Query Performance

1. Go to Supabase Dashboard → **Database**
2. Click **Logs** → **Query Logs**
3. See slow queries and optimize

### Set Up Alerts

1. Go to Supabase Dashboard → **Settings**
2. Configure alerts for:
   - High CPU usage
   - Storage limits
   - Failed queries

---

## 📱 Supabase for Mobile

If you add a mobile app later:

```typescript
// Uses the same database as your web app
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

// Real-time ticket updates
supabase
  .channel('tickets')
  .on('postgres_changes', { event: '*', schema: 'public' })
  .subscribe()
```

---

## 🆘 Troubleshooting

### "Connection timed out"

**Cause**: Supabase project is paused or in wrong region

**Solution**:
1. Go to Supabase Dashboard
2. Check project status (click "Resume" if paused)
3. Verify DATABASE_URL is correct

### "Schema not found"

**Cause**: Migration not run or wrong database

**Solution**:
```bash
# Push schema to Supabase
bun run db:push

# Or regenerate Prisma Client
bun run db:generate
```

### "CUID generation error"

**Cause**: Prisma still pointing to SQLite

**Solution**:
1. Check `prisma/schema.prisma` - should be `postgresql`
2. Check `.env` - should be Supabase URL
3. Restart dev server: `bun run dev`

### "Too many connections"

**Cause**: Free tier limits (60 connections)

**Solution**:
1. Close unused connections
2. Use connection pooling (already in Supabase)
3. Upgrade to Pro tier if needed

---

## 📊 Pricing Comparison

### Supabase Free Tier
- 500MB database
- 1GB bandwidth
- 2GB file storage
- 50,000 monthly active users
- 1 API endpoint
- 7-day backups

### Supabase Pro Tier ($25/month)
- 8GB database
- 50GB bandwidth
- 100GB file storage
- 100,000 monthly active users
- 3 API endpoints
- 28-day backups

**For 1000+ tickets, Free tier is sufficient!**

---

## 🎯 Migration Checklist

Before switching to Supabase:

- [ ] Create Supabase project
- [ ] Get database connection string
- [ ] Update `.env` with Supabase DATABASE_URL
- [ ] Update `prisma/schema.prisma` to use PostgreSQL
- [ ] Run `bun run db:push`
- [ ] Verify tables in Supabase Dashboard
- [ ] Test ticket purchase flow
- [ ] Test payment verification
- [ ] Test ticket verification
- [ ] Update Vercel environment variables
- [ ] Deploy to production

---

## 🚀 Benefits You'll Get

✅ **Better Performance** - PostgreSQL is faster than SQLite
✅ **Automatic Backups** - No manual backup needed
✅ **Real-time Updates** - Show live ticket counts
✅ **Scalability** - Handle 10,000+ tickets easily
✅ **Easy Analytics** - Built-in query insights
✅ **No Server Management** - Supabase handles everything
✅ **Cost Effective** - Free tier for most use cases
✅ **Production Ready** - Enterprise-grade infrastructure

---

## 💡 Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use `.env.example` as template
   - Rotate passwords regularly

2. **Database Indexes**
   - Prisma creates indexes automatically
   - Check Supabase → Database → Tables → Indexes

3. **Connection Pooling**
   - Supabase handles this automatically
   - No extra configuration needed

4. **Testing**
   - Use free tier for testing
   - Upgrade only for production
   - Monitor usage in Supabase Dashboard

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Discord Community](https://discord.gg/supabase)

---

## 🎉 Ready to Migrate?

**Total time**: ~10 minutes

**Steps**:
1. Create Supabase project (2 min)
2. Get connection string (1 min)
3. Update `.env` (1 min)
4. Run `bun run db:push` (2 min)
5. Test (4 min)

That's it! Your app now runs on Supabase! 🚀
