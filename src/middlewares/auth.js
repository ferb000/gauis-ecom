import jwt from "jsonwebtoken";
import db from "../configs/db.js";

export function authRequired() {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const [type, token] = header.split(" ");

      if (type !== "Bearer" || !token) {
        return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }

      
      const { rows } = await db.query(
        "SELECT id, phone_number, email, full_name, role, is_verified FROM users WHERE id = $1 LIMIT 1",
        [payload.userId]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = rows[0]; 
      next();
    } catch (err) {
      next(err);
    }
  };
}


export function adminOnly() {
  return (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
  };
}
