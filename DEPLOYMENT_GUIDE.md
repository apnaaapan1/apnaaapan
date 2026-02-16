# Project Structure & Hostinger Deployment Guide

## 1. Project Structure Clarification

Your project is a **Full-Stack JavaScript Application** (MERN Stack: MongoDB, Express, React, Node.js).
- **Frontend**: The React code is inside the `src/` folder. It handles the user interface.
- **Backend**: The Node.js/Express server is in `server.js`. It handles API requests, connects to MongoDB, and serves the frontend.

**Are they in the same file?**
No, the code is in separate files (`src/` vs `server.js`), but they are in the **same project folder**. They run together as one application.
- `server.js` acts as the main entry point.
- It serves the API at `/api/...`.
- It serves the frontend (React) static files for all other routes (`*`).

## 2. Deploying on Hostinger (Shared Hosting / Cloud Hosting)

Hostinger supports Node.js applications on most plans. Here is how to deploy:

### Step 1: Prepare the Build
1. Open your terminal in VS Code.
2. Run the build command to create the optimized frontend files:
   ```bash
   npm run build
   ```
   This will create a `build/` folder in your project root.

3. Create a zip archive of your project **excluding** `node_modules` and `.git`.
   - Select all files/folders (including `build`, `server.js`, `package.json`, `.env`).
   - **Do NOT** include `node_modules` (it's too large and will be re-installed on the server).
   - Zip them into `project.zip`.

### Step 2: Upload to Hostinger
1. Log in to your Hostinger hPanel.
2. Go to **Websites** -> **Manage**.
3. Go to **Files** -> **File Manager**.
4. Navigate to `public_html` (or create a subfolder like `public_html/app` if you want it on a subdirectory).
5. Default Hostinger setup might have an `index.php` or `default.php` file inside public_html. Delete it.
6. Upload `project.zip`.
7. Right-click and **Extract** custom folder.

### Step 3: Configure Node.js
1. Go back to hPanel dashboard.
2. Scroll down to **Advanced** -> **Node.js**.
3. Create a new application:
   - **Node.js Version**: Select 18 or higher (match your local version if possible).
   - **Application Mode**: Production.
   - **Application Root**: The path where you extracted the files (e.g., `public_html`).
   - **Application Startup File**: `server.js` (THIS IS CRITICAL).
   - Click **Create**.

### Step 4: Install Dependencies
1. Once created, click the **npm install** button in the Node.js settings.
   - This will read `package.json` and install libraries.
   - *Note: If the button fails, you may need to SSH into the server and run `npm install` manually.*

### Step 5: Environment Variables
1. You may need to create an `.env` file on the server if it wasn't uploaded (dotfiles are often hidden).
   - Check File Manager settings to "Show Hidden Files".
   - Or manually create a new file named `.env` in the root directory and paste your local `.env` content (MongoDB URI, Email credentials, etc.).

### Step 6: Start the Server
1. Click **Restart** or **Start** in the Node.js settings.
2. Visit your domain. Your app should be live!

### Troubleshooting
- **404 Errors**: Check if `server.js` is correctly set as the startup file.
- **Database Error**: Ensure your MongoDB Atlas IP Whitelist allows access from anywhere (`0.0.0.0/0`) or find your Hostinger server IP and add it.

## Alternative: Deploying on VPS (CyberPanel/Ubuntu)
If you have a VPS plan, it's even easier with full control:
1. SSH into server.
2. Install Node.js & PM2 (`npm install -g pm2`).
3. Clone/Upload your code.
4. Run `npm install`.
5. Run `npm run build`.
6. Start with PM2: `pm2 start server.js --name "apnaaapan"`.
7. Setup Nginx as a reverse proxy to forward port 80 to port 5000.
