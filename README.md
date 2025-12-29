# Chatterly — Real-Time Messaging Application


## Description:
Chatterly is a modern, full-stack real-time chat application built to replicate production-grade messaging features. It focuses on responsive UX, instant messaging, media support with a production-ready architecture, providing a real-world chat experience.



## Features:-

1. 💬 Real-Time Messaging:
- One-to-one real-time messaging with Socket.IO
- Optimistic UI updates for instant message rendering
- Message status: Sent → Delivered → Seen
- Typing indicators for active chats
- Online/offline user presence tracking


2. 🖼️ Media Support:
- Send Text and Image messages
- Emoji picker integration
- Frontend image compression + Cloudinary upload


3. ⚙️ Settings: 
- Settings dropdown: profile, sound toggle, logout
- Sound Toggle -> Option for typing & notifications sound


4. 👤 Profile:
- Profile picture upload with preview, compression, and fallback avatars
- Display user info: Full Name, Email, Status (online/offline), Join Date


5. 🎨 UI/UX:
- Clean, responsive interface using React + Tailwind CSS
- Real-time messaging with smooth updates
- Auto-growing message input
- Defensive UI for empty states, loading, and errors (with toast notifications)
- Micro-interactions


6. Backend Features:
- Node.js + Express backend
- MongoDB for storage (users, messages)
- Arcjet Protection for rate-limiting and bot prevention
- JWT-based authentication, protected routes middleware.
- Socket authentication & user–socket mapping
- Scalable architecture with proper error handling




## 🛠 Tech Stack & Dependencies:

1. 🔧 Backend:
- Node.js, Express
- MongoDB + Mongoose
- Bcryptjs (password hashing)
- JWT Authentication
- Resend (for welcome email)
- @arcjet/node + @arcjet/inspect (rate-limiting / bot protection)
- CORS, dotenv, cookie-parser
- Cloudinary
- Socket.IO


2. 🎨 Frontend:
- React, React DOM, React Router
- Tailwind CSS + DaisyUI
- Zustand (state management)
- Axios (API calls)
- React-hot-toast
- Lucide-react icons
- Browser-image-compression
- Emoji-picker-react
- @rive-app/react-canvas
- Socket.IO-Client




## 📂 Backend Structure:
<pre>
src/
 ├── controllers/
 ├── emails/
 ├── lib/
 ├── middleware/
 ├── models/
 ├── routes/
 └── server.js
</pre>


## 📂 Frontend Structure:
<pre>
frontend/
 │
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── components/   # Reusable UI components
 │   ├── hooks/
 │   ├── lib/
 │   ├── pages/        # Chat page, Profile page, Login/Signup
 │   ├── store/        # Zustand stores
 │   └── App.jsx
 └── App.jsx
 └── index.css
 └── main.jsx
 └── index.html
</pre>