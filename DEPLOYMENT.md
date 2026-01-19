# Nightflix Ticket Booking System

A production-ready, mobile-responsive ticket booking system for events with Paystack payment integration, email delivery, and QR code verification.

## 🎯 Features

- **Multi-Tier Ticket System**
  - Regular: ₦5,000
  - VIP: ₦30,000
  - Gang of 5: ₦20,000 (5 tickets at ₦4,000 each)

- **Secure Payment Processing**
  - Paystack integration
  - Real-time payment verification
  - Automatic refund handling

- **Ticket Delivery**
  - Instant email delivery with ticket details
  - QR code for easy verification
  - Unique ticket codes for security

- **Venue Verification**
  - Real-time ticket verification
  - QR code scanning support
  - Anti-fraud system

- **Mobile-First Design**
  - Fully responsive layout
  - Touch-friendly interface
  - Optimized for all devices

- **Production Ready**
  - Scalable architecture (1000+ tickets)
  - Error handling and validation
  - Comprehensive logging

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Payment**: Paystack
- **Email**: Nodemailer
- **QR Codes**: react-qr-code
- **Forms**: react-hook-form + zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nightflix-tickets
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:
   ```env
   # Database
   DATABASE_URL=file:./db/custom.db

   # Paystack (Get these from https://dashboard.paystack.co)
   PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key

   # Email (for sending tickets)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=Nightflix <noreply@nightflix.com>

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   ```

5. **Run the development server**
   ```bash
   bun run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 🔧 Paystack Setup

1. Create a Paystack account at [dashboard.paystack.co](https://dashboard.paystack.co)
2. Go to Settings → API Keys
3. Copy your Public Key and Secret Key
4. Add them to your `.env` file
5. Configure your callback URL in Paystack dashboard:
   - Test Mode: `http://localhost:3000/success`
   - Production: `https://your-domain.com/success`

## 📧 Email Setup

### Using Gmail (Recommended)

1. Enable 2-Factor Authentication on your Google account
2. Go to Account Settings → Security
3. Generate an App Password
4. Use the app password in your `.env` file

### Using Other SMTP Providers

Update these environment variables:
- `SMTP_HOST`: Your SMTP server host
- `SMTP_PORT`: Your SMTP server port (usually 587 or 465)
- `SMTP_USER`: Your SMTP username
- `SMTP_PASSWORD`: Your SMTP password

## 🏗️ Building for Production

```bash
bun run build
```

## 🚀 Deploying to Vercel

### 1. Prepare for Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configure Environment Variables in Vercel**
   - Go to your Vercel project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Update `NEXT_PUBLIC_APP_URL` to your production URL
   - Update `DATABASE_URL` (see Database section below)

### 2. Database for Production

For production, you have two options:

#### Option A: Use Vercel Postgres (Recommended)
1. Install the Prisma Vercel extension:
   ```bash
   bun add @prisma/adapter-vercel-postgres
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

3. Update environment variables in Vercel:
   - `DATABASE_URL`: Your Vercel Postgres connection string
   - `DIRECT_URL`: Your Vercel Postgres direct connection string

#### Option B: Use SQLite with Vercel Storage
1. Install Vercel Storage SDK:
   ```bash
   bun add @vercel/postgres
   ```

2. Update your database configuration to use Vercel Blob

### 3. Deploy

1. Import your project in Vercel
2. Connect your GitHub repository
3. Deploy!

Vercel will automatically:
- Build your application
- Deploy to edge locations
- Handle SSL certificates
- Set up CI/CD

### 4. Update Paystack Callback URL

After deployment:
1. Go to Paystack Dashboard → Settings → Callbacks
2. Update your callback URL to: `https://your-domain.com/success`

## 📱 Pages Overview

### `/` - Landing Page
- Event information
- Ticket tier selection
- FAQ section
- Mobile responsive design

### `/checkout` - Checkout Page
- Buyer information form
- Order summary
- Payment initiation

### `/success` - Success Page
- Payment verification
- Ticket display with QR code
- Email confirmation
- Download and share options

### `/verify` - Verification Page
- Ticket verification dashboard
- Manual code entry
- Real-time verification status
- For venue staff

## 🔌 API Endpoints

### `POST /api/tickets/initialize`
Initialize a payment transaction.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+2348000000000",
  "tier": "VIP",
  "amount": 30000
}
```

**Response:**
```json
{
  "success": true,
  "reference": "uuid",
  "authorization_url": "https://paystack.co/...",
  "access_code": "code"
}
```

### `GET /api/tickets/verify?reference={ref}`
Verify payment and get ticket details.

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "ticketCode": "NF-VIP-XXXXXXXX",
    "tier": "VIP",
    "quantity": 1,
    "buyerName": "John Doe",
    "buyerEmail": "john@example.com",
    "paymentStatus": "COMPLETED",
    "verificationStatus": "NOT_VERIFIED"
  }
}
```

### `POST /api/tickets/verify-ticket`
Verify a ticket at the venue.

**Request Body:**
```json
{
  "ticketCode": "NF-VIP-XXXXXXXX"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "message": "Ticket verified successfully",
  "ticket": { ... }
}
```

## 🎨 Customization

### Update Event Details

Edit `src/app/page.tsx`:
```typescript
const eventDate = new Date()
eventDate.setDate(eventDate.getDate() + 30) // Set your event date

// Update event location, time, etc. in the JSX
```

### Update Ticket Prices

Edit `src/app/page.tsx`:
```typescript
const TICKET_TIERS = [
  {
    id: 'regular',
    name: 'Regular',
    price: 5000, // Update price
    // ...
  },
  // ...
]
```

### Update Branding

1. Replace `public/logo.svg` with your logo
2. Update colors in `src/app/page.tsx` (currently using rose, purple, emerald, amber)
3. Update email template in `src/app/api/tickets/verify/route.ts`

## 🔒 Security Features

- **Payment Security**: Paystack's secure payment gateway
- **Ticket Security**: Unique QR codes and ticket codes
- **Fraud Prevention**: Payment verification before ticket delivery
- **Data Protection**: Input validation and sanitization
- **Email Security**: SMTP authentication and TLS

## 📊 Scalability

The system is designed to handle 1000+ tickets:
- Efficient database queries with Prisma
- Optimized API routes with proper indexing
- Edge deployment with Vercel
- Caching strategies for frequent lookups
- Batch email sending support

## 🐛 Troubleshooting

### Payment not initializing
- Check Paystack API keys are correct
- Verify callback URL is configured
- Check browser console for errors

### Emails not sending
- Verify SMTP credentials
- Check if app password is correct (for Gmail)
- Check email spam folder
- Review server logs

### Ticket verification failing
- Ensure payment was successful
- Check ticket code is correct
- Verify database connection

### Build errors
- Run `bun run lint` to check for issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && bun install`

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support:
- Email: support@nightflix.com
- Phone: +234 800 000 0000

---

Built with ❤️ for Nightflix Events
