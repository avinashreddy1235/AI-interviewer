# Deployment Guide

This guide explains how to deploy the **Interview Partner** application.
- **Frontend**: Netlify
- **Backend**: Render

## Prerequisites
- A GitHub account with this repository pushed.
- A [Netlify](https://www.netlify.com/) account.
- A [Render](https://render.com/) account.

---

## Part 1: Deploy Backend to Render

1.  Log in to your **Render** dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository (`AI-interviewer`).
4.  Configure the service:
    - **Name**: `interview-partner-backend` (or similar)
    - **Region**: Choose the one closest to you.
    - **Branch**: `main`
    - **Root Directory**: `.` (leave empty)
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables**:
    - Scroll down to "Environment Variables" and click "Add Environment Variable".
    - **Key**: `VITE_GEMINI_API_KEY`
    - **Value**: Your Gemini API Key (from your local `.env`).
    - **Key**: `FRONTEND_URL`
    - **Value**: `*` (You can update this later once you have your Netlify URL).
6.  **Database (PostgreSQL)**:
    - *Note: Render's free web services spin down after inactivity. SQLite data will be lost. Use PostgreSQL for persistence.*
    - In Render dashboard, click **New +** -> **PostgreSQL**.
    - Name it `interview-db`.
    - Create it.
    - Copy the **Internal Database URL** (starts with `postgres://...`).
    - Go back to your **Web Service** -> **Environment Variables**.
    - Add **Key**: `DATABASE_URL`
    - **Value**: Paste the Internal Database URL.
7.  Click **Create Web Service**.
8.  Wait for the deployment to finish. Copy your backend URL (e.g., `https://interview-partner-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Netlify

1.  Log in to your **Netlify** dashboard.
2.  Click **Add new site** -> **Import from existing project**.
3.  Select **GitHub** and authorize.
4.  Pick your repository (`AI-interviewer`).
5.  Configure the build:
    - **Base directory**: (leave empty)
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
6.  **Environment Variables**:
    - Click **Add environment variables**.
    - **Key**: `VITE_API_URL`
    - **Value**: Your Render Backend URL (e.g., `https://interview-partner-backend.onrender.com/api`).
    - **Key**: `VITE_GEMINI_API_KEY`
    - **Value**: Your Gemini API Key.
7.  Click **Deploy interview-partner**.
8.  Wait for the deployment. You will get a URL (e.g., `https://interview-partner.netlify.app`).

---

## Part 3: Final Configuration

1.  Go back to **Render Web Service**.
2.  Update the `FRONTEND_URL` environment variable to your actual Netlify URL (e.g., `https://interview-partner.netlify.app`) to restrict CORS (optional but recommended).
3.  Your app is now live!
