# Testing Guide for Nightflix Ticket System

## 🧪 Testing Without Paystack

You can test the complete ticket purchasing flow without configuring Paystack:

### Step 1: Start a Purchase

1. Go to the home page (`/`)
2. Select a ticket tier (Regular, VIP, or Gang of 5)
3. Fill in your details on the checkout page (`/checkout`)
4. Click "Pay" - you'll be redirected to Paystack (or see an error if keys not configured)

### Step 2: Get the Reference

After clicking "Pay", the API creates a ticket with a unique reference. You can:
- Check the browser console for the reference
- Check the server logs: `tail -f dev.log`

### Step 3: Simulate Payment Success

Copy the reference and use the simulation endpoint:

```bash
# In your browser, visit:
http://localhost:3000/api/tickets/simulate-payment?reference=YOUR_REFERENCE_HERE
```

Or use curl:

```bash
curl "http://localhost:3000/api/tickets/simulate-payment?reference=YOUR_REFERENCE_HERE"
```

You'll see a JSON response:
```json
{
  "success": true,
  "message": "Payment simulated successfully",
  "ticket": { ... },
  "redirectTo": "/success?reference=..."
}
```

### Step 4: View Your Ticket

Visit the redirect URL or directly:
```
http://localhost:3000/success?reference=YOUR_REFERENCE_HERE
```

You should now see:
- ✅ Your ticket with QR code
- ✅ All ticket details
- ✅ Payment status as COMPLETED

---

## 📧 Configuring Paystack for Real Payments

When you're ready to use real payments:

### 1. Get Paystack API Keys

1. Go to [dashboard.paystack.co](https://dashboard.paystack.co)
2. Sign up or log in
3. Go to Settings → API Keys
4. Copy your **Public Key** (starts with `pk_`)
5. Copy your **Secret Key** (starts with `sk_`)

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# Paystack Keys
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx

# App URL (update this for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Callback URL

In Paystack Dashboard:
1. Go to Settings → Callbacks
2. Add your callback URL:
   - Test: `http://localhost:3000/success`
   - Production: `https://your-domain.com/success`

### 4. Test with Paystack Test Mode

1. Use test mode keys (pk_test_*, sk_test_*)
2. Use Paystack's test card numbers:
   - Success: `4084084084084081` (any CVC, future expiry)
   - Fail: `5060600000000000001` (failed transaction)

More test cards: [Paystack Test Cards](https://paystack.com/docs/checkout/#test-cards)

### 5. Switch to Live Mode

When ready for production:
1. Switch Paystack to Live mode
2. Update your `.env` with live keys (pk_live_*, sk_live_*)
3. Update `NEXT_PUBLIC_APP_URL` to your production URL
4. Redeploy

---

## 📧 Configuring Email (Optional but Recommended)

### For Development/Testing

Email is optional! The system will work without it. Tickets are still shown on the success page.

### For Production

#### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Go to Account Settings → Security
3. Generate an **App Password** (not your regular password)
4. Add to `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=Nightflix <noreply@nightflix.com>
```

#### Using Other Providers

```env
# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxx
EMAIL_FROM=Nightflix <noreply@yourdomain.com>

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=xxxxxxx
EMAIL_FROM=Nightflix <noreply@yourdomain.com>
```

---

## 🔍 Troubleshooting

### "Verification Failed" Error

**Cause**: Payment reference not found in database

**Solution**:
1. Make sure you completed the purchase first
2. Check the reference matches exactly
3. Check server logs: `tail -f dev.log`
4. Use the simulation endpoint to test

### "Payment not successful" Error

**Cause**: Paystack rejected the payment

**Solution**:
1. Verify Paystack keys are correct
2. Check if you're in test/live mode correctly
3. Try with a different test card
4. Check Paystack dashboard for transaction status

### "Ticket not found" Error

**Cause**: Database issue or wrong reference

**Solution**:
1. Check if database was initialized: `bun run db:push`
2. Verify reference is correct
3. Clear browser cache and try again

### Email Not Sending

**Cause**: SMTP not configured or credentials wrong

**Solution**:
1. Verify SMTP credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check spam folder
4. System still works without email - tickets shown on page

### Paystack Redirect Not Working

**Cause**: Callback URL not configured

**Solution**:
1. Check Paystack dashboard → Settings → Callbacks
2. Ensure callback URL matches: `http://localhost:3000/success`
3. For production, use HTTPS URL

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Replace `.env.example` with real `.env` values
- [ ] Add Paystack live keys (pk_live_*, sk_live_*)
- [ ] Configure SMTP for email delivery
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Set Paystack callback URL to production
- [ ] Test complete flow with live payments
- [ ] Remove or secure `/api/tickets/simulate-payment` endpoint
- [ ] Deploy to Vercel
- [ ] Verify production deployment

---

## 📊 Monitoring

### Check Server Logs

```bash
# Real-time logs
tail -f dev.log

# Last 50 lines
tail -n 50 dev.log
```

### Common Log Messages

✅ "Verifying payment with reference: xxx" - Verification started
✅ "Found ticket: xxx, Status: PENDING" - Ticket found
✅ "Payment verified with Paystack" - Paystack verification successful
✅ "Updating ticket status to COMPLETED" - Ticket updated
✅ "Ticket email sent successfully to: xxx" - Email sent

❌ "Ticket not found for reference: xxx" - No ticket with this reference
❌ "Paystack verification request failed" - Paystack API issue
❌ "Failed to send ticket email" - SMTP issue (non-critical)

---

## 💡 Development Tips

1. **Test Everything Locally First**
   - Use simulation endpoint
   - Verify all flows work
   - Test error cases

2. **Check Database**
   ```bash
   # View database
   sqlite3 db/custom.db
   
   # List all tickets
   SELECT * FROM Ticket;
   ```

3. **Clear Test Data**
   ```bash
   # Reset database
   rm db/custom.db
   bun run db:push
   ```

4. **Test Multiple Scenarios**
   - Successful payment
   - Failed payment
   - Already verified ticket
   - Invalid ticket code
   - Email not sent

---

## 🆘 Quick Test Commands

```bash
# 1. Complete a test purchase
# (Do this through the UI)

# 2. Simulate payment
curl "http://localhost:3000/api/tickets/simulate-payment?reference=YOUR_REF"

# 3. View ticket
# (Visit /success?reference=YOUR_REF in browser)

# 4. Test verification
curl -X POST http://localhost:3000/api/tickets/verify-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticketCode": "NF-VIP-XXXXXXXX"}'
```

---

## 📞 Need More Help?

Check the main documentation:
- `README-NIGHTFLIX.md` - System overview
- `DEPLOYMENT.md` - Deployment guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

Or check the server logs for detailed error messages.

---

**Happy Testing! 🎉**
