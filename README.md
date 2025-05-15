# Arnifi Blog Frontend

This is the frontend for the Blog App built using **React (Vite)** and **Tailwind CSS**. It consumes REST APIs to perform operations like viewing, creating, editing, and deleting blog posts.

## 🚀 Tech Stack

- React with Vite
- Tailwind CSS
- Axios (for API requests)
- React Router

## 🖥️ Live Demo

Deployed at: [https://arnifi-blog.netlify.app/](https://arnifi-blog.netlify.app/)

## 📦 Installation

```bash
git clone https://github.com/saran-mani/arnifi-blog-frontend
cd arnifi-blog-frontend
npm install
npm run dev
```
## 🔧 Environment Variables

Create a .env file in the root directory:

```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE_IN=7d
```