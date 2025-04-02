## Project Overview

This is a **JWT-authenticated full-stack eCommerce platform** following a **client-server model**, designed for scalability, maintainability, and seamless user experience.

### Tech Stack

- **Frontend**: React.js + Redux Toolkit Query + React Router DOM
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **API Design**: RESTful with MVC Architecture

### Architecture Overview

The application follows a **Client-Server Architecture**. The frontend handles state using Redux Toolkit Query and communicates with the Express API. The backend follows an MVC pattern and uses token-based middleware to protect routes and data. All cart, order, and product data is persisted in a NoSQL MongoDB database using relational references.

- Token-based authentication for secured access.
- Referential modeling for efficient cart and order tracking.
- Real-time API interactions using Redux Toolkit Query.
- Modular and reusable code structure for scalability.

### Features Summary

- User Registration/Login with JWT
- Role-Based Access Control (Admin, Seller, Buyer)
- Product Management (CRUD for Admin/Seller)
- Cart Persistence (Client & Server Synchronized)
- Order Management (Upcoming)
- Secure Checkout Flow
