# Gaius Backend API - Swagger Documentation Setup

## ✅ Setup Complete

Your backend API now has comprehensive Swagger/OpenAPI documentation with detailed request/response examples and schemas.

## 📍 Access the Documentation

**View your API documentation at:** `http://localhost:5000/api/docs`

## 📋 What's Included

### Complete API Documentation
- **10+ API Endpoints** across multiple modules
- **Request/Response Examples** for all endpoints  
- **JWT Authentication** (Bearer token) support
- **Admin-only Endpoints** clearly marked with security requirements
- **Comprehensive Error Responses** (400, 401, 403, 404, 429, 500)
- **Production & Development** server configurations

### Documented Modules

#### 1. **Authentication** (`/auth`)
- `POST /auth/request-otp` - Request OTP for phone number (Rate limited: 5 requests per 10 min)
- `POST /auth/verify-otp` - Verify OTP and get JWT token

#### 2. **Users** (`/users`)
- `GET /users/me` - Get current user profile (requires auth)

#### 3. **Addresses** (`/addresses`)
- `GET /addresses` - List user addresses
- `POST /addresses` - Create new address
- `PATCH /addresses/{id}` - Update address
- `DELETE /addresses/{id}` - Delete address
- `PATCH /addresses/{id}/default` - Set default address

#### 4. **Categories** (`/categories`)
- `GET /categories` - List all categories
- `POST /categories` - Create category (admin only)
- `PATCH /categories/{id}` - Update category (admin only)
- `DELETE /categories/{id}` - Delete category (admin only)

#### 5. **Products** (`/products`)
- `GET /products` - List all products
- `GET /products/{id}` - Get product details
- `GET /products/admin/all` - List all products (admin only)
- `POST /products/admin` - Create product (admin only)
- `PATCH /products/admin/{id}` - Update product (admin only)
- `DELETE /products/admin/{id}` - Delete product (admin only)

#### 6. **Cart** (`/cart`)
- `GET /cart` - Get shopping cart
- `POST /cart/items` - Add item to cart
- `PATCH /cart/items/{itemId}` - Update cart item quantity
- `DELETE /cart/items/{itemId}` - Remove item from cart

#### 7. **Inventory** (`/inventory`)
- `GET /inventory/admin` - List all inventory (admin only)
- `POST /inventory/admin` - Create/update inventory (admin only)
- `GET /inventory/admin/{productId}` - Get product inventory (admin only)
- `PATCH /inventory/admin/{productId}/adjust` - Adjust inventory (admin only)

#### 8. **Checkout** (`/checkout`)
- `POST /checkout` - Process checkout and create order

#### 9. **Orders** (`/orders`)
- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order details
- `PATCH /orders/{id}/cancel` - Cancel pending order
- `GET /orders/admin/all` - List all orders (admin only)
- `GET /orders/admin/{id}` - Get order details (admin only)
- `PATCH /orders/admin/{id}/status` - Update order status (admin only)

#### 10. **Health** (`/health`)
- `GET /health` - API health check
- `GET /check` - Test endpoint

## 🎯 Features

### Request Examples
Every endpoint includes detailed JSON request examples showing:
- Required fields
- Field types and formats
- Example values
- Min/max constraints

### Response Schemas
Complete response schemas with:
- Success and error response structures
- Field definitions and types
- Real-world example responses
- HTTP status codes (200, 201, 400, 401, 403, 404, 429, 500)

### Security
- JWT Bearer token authentication for protected endpoints
- Admin-only endpoints clearly marked
- Rate limiting documentation (OTP endpoint: 5 requests per 10 minutes)

### Schema Definitions
Pre-defined reusable schemas:
- `User` - User profile data
- `Address` - User address information
- `Product` - Product details
- `Category` - Product category
- `CartItem` - Shopping cart item
- `Order` - Order information
- `Error` - Standard error response
- `HealthResponse` - Health check response

## 📦 Files Created/Modified

### Created:
- `src/configs/swagger.js` - Swagger/OpenAPI configuration with all schemas
- `src/routes/health.js` - Health check endpoint with documentation

### Modified:
- `src/app.js` - Added Swagger UI middleware and health route
- `src/routes/check.js` - Added JSDoc documentation
- `src/modules/auth/auth.routes.js` - Complete JSDoc for OTP endpoints
- `src/modules/users/users.routes.js` - JSDoc for user profile endpoint
- `src/modules/addresses/addresses.routes.js` - JSDoc for address endpoints
- `src/modules/catalog/categories/categories.routes.js` - JSDoc for category endpoints
- `src/modules/catalog/products/products.routes.js` - JSDoc for product endpoints
- `src/modules/cart/cart.routes.js` - JSDoc for cart endpoints
- `src/modules/inventory/inventory.routes.js` - JSDoc for inventory endpoints
- `src/modules/checkout/checkout.routes.js` - JSDoc for checkout endpoint
- `src/modules/orders/orders.routes.js` - JSDoc for order endpoints
- `package.json` - Added `swagger-ui-express` and `swagger-jsdoc` dependencies

## 🚀 Usage

### View Swagger UI
1. Ensure your server is running: `npm run dev`
2. Open your browser to: `http://localhost:5000/api/docs`
3. Browse, test, and explore all endpoints

### Try Endpoints
In the Swagger UI:
1. Click on any endpoint to expand details
2. View request/response examples
3. Click "Try it out" to make live API calls
4. For protected endpoints, use the "Authorize" button to add JWT token

### Server Selection
Use the dropdown to switch between:
- Development: `http://localhost:5000`
- Production: `https://api.gaius.com`

## 📝 Example Request/Response

### Request OTP
**Endpoint:** `POST /auth/request-otp`

**Request Body:**
```json
{
  "phone_number": "+2348012345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent",
  "expires_at": "2024-01-15T10:30:00Z",
  "dev_otp": "123456"
}
```

## 🔒 Authentication

Protected endpoints require JWT Bearer token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✨ Next Steps

1. **Test Endpoints** - Use the Swagger UI to test all endpoints
2. **Integrate with Frontend** - Share the Swagger URL with your frontend team
3. **Update Documentation** - As you modify endpoints, update the JSDoc comments
4. **Deploy** - Update the production server URL in `swagger.js` when deploying

---

Happy API documenting! 🎉
