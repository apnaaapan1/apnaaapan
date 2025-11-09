# Contact Form Troubleshooting Guide

## Issues Found and Fixed

### 1. **Module System Mismatch (CRITICAL - FIXED)**
   - **Problem**: The API file was using `require()` (CommonJS) with `export default` (ES6), causing module loading errors in Vercel
   - **Fix**: Changed to ES6 `import` statements throughout
   - **Status**: ✅ Fixed

### 2. **Missing vercel.json Configuration (CRITICAL - FIXED)**
   - **Problem**: Without `vercel.json`, Vercel might not properly route API endpoints
   - **Fix**: Created `vercel.json` with proper routing configuration
   - **Status**: ✅ Fixed

### 3. **MongoDB Connection Error Handling (FIXED)**
   - **Problem**: Error handler tried to close a MongoDB connection that didn't exist
   - **Fix**: Added proper client variable tracking and null checks
   - **Status**: ✅ Fixed

### 4. **Missing Environment Variable Validation (FIXED)**
   - **Problem**: Code didn't validate if `MONGODB_URI` was set before attempting connection
   - **Fix**: Added validation at the start of the handler
   - **Status**: ✅ Fixed

### 5. **Email Error Handling (FIXED)**
   - **Problem**: Email errors could crash the entire request
   - **Fix**: Wrapped email sending in try-catch so DB save still succeeds
   - **Status**: ✅ Fixed

## Common Production Issues

### Issue: "Internal server error" in Production

#### Check 1: Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these variables are set:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `DATABASE_NAME` - Database name (default: `apnapan_contacts`)
   - `EMAIL_USER` - Your Gmail address (optional)
   - `EMAIL_PASS` - Gmail App Password (optional)
   - `RECIPIENT_EMAIL` - Where to send notifications (optional)

#### Check 2: MongoDB Atlas Configuration
1. **Network Access**: 
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is allowed (or add Vercel's IP ranges)
   - Vercel serverless functions have dynamic IPs, so allow all IPs for now

2. **Database User**:
   - Go to Database Access
   - Ensure the user has read/write permissions
   - Verify username and password match your connection string

3. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0
   ```
   - Replace `username`, `password`, `cluster`, and `database` with your actual values
   - URL-encode special characters in password (e.g., `@` becomes `%40`)

#### Check 3: Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on `/api/contact`
5. Check **Logs** for error messages
6. Look for:
   - MongoDB connection errors
   - Environment variable issues
   - Module import errors

#### Check 4: Verify Deployment
1. After fixing code, **redeploy** your application
2. Vercel should automatically redeploy on git push
3. Or manually trigger a redeployment from the dashboard

### Issue: Environment Variables Not Loading

**Symptoms**: 
- Works locally but fails in production
- Error: "MONGODB_URI environment variable is not set"

**Solutions**:
1. **Check Variable Names**: Ensure exact match (case-sensitive)
2. **Redeploy After Adding Variables**: Adding env vars requires a new deployment
3. **Check Environment Scope**: 
   - Production
   - Preview
   - Development
   - Set for all environments if needed

### Issue: MongoDB Connection Timeout

**Possible Causes**:
1. Network Access not configured in MongoDB Atlas
2. Incorrect connection string
3. Database user doesn't have proper permissions

**Solutions**:
1. Add `0.0.0.0/0` to MongoDB Atlas Network Access
2. Verify connection string format
3. Test connection string locally first

### Issue: Email Not Sending

**Note**: Email is optional. Form will still work if email fails.

**For Gmail**:
1. Enable 2-Factor Authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_PASS`
4. Use your Gmail address in `EMAIL_USER`

## Testing Checklist

### Before Deployment:
- [ ] All environment variables are set in Vercel
- [ ] MongoDB Atlas Network Access configured (0.0.0.0/0)
- [ ] MongoDB connection string tested locally
- [ ] Database user has read/write permissions

### After Deployment:
- [ ] Check Vercel function logs for errors
- [ ] Test contact form submission
- [ ] Verify data appears in MongoDB Atlas
- [ ] Check if email notifications work (if configured)

## Debugging Steps

1. **Check Vercel Logs**:
   ```
   Vercel Dashboard → Project → Deployments → Latest → Functions → /api/contact → Logs
   ```

2. **Test API Directly**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "phoneNumber": "1234567890",
       "question": "Test message"
     }'
   ```

3. **Verify MongoDB Connection**:
   - Use MongoDB Compass or mongo shell
   - Test connection string locally
   - Check if database and collection exist

4. **Check Environment Variables**:
   - In Vercel logs, you should see connection attempts
   - If you see "MONGODB_URI environment variable is not set", env vars aren't loaded

## Quick Fixes Applied

1. ✅ Changed from CommonJS (`require`) to ES6 modules (`import`)
2. ✅ Added `vercel.json` for proper routing
3. ✅ Fixed MongoDB connection error handling
4. ✅ Added environment variable validation
5. ✅ Improved error messages and logging
6. ✅ Fixed email error handling (won't crash on email failure)

## Next Steps

1. **Commit and push** the changes to trigger a new Vercel deployment
2. **Verify environment variables** are set in Vercel dashboard
3. **Check deployment logs** after redeployment
4. **Test the contact form** on the production site
5. **Monitor Vercel function logs** for any remaining issues

## Still Having Issues?

If problems persist after these fixes:

1. Check Vercel function logs for specific error messages
2. Verify MongoDB Atlas is accessible (test connection string locally)
3. Ensure all environment variables are correctly set in Vercel
4. Check if there are any rate limits or quotas exceeded
5. Verify the MongoDB connection string doesn't have special characters that need URL encoding

