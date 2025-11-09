# Vercel Deployment Setup Guide

## The Problem
Your contact form works locally but shows "Internal server error" on Vercel because:
1. Environment variables are not set in Vercel
2. The serverless function needs proper configuration

## Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project (`apnaaapan`)

### Step 2: Add Environment Variables
1. Click on **Settings** (top menu)
2. Click on **Environment Variables** (left sidebar)
3. Add these variables one by one:

#### Required Variables:

**1. MONGODB_URI**
- **Key:** `MONGODB_URI`
- **Value:** `mongodb+srv://apnaaapan_user:apnaaapan_user@cluster0.libx8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

**2. DATABASE_NAME**
- **Key:** `DATABASE_NAME`
- **Value:** `apnapan_contacts`
- **Environment:** Select all
- Click **Save**

**3. EMAIL_USER** (Optional - for email notifications)
- **Key:** `EMAIL_USER`
- **Value:** `your-email@gmail.com`
- **Environment:** Select all
- Click **Save**

**4. EMAIL_PASS** (Optional - for email notifications)
- **Key:** `EMAIL_PASS`
- **Value:** `your-gmail-app-password` (16 characters, no spaces)
- **Environment:** Select all
- Click **Save**

**5. RECIPIENT_EMAIL** (Optional - for email notifications)
- **Key:** `RECIPIENT_EMAIL`
- **Value:** `contact@yourdomain.com`
- **Environment:** Select all
- Click **Save**

### Step 3: Redeploy
After adding all environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Test
1. Go to your Vercel URL: `https://apnaaapan-u331.vercel.app/contact`
2. Fill out and submit the form
3. Check if it works!

## Important Notes

### MongoDB Atlas Network Access
Make sure your MongoDB Atlas allows connections from Vercel:
1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or add Vercel's IP ranges)
4. Click **Confirm**

### Check Vercel Function Logs
If it still doesn't work:
1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Click on `/api/contact`
4. Check the **Logs** tab to see error messages

## Quick Checklist

- [ ] MONGODB_URI is set in Vercel
- [ ] DATABASE_NAME is set in Vercel
- [ ] EMAIL_USER is set (if you want emails)
- [ ] EMAIL_PASS is set (if you want emails)
- [ ] RECIPIENT_EMAIL is set (if you want emails)
- [ ] MongoDB Atlas Network Access allows Vercel
- [ ] Redeployed after adding environment variables
- [ ] Tested the form on Vercel

## Common Issues

### Issue: Still getting "Internal server error"
**Solution:** 
1. Check Vercel Function Logs (Functions tab → /api/contact → Logs)
2. Look for MongoDB connection errors
3. Verify MONGODB_URI is correct
4. Check MongoDB Atlas Network Access settings

### Issue: "Database authentication failed"
**Solution:**
- Check your MongoDB username and password in MONGODB_URI
- Make sure there are no extra spaces
- Verify the user exists in MongoDB Atlas

### Issue: "Database connection timeout"
**Solution:**
- Check MongoDB Atlas Network Access
- Make sure "Allow Access from Anywhere" is enabled
- Wait a few minutes after changing network settings

## Need Help?

Check the Vercel Function Logs to see the exact error message. The improved error handling will show you what's wrong!

