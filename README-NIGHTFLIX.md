# 🎬 Nightflix Ticket Booking System

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

## 📦 Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Paystack and email credentials

# Set up the database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 📖 Documentation

For detailed setup instructions, deployment guides, and API documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🚀 Technology Stack

### Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI

### Payment & Communication
- **💳 Paystack** - Secure payment gateway for Africa
- **📧 Nodemailer** - Email delivery for tickets
- **📱 react-qr-code** - QR code generation

### Database & Backend
- **🗄️ Prisma** - Next-generation TypeScript ORM
- **🔐 SQLite** - Local database (upgradable to PostgreSQL for production)
- **✅ Zod** - TypeScript-first schema validation

### Forms & State
- **🎣 React Hook Form** - Performant forms with easy validation
- **🐻 Zustand** - Simple, scalable state management
- **🔔 Sonner** - Beautiful toast notifications

## 📱 Pages

- **`/`** - Landing page with event information and ticket tiers
- **`/checkout`** - Checkout page for buyer information and payment
- **`/success`** - Success page with ticket display and QR code
- **`/verify`** - Verification dashboard for venue staff

## 🔌 API Endpoints

- **`POST /api/tickets/initialize`** - Initialize Paystack payment
- **`GET /api/tickets/verify`** - Verify payment and get ticket
- **`POST /api/tickets/verify-ticket`** - Verify ticket at venue

## 🏗️ Building & Deployment

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import your project in Vercel
3. Configure environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Paystack Setup

1. Create an account at [dashboard.paystack.co](https://dashboard.paystack.co)
2. Get your Public Key and Secret Key
3. Add them to your `.env` file:
   ```env
   PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key
   ```

### Email Setup

Configure SMTP settings in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=Nightflix <noreply@nightflix.com>
```

## 🎨 Customization

### Update Event Details

Edit `src/app/page.tsx` to change:
- Event date and time
- Location
- Ticket prices
- Features list

### Update Branding

1. Replace `public/logo.svg` with your logo
2. Update colors in component files
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
- Optimized API routes
- Edge deployment with Vercel
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
