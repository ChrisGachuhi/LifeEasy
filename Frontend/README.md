## Critical Issues & Fixes

### 1 Issue: Images Not Displaying on the Frontend**  
**Problem:**  
- The uploaded images were stored incorrectly in the database, causing invalid URLs when trying to display them.  
- Express was not correctly serving static files, making the `/uploads/` folder inaccessible from the frontend.  

**Fixes:**  
**Fixed Express static file serving** in `server.js` by using:
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

**Updated image storage format** in `routes/product.js`:
image: `uploads/${req.file.filename}` // Removed the unnecessary slash

**Ensured consistent frontend image rendering** in `Home.jsx` and `ProductDetails.jsx`:
src={`http://localhost:5000/${product.image.startsWith('uploads') ? product.image : `uploads/${product.image}`}`}

**Outcome:**  
Images now correctly display across the entire site, including Home and Product Details pages.  


### 2 Issue: Unable to Update Product Image**  - Issue Persists///Pending Resolve
**Problem:**  
- The `PUT /api/product/:id` request was not handling image updates properly.  
- The frontend wasn’t sending images in the correct format (`FormData`).  

**Fixes:**  
**Updated `routes/product.js` to accept image updates:**  
const updateFields = { name, description, price, category, stock };
if (req.file) updateFields.image = `uploads/${req.file.filename}`;
await Product.findByIdAndUpdate(id, updateFields);

**Ensured the frontend correctly sent FormData for image updates:**  
const productData = new FormData();
Object.entries(formData).forEach(([key, value]) => productData.append(key, value));
await updateProduct({ id: selectedProductId, data: productData }).unwrap();

**Outcome:**  
Product images can now be updated successfully.  

### 3 Issue: Product Creation API Not Storing Data in Database**  
**Problem:**  
- The API was receiving data, but the product was **not being created** in MongoDB.  
- The frontend was incorrectly structuring the request.  

**Fixes:**  
**Modified `routes/product.js` to properly handle file uploads:**  
const product = new Product({
  name,
  description,
  price,
  category,
  stock,
  image: `uploads/${req.file.filename}`, 
  owner: req.user.id,
});
await product.save();

**Ensured the frontend sends form data correctly in `productApi.js`:**  
createProduct: builder.mutation({
  query: (productData) => {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => formData.append(key, value));
    return { url: '/', method: 'POST', body: formData };
  },
}),

**Outcome:**  
New products are successfully stored in MongoDB and visible in the UI.  


### 4 Issue: Unable to Delete Products
**Problem:**  
- The `DELETE /api/product/:id` request was not removing items from MongoDB.  
- The backend was missing an `await` for the `.remove()` method.  

**Fixes:**  
**Fixed `routes/product.js` by using `findByIdAndDelete()`:**  
await Product.findByIdAndDelete(req.params.id);

**Ensured the frontend correctly triggers the delete action:**  
await deleteProduct(id);
refetch(); // Refresh the product list

**Outcome:**  
Products can now be deleted correctly without errors.  

### 5 Issue: Authentication & User Registration Issues**  
**Problem:**  
- Some users weren’t appearing in MongoDB after signup.  
- `POST /api/auth/signup` was **not returning any user data**.  
- The frontend wasn’t properly handling token storage after registration.  

**Fixes:**
**Updated `routes/auth.js` to return user data after signup:**  
res.status(201).json({
  message: 'User account created successfully',
  user: { id: newUser._id, username, email, role },
});

**Fixed `AuthContext.jsx` to store user data after signup:**  
const register = async (userData) => {
  const { data } = await registerUser(userData);
  if (data) {
    login(data.email, userData.password); // Automatically log in after signup
  }
};

**Outcome:**  
New users now correctly appear in MongoDB, and authentication works seamlessly.  

## What We Learned from These Fixes
1 Understanding Express Static Files:  
- How to properly serve uploaded files so they can be accessed from the frontend.  

2 Ensuring Image URLs Are Correct:  
- The importance of correctly formatting image paths in the database and frontend.  

3 Handling Image Uploads with Multer:  
- How to properly send and update images using `FormData`.  

4 CRUD Operations in MongoDB:  
- The correct methods to create, update, and delete data in MongoDB.  

5 Authentication & Token Storage:  
- The proper way to store user credentials and automatically log in after signup.  

## Next Steps
- Test all functionalities to confirm stability.  
- Ensure proper user role-based access to CRUD operations.  
- Start integrating real-time notifications for orders.  