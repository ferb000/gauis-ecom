import pool from "../../configs/db.js";


export async function getOrCreateActiveCart(userId) {
  const existing = await pool.query(
    `SELECT id, user_id, status, created_at, updated_at
     FROM carts
     WHERE user_id = $1 AND status = 'active'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [userId]
  );

  if (existing.rows.length) return existing.rows[0];

  const created = await pool.query(
    `INSERT INTO carts (id, user_id, status, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id, user_id, status, created_at, updated_at`,
    [userId]
  );

  return created.rows[0];
}

export async function getCartDetails(userId) {
  const cart = await getOrCreateActiveCart(userId);

  const itemsRes = await pool.query(
    `
    SELECT
      ci.id AS cart_item_id,
      ci.product_id,
      ci.quantity,
      ci.price,
      (ci.quantity * ci.price) AS line_total,
      p.name,
      p.description,
      p.image_url,
      p.unit,
      p.is_active
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY p.name ASC
    `,
    [cart.id]
  );

  const subtotal = itemsRes.rows.reduce((sum, r) => sum + Number(r.line_total), 0);

  return { cart, items: itemsRes.rows, subtotal };
}


async function getProductPricingAndStock(productId) {
  const prodRes = await pool.query(
    `SELECT id, name, price, discount_price, is_active
     FROM products
     WHERE id = $1
     LIMIT 1`,
    [productId]
  );

  if (!prodRes.rows.length) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }

  const product = prodRes.rows[0];
  if (!product.is_active) {
    const e = new Error("Product is not available");
    e.status = 409;
    throw e;
  }

  const invRes = await pool.query(
    `SELECT quantity
     FROM product_inventory
     WHERE product_id = $1
     LIMIT 1`,
    [productId]
  );

  
  if (!invRes.rows.length) {
    const e = new Error("Product inventory not set");
    e.status = 409;
    throw e;
  }

  const available = Number(invRes.rows[0].quantity);
  const sellPrice = Number(product.discount_price ?? product.price);

  return { sellPrice, available };
}


export async function addToCart(userId, productId, quantityToAdd) {
  const cart = await getOrCreateActiveCart(userId);

  const { sellPrice, available } = await getProductPricingAndStock(productId);

  // Check current cart quantity for this product
  const existingItemRes = await pool.query(
    `SELECT id, quantity
     FROM cart_items
     WHERE cart_id = $1 AND product_id = $2
     LIMIT 1`,
    [cart.id, productId]
  );

  let newQty = quantityToAdd;

  if (existingItemRes.rows.length) {
    newQty = Number(existingItemRes.rows[0].quantity) + quantityToAdd;
  }

  if (newQty > available) {
    const e = new Error(`Insufficient stock. Available: ${available}`);
    e.status = 409;
    throw e;
  }


  if (existingItemRes.rows.length) {
    const updated = await pool.query(
      `UPDATE cart_items
       SET quantity = $1, price = $2
       WHERE id = $3
       RETURNING id, cart_id, product_id, quantity, price`,
      [newQty, sellPrice, existingItemRes.rows[0].id]
    );

    await pool.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

    return { cart, item: updated.rows[0] };
  } else {
    const inserted = await pool.query(
      `INSERT INTO cart_items (id, cart_id, product_id, quantity, price)
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING id, cart_id, product_id, quantity, price`,
      [cart.id, productId, quantityToAdd, sellPrice]
    );

    await pool.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

    return { cart, item: inserted.rows[0] };
  }
}


export async function updateCartItemQuantity(userId, cartItemId, newQty) {
  const cart = await getOrCreateActiveCart(userId);

  const itemRes = await pool.query(
    `SELECT id, product_id
     FROM cart_items
     WHERE id = $1 AND cart_id = $2
     LIMIT 1`,
    [cartItemId, cart.id]
  );

  if (!itemRes.rows.length) {
    const e = new Error("Cart item not found");
    e.status = 404;
    throw e;
  }

  const productId = itemRes.rows[0].product_id;

  const { sellPrice, available } = await getProductPricingAndStock(productId);

  if (newQty > available) {
    const e = new Error(`Insufficient stock. Available: ${available}`);
    e.status = 409;
    throw e;
  }

  const updated = await pool.query(
    `UPDATE cart_items
     SET quantity = $1, price = $2
     WHERE id = $3
     RETURNING id, cart_id, product_id, quantity, price`,
    [newQty, sellPrice, cartItemId]
  );

  await pool.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

  return updated.rows[0];
}

export async function removeCartItem(userId, cartItemId) {
  const cart = await getOrCreateActiveCart(userId);

  const result = await pool.query(
    `DELETE FROM cart_items
     WHERE id = $1 AND cart_id = $2`,
    [cartItemId, cart.id]
  );

  await pool.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

  return { deleted: result.rowCount > 0 };
}
