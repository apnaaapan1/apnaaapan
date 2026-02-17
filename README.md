# Apnaaapan 


## 🚀 Features

### Public Platform
-   **Responsive Design**: Mobile-first approach using Tailwind CSS.
-   **Dynamic Content**: Blogs, Events, Team Members, and Client Reviews fetch from MongoDB.
-   **Contact System**: Integrated inquiry forms with email notifications (Nodemailer) and database storage.
-   **Analytics**: Google Tag Manager, Meta Pixel, and Google Analytics 4 integration.

### Admin Panel
Secure dashboard for administrators to manage website content dynamically:
-   **Dashboard**: Overview of recent activities and stats.
-   **Blog Management**: Create, edit, and delete health articles.
-   **Gallery Management**: Upload and organize photos of services/events.
-   **Job Applications**: Review applications from "Work With Us".
-   **Reviews**: Manage client testimonials.

## 🛠 Tech Stack

-   **Frontend**: React 18, Tailwind CSS, Framer Motion, GSAP
-   **Backend**: Node.js, Express (Serverless Functions on Vercel)
-   **Database**: MongoDB Atlas
-   **Services**: Cloudinary (Image Hosting), Nodemailer (Emails)

## 📂 Project Structure

```bash
Apnaaapan/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application Pages
│   │   ├── Admin*.js       # Admin Panel modules (Protected)
│   │   └── *.js            # Public pages (Home, Services, etc.)
│   ├── api/                # API utility functions
│   └── index.css           # Global styles and Tailwind directives
├── api/                    # Vercel Serverless Functions (Backend)
│   └── contact.js          # Contact form handler
└── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
```

## 🔧 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Copy `env.example` to `.env` and fill in your credentials:
    -   `MONGODB_URI`: Your MongoDB connection string.
    -   `EMAIL_USER` / `EMAIL_PASS`: For sending contact form emails.
    -   `REACT_APP_GA_MEASUREMENT_ID`: Google Analytics ID.
    -   `ADMIN_EMAIL` / `ADMIN_PASSWORD`: For Admin Panel access.

4.  **Run Locally**:
    ```bash
    npm run dev
    # Runs both the React app (localhost:3000) and the backend server (localhost:5000)
    ```

## 📦 Deployment

This project is optimized for deployment on **Vercel** or **Hostinger**.

👉 **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.**

## 📊 Analytics & Tracking

The project includes pre-configured integrations for:
-   **Google Tag Manager**: Managed via `public/index.html`.
-   **Meta Pixel**: For Facebook ad tracking.
-   **Google Analytics 4**: Page view and event tracking.

## 🛡️ License

Private - All rights reserved.
