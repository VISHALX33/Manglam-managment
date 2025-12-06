# 🍽️ Manglam Mass Management System

A comprehensive MERN stack application for managing mass/hostel operations including member management, attendance tracking, payment processing, and detailed analytics.

## ✨ Features

### 📊 Dashboard
- Real-time statistics and analytics
- Revenue trends with interactive charts
- Food time and payment plan distribution
- Recent members and activity logs
- Pending payment alerts
- Monthly revenue tracking (last 6 months)

### 👥 Member Management
- Add new members with complete details
- Edit and update member information
- Search and filter members
- Track member status (Active/Inactive)
- Multiple payment plans support
- Emergency contact information

### 📅 Attendance System
- Today's attendance view with quick actions
- Monthly attendance grid (interactive calendar)
- Bulk attendance marking
- Attendance percentage tracking
- Present/Absent/Holiday status
- Real-time attendance statistics

### 💰 Payment Management
- Record payments with multiple methods
- Payment history tracking
- Revenue analytics
- Payment method distribution
- Automatic plan amount calculation
- Transaction ID tracking

### 📈 Reports & Analytics
- Revenue reports with detailed breakdowns
- Attendance reports
- Member statistics
- Comprehensive overview reports
- Export functionality (PDF/Excel/CSV)
- Monthly trend analysis

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite) - Fast and modern build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Interactive data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **date-fns** - Date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/manglam-mass
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎨 Color Theme

### Primary Colors (Green)
- Primary 50: `#f0fdf4`
- Primary 100: `#dcfce7`
- Primary 500: `#10b981` (Main)
- Primary 600: `#059669`
- Primary 700: `#047857`
- Primary 900: `#064e3b`

### Secondary Color
- White: `#FFFFFF`
- Gray shades for text and backgrounds

## 📱 Key Components

### Member Form Fields
- Full Name (Required)
- Phone Number (10-digit, Required, Unique)
- Food Time (1 time/2 times/3 times)
- Payment Plan:
  - Monthly - ₹3300
  - 15 Days - ₹1650
  - Nasta Only - ₹500
  - Custom Amount
- Address (Optional)
- Emergency Contact (Optional)

### Payment Plans
1. **Monthly Plan**: ₹3300/month
2. **15 Days Plan**: ₹1650/15 days
3. **Nasta Only**: ₹500/month
4. **Custom**: User-defined amount

### Attendance Status
- **Present**: Member attended
- **Absent**: Member did not attend
- **Holiday**: Marked as holiday

### Payment Methods
- Cash
- UPI
- Card
- Bank Transfer

## 🗂️ Project Structure

```
Manglam-management/
├── backend/
│   ├── controllers/
│   │   ├── memberController.js
│   │   ├── attendanceController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── Member.js
│   │   ├── Attendance.js
│   │   ├── Payment.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── memberRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Dashboard/
│   │   │   ├── Members/
│   │   │   └── Payments/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Payments.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── memberService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── paymentService.js
│   │   │   └── dashboardService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/stats` - Get member statistics

### Attendance
- `GET /api/attendance/monthly` - Get monthly attendance
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/member/:memberId` - Get member attendance
- `POST /api/attendance/mark` - Mark attendance
- `POST /api/attendance/bulk-mark` - Bulk mark attendance
- `GET /api/attendance/stats` - Get attendance statistics

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/member/:memberId` - Get member payments
- `POST /api/payments` - Create payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/pending` - Get pending payments

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get activity logs

## 🎯 Usage Guide

### Adding a Member
1. Navigate to Members page
2. Click "Add Member" button
3. Fill in required details (Name, Phone, Food Time, Payment Plan)
4. Add optional details (Address, Emergency Contact)
5. Click "Add Member" to save

### Marking Attendance
**Today's View:**
1. Go to Attendance page
2. Select "Today's Attendance" view
3. Mark individual members or use bulk actions

**Monthly View:**
1. Select "Monthly View"
2. Choose month and year
3. Click on any cell to cycle through: Present → Absent → Holiday

### Recording Payments
1. Go to Payments page
2. Click "Record Payment"
3. Select member (amount auto-fills)
4. Enter payment date and method
5. Add transaction ID (for digital payments)
6. Add notes if needed
7. Submit payment

### Generating Reports
1. Navigate to Reports page
2. Select report type (Revenue/Attendance/Members/Comprehensive)
3. Choose period (Month/Year)
4. View detailed analytics
5. Export as PDF/Excel/CSV

## 🛠️ Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The build files will be in the `frontend/dist` directory.

## 📊 Database Schema

### Member Collection
```javascript
{
  name: String (required),
  phone: String (required, unique, 10-digit),
  foodTime: String (enum: '1 time', '2 times', '3 times'),
  paymentPlan: String (enum: 'monthly', '15days', 'nasta', 'custom'),
  planAmount: Number (required),
  joiningDate: Date (default: now),
  address: String,
  emergencyContact: String (10-digit),
  isActive: Boolean (default: true),
  totalPaid: Number (default: 0),
  nextPaymentDue: Date,
  timestamps: true
}
```

### Attendance Collection
```javascript
{
  member: ObjectId (ref: Member),
  date: Date (required),
  status: String (enum: 'present', 'absent', 'holiday'),
  month: Number (required),
  year: Number (required),
  mealType: {
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean
  },
  timestamps: true
}
```

### Payment Collection
```javascript
{
  member: ObjectId (ref: Member),
  amount: Number (required),
  paymentDate: Date (default: now),
  paymentMethod: String (enum: 'cash', 'upi', 'card', 'bank_transfer'),
  transactionId: String,
  notes: String,
  month: Number (required),
  year: Number (required),
  timestamps: true
}
```

## 🔐 Security Features
- Input validation on both frontend and backend
- Phone number uniqueness enforcement
- Data sanitization
- Error handling and logging
- Activity tracking for audit trails

## 🎨 UI/UX Features
- Responsive design (Mobile, Tablet, Desktop)
- Green-white professional theme
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling
- Interactive charts and graphs
- Intuitive navigation
- Search and filter capabilities

## 📝 Future Enhancements
- SMS notifications for payment reminders
- Email integration
- Multi-user authentication
- Role-based access control
- Advanced analytics dashboard
- Mobile application
- Automated backup system
- Expense tracking
- Menu management
- Inventory management

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is open source and available under the MIT License.

## 👨‍💻 Author
Manglam Mass Management System

---

**Built with ❤️ using MERN Stack**
