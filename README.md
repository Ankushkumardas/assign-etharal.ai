# TaskFlow 🚀

TaskFlow is a premium, minimalist team task management application designed for modern high-performance teams. It features a sleek black-and-white aesthetic, real-time Kanban boards, and robust project tracking capabilities.

![TaskFlow Hero](/app/public/images/flowspace.png)

## ✨ Key Features

- **Dynamic Kanban Boards**: Move tasks through stages with a seamless, interactive board.
- **Multi-Assignee Support**: Assign multiple team members to a single task for collaborative work.
- **Project Tracking**: Organise tasks into specific projects with dedicated filtering.
- **Advanced Filters**: Real-time client-side filtering by Project, Priority, and Assignee.
- **Team Management**: Manage team roles and members (Admin only).
- **Minimalist UI**: A professional, distraction-free interface built with precision.
- **Dark Mode Ready**: Fully responsive and optimized for both light and dark aesthetics.

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **React Router DOM** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **JWT** (Authentication)
- **Bcrypt.js** (Security)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (Atlas recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankushkumardas/assign-etharal.ai.git
   cd assign-etharal.ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../app
   npm install
   ```
   Create a `.env` file in the `app/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

- **Frontend**: Recommended deployment on **Vercel**.
- **Backend**: Recommended deployment on **Railway** or Render.

*Note: Ensure to update the `VITE_API_URL` and `FRONTEND_URL` environment variables in your production environment.*

## 📄 License
This project is for demonstration purposes. All rights reserved.

---
Built with precision by [Ankush](https://github.com/Ankushkumardas).
