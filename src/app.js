import "dotenv/config";
import express from "express";
import cors from "cors";




import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import addressesRoutes from "./modules/addresses/addresses.routes.js";
import categoriesRoutes from "./modules/catalog/categories/categories.routes.js";
import productsRoutes from "./modules/catalog/products/products.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import checkoutRoutes from "./modules/checkout/checkout.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js";






const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/addresses", addressesRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productsRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", ordersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;


