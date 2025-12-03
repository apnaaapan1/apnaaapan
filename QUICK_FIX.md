# Quick Fix for Contact Form Error

## The Problem
You're getting "Internal server error" because the MongoDB connection is failing.

## Solution Steps

### Step 1: Create .env file
Create a file named `.env` in the `Apnaaapan` folder with this content:

```env
MONGODB_URI=mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=apnapan_contacts
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
RECIPIENT_EMAIL=contact@yourdomain.com
```

**Important:** Replace the MongoDB credentials if they're different!

### Step 2: Check MongoDB Atlas Settings

1. Go to https://cloud.mongodb.com/
2. Login to your account
3. Go to **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Click **Allow Access from Anywhere** (or add your current IP)
6. Click **Confirm**

### Step 3: Restart the Server

1. Stop the current server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test the Connection

Open in browser: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  ...
}
```

### Step 5: Test MongoDB Connection

Run this command:
```bash
npm run test:contact
```

This will test if MongoDB connection works.

## Common Issues

### Issue: "authentication failed"
- **Solution:** Check your MongoDB username and password in `.env` file
- Make sure there are no extra spaces in the connection string

### Issue: "timeout" or "ENOTFOUND"
- **Solution:** 
  1. Check your internet connection
  2. Go to MongoDB Atlas → Network Access
  3. Add your IP address (or allow from anywhere)

### Issue: Server not starting
- **Solution:** Make sure you're in the `Apnaaapan` folder when running commands

## Still Not Working?

1. Check the server console (terminal where `npm run dev` is running)
2. Look for error messages that start with `❌` or `Error:`
3. Share those error messages to get help





