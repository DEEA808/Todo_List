TodoList App

📌 Overview

This is a full-stack TodoList application with the frontend built in React and the backend using Express.js. It provides a seamless experience for users to manage their tasks, supports offline functionality, and includes user authentication with role-based access control.

🚀 Features

✅ User & Authentication

User Registration & Login (handled via Express & local database)

Role-Based Access Control:

Admin: Can manage users.

Regular Users: Can only manage their own tasks.

Session Management with authentication tokens

JWT Authentication: Secure login using JSON Web Tokens (JWT) with a secret key.

📝 Task Management

CRUD Operations: Users can Create, Read, Update, and Delete their own tasks.

Bulk Actions: Users can select and delete multiple tasks at once (Batch Deletion).

Task Completion: Mark tasks as complete/incomplete.

User Filtering: Filter users by specific attributes (e.g.age).

Infinite Scrolling: Load tasks dynamically as the user scrolls (Pagination with Lazy Loading).

Task Export: Export tasks in CSV format using CSVLink.

🌐 Offline Support

Local Storage: All tasks are stored locally when offline.

Sync Mechanism: Changes are automatically uploaded to the database once the user is back online.

🛠 Backend Features

Express.js Server handling all API requests.

Local Database for persistent storage.

Comprehensive Testing included for backend functionalities.

CORS Handling for seamless frontend-backend communication.

🛠 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/todolist-app.git
cd todolist-app

2️⃣ Install Dependencies

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

3️⃣ Run the Application

# Start backend server
cd server
npm start

# Start frontend
cd ../client
npm start

The frontend runs on http://localhost:3000/ and the backend on http://localhost:8081/.

🧪 Running Tests
cd server
npm tests
