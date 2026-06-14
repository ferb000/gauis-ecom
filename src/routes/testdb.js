import db from "../configs/db.js";


(async () => {
  try {
    const r = await db.query("SELECT current_database() AS db, NOW() AS now");
    console.log("🟢 Connected to:", r.rows[0]);
    
  } catch (err) {
    console.error("🔴 DB connection failed:", err.message);
    process.exit(1);
  }
})();
