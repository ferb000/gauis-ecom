import pool from "../../configs/db.js";

function computeDeliveryFee({ city, region }) {
  
  return 10.00;
}

export async function checkout(userId, addressId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    const addrRes = await client.query(
      `SELECT id, city, region
       FROM addresses
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [addressId, userId]
    );
    if (!addrRes.rows.length) {
      const e = new Error("Address not found");
      e.status = 404;
      throw e;
    }
    const address = addrRes.rows[0];

    
    const cartRes = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1 AND status = 'active'
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId]
    );
    if (!cartRes.rows.length) {
      const e = new Error("No active cart found");
      e.status = 409;
      throw e;
    }
    const cartId = cartRes.rows[0].id;

    
    const alreadyOrdered = await client.query(
      `SELECT id FROM orders WHERE cart_id = $1 LIMIT 1`,
      [cartId]
    );
    if (alreadyOrdered.rows.length) {
      const e = new Error("This cart has already been checked out");
      e.status = 409;
      throw e;
    }

    
    const itemsRes = await client.query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        ci.price,
        p.is_active,
        p.name
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      `,
      [cartId]
    );

    if (!itemsRes.rows.length) {
      const e = new Error("Cart is empty");
      e.status = 409;
      throw e;
    }

    // Ensure all products are active
    for (const it of itemsRes.rows) {
      if (!it.is_active) {
        const e = new Error(`Product not available: ${it.name}`);
        e.status = 409;
        throw e;
      }
    }

    
    const productIds = [...new Set(itemsRes.rows.map(r => r.product_id))].sort();

    const invRes = await client.query(
      `
      SELECT product_id, quantity
      FROM product_inventory
      WHERE product_id = ANY($1::uuid[])
      FOR UPDATE
      `,
      [productIds]
    );

    const invMap = new Map(invRes.rows.map(r => [r.product_id, Number(r.quantity)]));

  
    for (const pid of productIds) {
      if (!invMap.has(pid)) {
        const e = new Error("Inventory not set for one or more products");
        e.status = 409;
        throw e;
      }
    }

    for (const it of itemsRes.rows) {
      const available = invMap.get(it.product_id);
      if (Number(it.quantity) > available) {
        const e = new Error(`Insufficient stock for ${it.name}. Available: ${available}`);
        e.status = 409;
        throw e;
      }
    }

    
    const subtotal = itemsRes.rows.reduce(
      (sum, it) => sum + Number(it.quantity) * Number(it.price),
      0
    );

    const deliveryFee = computeDeliveryFee(address);
    const total = Number((subtotal + deliveryFee).toFixed(2));

    const orderRes = await client.query(
      `
      INSERT INTO orders
        (id, user_id, address_id, cart_id, status, subtotal, delivery_fee, total, created_at)
      VALUES
        (gen_random_uuid(), $1, $2, $3, 'pending', $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING id, user_id, address_id, cart_id, status, subtotal, delivery_fee, total, created_at
      `,
      [userId, addressId, cartId, subtotal, deliveryFee, total]
    );
    const order = orderRes.rows[0];

    for (const it of itemsRes.rows) {
      await client.query(
        `
        INSERT INTO order_items (id, order_id, product_id, quantity, price)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        `,
        [order.id, it.product_id, it.quantity, it.price]
      );
    }

  
    for (const it of itemsRes.rows) {
      await client.query(
        `
        UPDATE product_inventory
        SET quantity = quantity - $2, updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $1
        `,
        [it.product_id, it.quantity]
      );
    }

    
    await client.query(
      `UPDATE carts
       SET status = 'ordered', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [cartId]
    );

    await client.query("COMMIT");

    return { order };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
