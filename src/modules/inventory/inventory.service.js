import pool from "../../configs/db.js";

/**
 * Create inventory row if missing, or overwrite quantity (admin tool).
 * Real-world: use this for initial setup or manual corrections.
 */
export async function upsertInventory(payload) {
  const { rows } = await pool.query(
    `
    INSERT INTO product_inventory (id, product_id, quantity, low_stock_alert, updated_at)
    VALUES (gen_random_uuid(), $1, $2, COALESCE($3, 5), CURRENT_TIMESTAMP)
    ON CONFLICT (product_id)
    DO UPDATE SET
      quantity = EXCLUDED.quantity,
      low_stock_alert = COALESCE(EXCLUDED.low_stock_alert, product_inventory.low_stock_alert),
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, product_id, quantity, low_stock_alert, updated_at
    `,
    [payload.product_id, payload.quantity, payload.low_stock_alert ?? null]
  );

  return rows[0];
}

/**
 * Adjust stock incrementally and safely.
 * Uses SELECT ... FOR UPDATE to lock the inventory row.
 * Prevents negative quantities.
 */
export async function adjustStock(productId, delta) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock inventory row (prevents race conditions)
    const invRes = await client.query(
      `SELECT id, product_id, quantity, low_stock_alert
       FROM product_inventory
       WHERE product_id = $1
       FOR UPDATE`,
      [productId]
    );

    if (invRes.rows.length === 0) {
      const e = new Error("Inventory record not found for product. Create it first.");
      e.status = 404;
      throw e;
    }

    const inv = invRes.rows[0];
    const newQty = inv.quantity + delta;

    if (newQty < 0) {
      const e = new Error("Insufficient stock. Operation would make stock negative.");
      e.status = 409;
      throw e;
    }

    const { rows } = await client.query(
      `UPDATE product_inventory
       SET quantity = $2, updated_at = CURRENT_TIMESTAMP
       WHERE product_id = $1
       RETURNING id, product_id, quantity, low_stock_alert, updated_at`,
      [productId, newQty]
    );

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getInventory(productId) {
  const { rows } = await pool.query(
    `SELECT pi.id, pi.product_id, pi.quantity, pi.low_stock_alert, pi.updated_at,
            p.name AS product_name
     FROM product_inventory pi
     JOIN products p ON p.id = pi.product_id
     WHERE pi.product_id = $1
     LIMIT 1`,
    [productId]
  );
  return rows[0] || null;
}

export async function listInventory({ q } = {}) {
  const values = [];
  let where = "";

  if (q) {
    values.push(`%${q}%`);
    where = `WHERE p.name ILIKE $1`;
  }

  const { rows } = await pool.query(
    `
    SELECT pi.id, pi.product_id, p.name AS product_name,
           pi.quantity, pi.low_stock_alert, pi.updated_at
    FROM product_inventory pi
    JOIN products p ON p.id = pi.product_id
    ${where}
    ORDER BY p.name ASC
    `,
    values
  );

  return rows;
}
