# Secure Voting Application

This project contains a minimal Node.js backend and static frontend for a simple voting system.

## Backend

The backend lives in `server/` and is built with Express and MongoDB via `mongoose`.

### Running

Install dependencies and start the server:

```bash
cd server
npm install
npm start
```

### Environment variables

Set the following variables when running the server:

- `DB_URI` – MongoDB connection string
- `PAYSTACK_SECRET` – Paystack secret key
- `PAYSTACK_CALLBACK` – public URL for payment verification callback (e.g. `http://localhost:8080/secure-voting-website/paystack.html`)
- `JWT_SECRET` – secret used to sign authentication tokens
- `PORT` – (optional) port for the server
- `GOOGLE_CLIENT_ID` – Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret

## Frontend

Static pages are under `secure-voting-website/`:

- `index.html` – login/register and list available polls
- `admin.html` – admin interface to create polls, manage candidates and **toggle result visibility**
- `paystack.html` – page users are redirected to after completing payment
- `style.css` – shared stylesheet for a cleaner layout

Open these pages in a browser served from any HTTP server (e.g., `live-server`).

The login page also provides a **Login with Google** button that initiates an OAuth flow via `/api/auth/google`.

## Payment Endpoint

The backend exposes `/api/pay` to start a payment of ₦100 per vote and a `/api/pay/verify` endpoint for Paystack callbacks.
