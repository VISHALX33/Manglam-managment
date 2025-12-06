# Deployment Guide for Manglam Management System

This guide will help you deploy the backend on **Render** and the frontend on **Netlify**.

---

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Render Account**: Sign up at [Render.com](https://render.com)
3. **Netlify Account**: Sign up at [Netlify.com](https://www.netlify.com)
4. **GitHub Repository**: Push your code to GitHub

---

## Part 1: Deploy Backend on Render

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is sufficient)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/manglam-db?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual database password
6. In "Network Access", add `0.0.0.0/0` to allow connections from anywhere

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `manglam-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables (Click "Advanced" → "Add Environment Variable"):
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave empty, Render auto-assigns)
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `FRONTEND_URL` = `https://your-app-name.netlify.app` (we'll get this in Part 2)

6. Click **"Create Web Service"**
7. Wait for deployment to complete (takes 2-3 minutes)
8. **Copy your backend URL**: `https://manglam-backend.onrender.com`

---

## Part 2: Deploy Frontend on Netlify

### Step 1: Create Environment File

1. In your local project, create `frontend/.env`:
   ```
   VITE_API_URL=https://manglam-backend.onrender.com/api
   ```
   (Use your actual Render backend URL from Part 1)

2. **Important**: Add `.env` to your `.gitignore` if not already there

### Step 2: Deploy on Netlify

#### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub (if not already done)
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** and select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

6. Add Environment Variables:
   - Click "Site settings" → "Environment variables"
   - Add: `VITE_API_URL` = `https://manglam-backend.onrender.com/api`

7. Click **"Deploy site"**
8. **Copy your Netlify URL**: `https://your-app-name.netlify.app`

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod
```

### Step 3: Update Backend CORS

1. Go back to Render Dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` variable with your Netlify URL:
   ```
   FRONTEND_URL=https://your-app-name.netlify.app
   ```
5. Save and wait for auto-redeploy

---

## Part 3: Verify Deployment

1. Open your Netlify URL: `https://your-app-name.netlify.app`
2. Check if the dashboard loads
3. Try adding a member to test the connection
4. Check browser console for any errors

### Common Issues & Solutions

**Issue**: CORS Error
- **Solution**: Make sure `FRONTEND_URL` in Render matches your exact Netlify URL (with https://)

**Issue**: API connection failed
- **Solution**: Verify `VITE_API_URL` in Netlify environment variables is correct

**Issue**: MongoDB connection error
- **Solution**: Check MongoDB Atlas Network Access allows `0.0.0.0/0`

**Issue**: Render backend sleeping (free tier)
- **Solution**: First request takes 30-60 seconds to wake up the service

---

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/manglam-db
FRONTEND_URL=https://your-app-name.netlify.app
```

### Frontend (Netlify)
```
VITE_API_URL=https://manglam-backend.onrender.com/api
```

---

## Custom Domain (Optional)

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Render
1. Go to "Settings" → "Custom Domain"
2. Add your domain and configure DNS

---

## Monitoring

- **Backend Logs**: View in Render Dashboard → Your Service → Logs
- **Frontend Logs**: View in Netlify Dashboard → Your Site → Functions/Deploys
- **MongoDB Logs**: View in MongoDB Atlas → Clusters → Monitoring

---

## Free Tier Limitations

### Render (Free Plan)
- Services spin down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- 750 hours/month (enough for 1 service running 24/7)

### Netlify (Free Plan)
- 100GB bandwidth/month
- 300 build minutes/month
- Instant loading (no spin down)

### MongoDB Atlas (Free Plan)
- 512MB storage
- Shared cluster
- Enough for thousands of members

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas allows connections from anywhere

---

**Your app is now live! 🎉**

- Frontend: `https://your-app-name.netlify.app`
- Backend: `https://manglam-backend.onrender.com`
