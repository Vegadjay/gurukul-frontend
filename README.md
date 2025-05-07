# Guruqool

![Guruqool Logo](./assets/logo.png)

## Online One-on-One Learning Platform

Guruqool is a comprehensive marketplace connecting learners with freelance tutors for personalized one-on-one learning sessions across various domains including academics, music, art, and more.

## 📸 Platform Overview

### User Authentication
![Login Page](./public/screenshots/login.png)
*User login interface with authentication options*

![Registration Page](./public/screenshots/register.png)
*User registration form with role selection*

### Homepage
![Homepage](./public/screenshots/home.png)
*The Guruqool homepage showcasing featured tutors and search functionality*

![Featured Categories](./public/screenshots/cat.png)
*Featured learning categories displayed on the homepage*

![Filter Interface](./public/screenshots/filter.png)
*Advanced filtering options for finding the perfect tutor*

### Tutor Profiles
![Tutor Profile](./public/screenshots/tutor.png)
*Detailed tutor profile with expertise, ratings, and booking options*

![Tutor Reviews](./public/screenshots/review.png)
*Student reviews and ratings for a specific tutor*

![Availability Calendar](./public/screenshots/session.png)
*Interactive calendar showing tutor availability for booking*

### Student Experience
![Student Dashboard](./public/screenshots/student.png)
*Student dashboard showing upcoming sessions and learning history*

![Booking Interface](./public/screenshots/book.png)
*Session booking flow with time selection and payment options*

![Payment Gateway](./public/screenshots/payment.png)
*Secure payment processing interface integrated with Razorpay*

### Tutor Experience
![Tutor Dashboard](./public/screenshots/guru.png)
*Tutor interface with scheduled sessions and earnings overview*

![Chatting](./public/screenshots/message.png)
*Real time chating with student*

### Admin Management
![Admin Dashboard](./public/screenshots/adminstu.png)
*Administrative dashboard shows student information*

![Admin Panel](./public/screenshots/admintra.png)
*Administrative dashboard shows teacher information*


### Mobile Experience
![Mobile Homepage](./public/screenshots/res-1.png)
*Responsive mobile interface of the Guruqool homepage*

![Mobile Session](./public/screenshots/res-2.png)
*Mobile interface for attending learning sessions*

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)

## Overview

Guruqool aims to revolutionize personalized learning by creating a platform where:
- Students can find expert tutors in their desired field
- Tutors can offer their expertise as freelance educators
- Learning happens through personalized one-on-one sessions
- Secure payments and transaction management ensure trust

This platform bridges the gap between knowledge seekers and providers through an intuitive, secure, and efficient marketplace.

## Key Features

### User Authentication & Profile Management
- Secure login and registration
- Role-based access (Student, Tutor, Admin)
- Profile customization 

### Tutor Marketplace
- Advanced search with filters (domain, price, availability, ratings)
- Detailed tutor profiles
- Availability calendar integration

### Session Management
- Easy booking system
- Session tracking
- Real-time chat integration
- Session completion management

### Transaction System
- Secure payment processing via Razorpay
- Balance tracking
- Withdrawal requests
- Financial reporting

### Admin Dashboard
- User management
- Tutor approval system
- Transaction oversight
- Platform analytics

## Tech Stack

### Backend
- NodeJS
- Express
- PostgreSQL

### Frontend
- React/Angular
- Redux for state management
- Sass for styling

### External Integrations
- Razorpay for payments
- Socket.io for real-time chat

## Installation

### Prerequisites
- Node.js v14+
- PostgreSQL 12+
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/vegadjay/guruqool.git
cd guruqool
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
```bash
# Create .env files in both frontend and backend directories
# Backend .env example:
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/guruqool
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend .env example:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

5. Initialize the database
```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Start the development servers
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm start
```

## Usage

### Student Flow
1. Create an account or login
2. Search for tutors based on your learning needs
3. View tutor profiles and availability
4. Book a session with your preferred tutor
5. Make payment for the session
6. Join the chat at the scheduled time
7. Complete the session and provide feedback

### Tutor Flow
1. Register and complete profile with domain expertise
2. Wait for admin approval
3. Set availability in calendar
4. Accept booking requests
5. Conduct sessions via chat
6. Mark sessions as complete
7. Request withdrawals for your earnings

### Admin Flow
1. Login to admin dashboard
2. Approve/reject tutor applications
3. Monitor sessions and transactions
4. Manage user accounts
5. Process withdrawal requests
6. View platform analytics

## User Roles

### Student
- Can search and book tutors
- Can participate in chat sessions
- Can provide feedback and ratings

### Tutor
- Can offer teaching services
- Can manage availability calendar
- Can conduct chat sessions
- Can request withdrawals

### Admin
- Can approve/reject tutors
- Can monitor all platform activities
- Can manage users and transactions
- Can access analytics dashboard

## Screenshots

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### User Endpoints
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Tutor Endpoints
- `GET /api/tutors` - Get all tutors
- `GET /api/tutors/:id` - Get tutor by ID
- `POST /api/tutors/search` - Search tutors with filters
- `PUT /api/tutors/:id/approve` - Approve tutor (admin only)
- `GET /api/tutors/:id/availability` - Get tutor availability

### Session Endpoints
- `POST /api/sessions` - Create new session booking
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id/complete` - Mark session as complete
- `GET /api/users/:id/sessions` - Get user's sessions

### Transaction Endpoints
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/withdrawals` - Request withdrawal
- `PUT /api/withdrawals/:id/process` - Process withdrawal (admin only)

### Chat Endpoints
- `GET /api/chats/:sessionId` - Get chat history for a session
- `POST /api/chats/:sessionId` - Send a new message

## Project Structure

```
guruqool/
├── backend/                  # Node.js backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Custom middlewares
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── server.js             # Entry point
│
├── frontend/                 # React/Angular frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API services
│   │   ├── styles/           # Global styles
│   │   ├── utils/            # Utility functions
│   │   ├── App.js            # Main component
│   │   └── index.js          # Entry point
│   ├── .env                  # Environment variables
│   └── package.json          # Dependencies
│
├── screenshots/              # Application screenshots
├── .gitignore                # Git ignore file
├── package.json              # Root dependencies
└── README.md                 # This file
```


## Contributors

[Jay Vegad](https://x.com/JAY_VEGAD_)
<br/>
[Hemang patel](https://github.com/hemang-patel-9)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.