# 🚀 Quick Setup Guide for Manglam Mass Management System

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- ✅ Git (optional)
- ✅ VS Code or any code editor

## Step-by-Step Installation

### 1️⃣ Install MongoDB
1. Download and install MongoDB Community Server
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
```bash
mongosh
# or
mongo
```

### 2️⃣ Setup Backend

Open terminal/command prompt and run:

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Verify .env file exists with correct configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/manglam-mass
# NODE_ENV=development
```

**Start Backend Server:**
```bash
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected Successfully
```

### 3️⃣ Setup Frontend

Open a **NEW** terminal/command prompt:

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎯 First Steps After Installation

### 1. Add Your First Member
1. Click on **"Members"** in the sidebar
2. Click **"Add Member"** button
3. Fill in the details:
   - Name: John Doe
   - Phone: 9876543210
   - Food Time: 2 times
   - Payment Plan: Monthly (₹3300)
4. Click **"Add Member"**

### 2. Record a Payment
1. Go to **"Payments"** page
2. Click **"Record Payment"**
3. Select the member you just added
4. The amount will auto-fill based on the plan
5. Select payment method (Cash/UPI/Card)
6. Click **"Record Payment"**

### 3. Mark Attendance
1. Navigate to **"Attendance"** page
2. You'll see the member in "Unmarked Members"
3. Click **"Present"** or **"Absent"**
4. Switch to **"Monthly View"** to see the calendar grid

### 4. View Dashboard
1. Click on **"Dashboard"** in the sidebar
2. See all statistics, charts, and analytics
3. View recent members and activities

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
❌ MongoDB Connection Error
```
**Solution:**
- Ensure MongoDB is running
- Check the MONGODB_URI in `.env` file
- Try: `mongosh` in terminal to verify MongoDB is accessible

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in backend/.env to 5001 or any available port
- Or stop the process using port 5000

### Frontend Issues

**Dependencies Error:**
```
Cannot find module 'react'
```
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**
- Vite will automatically suggest another port (like 3001)
- Press 'y' to use the suggested port

### Database Issues

**Database is Empty:**
- Normal for first run
- Start by adding members manually
- Data will be persisted in MongoDB

## 📊 Sample Data (Optional)

Want to start with sample data? You can add these members:

1. **Member 1**
   - Name: Rahul Sharma
   - Phone: 9876543210
   - Food Time: 3 times
   - Plan: Monthly (₹3300)

2. **Member 2**
   - Name: Priya Singh
   - Phone: 9876543211
   - Food Time: 2 times
   - Plan: 15 Days (₹1650)

3. **Member 3**
   - Name: Amit Kumar
   - Phone: 9876543212
   - Food Time: 1 time
   - Plan: Nasta Only (₹500)

## 🔄 Stopping the Application

### Stop Backend:
- Press `Ctrl + C` in the backend terminal

### Stop Frontend:
- Press `Ctrl + C` in the frontend terminal

### Stop MongoDB:
- **Windows**: No action needed (runs as service)
- **Mac**: `brew services stop mongodb-community`
- **Linux**: `sudo systemctl stop mongod`

## 📱 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |
| Database Name | manglam-mass |

## 🎨 Features to Explore

1. **Dashboard** - Overview of all statistics
2. **Members** - Add, edit, delete members
3. **Attendance** - Daily and monthly tracking
4. **Payments** - Record and track payments
5. **Reports** - Generate comprehensive reports

## 💡 Tips

1. **Always keep both terminals open** - One for backend, one for frontend
2. **MongoDB must be running** before starting the backend
3. **Clear browser cache** if you see styling issues
4. **Use Chrome DevTools** (F12) to debug any frontend issues
5. **Check backend terminal** for API errors

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Ensure all dependencies are installed
3. Verify MongoDB is running
4. Check that ports 3000 and 5000 are available
5. Review the README.md for detailed documentation

## 🎉 You're All Set!

Your Manglam Mass Management System is now ready to use!

Start managing your mass operations efficiently with:
- ✅ Real-time member management
- ✅ Automated attendance tracking
- ✅ Payment processing and analytics
- ✅ Comprehensive reporting

---

**Happy Managing! 🍽️**
