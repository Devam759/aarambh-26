# Aarambh '26

Welcome to the official web application for **Aarambh '26**, the grand student orientation portal for JK Lakshmipat University (JKLU).

This Next.js application serves as the central hub for the event, offering real-time registrations, a dynamic admin dashboard, a live schedule, QR-code based check-ins, and automated email/WhatsApp integration.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database / Backend**: [Firebase](https://firebase.google.com/) (Firestore, Storage, Authentication)
- **Payments**: Cashfree Payment Gateway Integration
- **Emails**: Nodemailer (M365 Integration)
- **Excel Sync**: Google Apps Script Webhooks

## 📦 Features

- **Live Registrations**: Secure Cashfree payment flow with instant PDF receipt generation.
- **Admin Dashboard**: Comprehensive live data views, sorting, and CSV exports.
- **QR Code Scanner**: Built-in QR scanner for admins and volunteers to instantly check-in students at the gate.
- **Automated Workflows**: Fires off an official confirmation email (with attached receipt) and syncs the new registration directly to a Google Sheet.
- **Dynamic Content**: Live schedule, team directories, and interactive galleries.

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd aarambh-26
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the example environment file and fill in your actual credentials.
   ```bash
   cp .env.example .env.local
   ```
   *Note: Never commit `.env.local` to GitHub!*

4. **Firebase Admin SDK:**
   Place your `firebase-adminsdk.json` service account file in the root directory. This is required for server-side verification and admin actions. (Also ignored by Git).

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Security & Privacy

All sensitive files, API keys, and temporary generation files are strictly ignored via `.gitignore` to ensure they never leak into source control.

## 📄 License

This project is proprietary and built specifically for JK Lakshmipat University.
