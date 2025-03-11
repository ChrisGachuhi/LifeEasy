# **📌 LifeEasy Backend - README**  

This is the **backend** for the **LifeEasy E-commerce Platform**, built using **Node.js, Express.js, MongoDB, and Socket.io**. It includes **JWT authentication, role-based access control, product and order management, and real-time notifications**.

---

## **🚀 Features**
✅ **User Authentication** (Signup, Login, Logout)  
✅ **Role-Based Access Control** (User, Seller, Admin)  
✅ **Product Management** (CRUD operations for sellers/admins)  
✅ **Order Management** (Users place orders, sellers/admins manage them)  
✅ **Real-Time Notifications** (Socket.io for order updates)  
✅ **Secure File Uploads** (Multer for product images)  

---

## **📂 Folder Structure**
```
LifeEasy_Backend/
│── uploads/              # Stores uploaded product images
│── models/               # Mongoose schema definitions
│   ├── User.js           # User model (User, Seller, Admin)
│   ├── Product.js        # Product model
│   ├── Order.js          # Order model
│── middlewares/          # Middleware functions
│   ├── authenticateToken.js # Protects routes with JWT
│   ├── authorizeRole.js  # Restricts access based on roles
│── routes/               # Express routes for API
│   ├── auth.js           # User authentication routes
│   ├── product.js        # Product management routes
│   ├── order.js          # Order management routes
│── server.js             # Main Express server
│── socketManager.js      # Manages real-time order notifications
│── .env                  # Environment variables
│── package.json          # Dependencies and scripts
│── README.md             # Documentation (this file)
```

---

## **📌 Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/lifeeasy-backend.git
cd lifeeasy-backend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the root directory and add:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/LifeEasy
JWT_SECRET=your_secret_key_here
```

### **4️⃣ Start the Server**
```bash
npm start
```
Your backend should be running at **http://localhost:5000** 🎉.

---

## **📌 API Endpoints**
### **1️⃣ Authentication**
| Feature        | Method | Endpoint          | Access  |
|---------------|--------|-------------------|---------|
| **Sign Up**   | `POST` | `/api/auth/signup` | Public  |
| **Login**     | `POST` | `/api/auth/login`  | Public  |
| **Logout**    | `POST` | `/api/auth/logout` | Authenticated Users |
| **Get Users** | `GET`  | `/api/auth/users`  | Admin Only |

### **2️⃣ Product Management**
| Feature             | Method | Endpoint               | Access |
|---------------------|--------|------------------------|--------|
| **Add Product**     | `POST` | `/api/product`        | Seller, Admin |
| **Update Product**  | `PUT`  | `/api/product/:id`    | Seller, Admin |
| **Delete Product**  | `DELETE` | `/api/product/:id` | Seller, Admin |
| **Get All Products**| `GET`  | `/api/product`        | Public |
| **Get Product By ID** | `GET` | `/api/product/:id`  | Public |

### **3️⃣ Order Management**
| Feature             | Method | Endpoint            | Access |
|---------------------|--------|---------------------|--------|
| **Place Order**     | `POST` | `/api/order`       | User |
| **Get Orders**      | `GET`  | `/api/order`       | User, Seller, Admin |
| **Update Order**    | `PUT`  | `/api/order/:id`   | Admin |

---

## **📌 Application Flow**
### **🔹 User Registration & Login**
1. **User signs up** → `/api/auth/signup`
2. **User logs in** → `/api/auth/login`
3. **JWT Token generated** → Stored in localStorage/cookies for authentication.

### **🔹 Product Management**
1. **Seller/Admin adds products** → `/api/product`  
2. **Public users browse products** → `/api/product`  
3. **Sellers/Admins update or delete products** → `/api/product/:id`

### **🔹 Order Processing**
1. **User places an order** → `/api/order`
2. **Stock is updated** automatically.
3. **Real-time notification sent** to the **seller**.
4. **Admin receives order details**.
5. **Admin updates order status** → `/api/order/:id`

---

## **📌 Real-Time Notifications (Socket.io)**
### **🔹 How It Works**
- **When an order is placed**, `socketManager.js` notifies:
  - **Sellers** (if their product was ordered).
  - **Admins** (with order details: user, product, seller).
  
### **🔹 Frontend Integration Example**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('newOrder', (data) => {
  console.log('New Order Notification:', data.message);
});
```

---

## **📌 Testing with Postman**
1️⃣ **Import the API into Postman**  
2️⃣ **Set `Authorization: Bearer your_jwt_token_here`** for protected routes.  
3️⃣ **Use `Content-Type: multipart/form-data` for image uploads.**  
4️⃣ **Use `GET`, `POST`, `PUT`, `DELETE` requests based on API functionality.**  

---

## **📌 Next Steps**
- ✅ Backend API is **ready to integrate** with a frontend.
- 🚀 Next, implement the **React frontend** with a **dashboard, product pages, checkout, and notifications**.

---

## **📌 Contributing**
1️⃣ Fork the repo  
2️⃣ Create a new branch  
3️⃣ Commit changes  
4️⃣ Open a pull request  

---

## **📌 License**
MIT License - Free to use and modify.  

---

### **👨‍💻 Built by [Chris John/ Codegenix]**