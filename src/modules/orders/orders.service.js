import pool from "../../configs/db.js";

// Customer 

export async function listMyOrders(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      o.id, o.status, o.subtotal, o.delivery_fee, o.total, o.created_at,
      a.label, a.street, a.city, a.region
    FROM orders o
    LEFT JOIN addresses a ON a.id = o.address_id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
    `,
    [userId]
  );
  return rows;
}

export async function getMyOrderDetail(userId, orderId) {
  const orderRes = await pool.query(
    `
    SELECT
      o.id, o.status, o.subtotal, o.delivery_fee, o.total, o.created_at,
      a.label, a.street, a.city, a.region
    FROM orders o
    LEFT JOIN addresses a ON a.id = o.address_id
    WHERE o.id = $1 AND o.user_id = $2
    LIMIT 1
    `,
    [orderId, userId]
  );

  if (!orderRes.rows.length) return null;
  const order = orderRes.rows[0];

  const itemsRes = await pool.query(
    `
    SELECT
      oi.id, oi.product_id, oi.quantity, oi.price,
      (oi.quantity * oi.price) AS line_total,
      p.name, p.image_url, p.unit
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
    ORDER BY p.name ASC
    `,
    [orderId]
  );

  return { order, items: itemsRes.rows };
}


export async function cancelMyOrder(userId, orderId) {
  const { rows } = await pool.query(
    `
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = $1 AND user_id = $2 AND status = 'pending'
    RETURNING id, status
    `,
    [orderId, userId]
  );

  return rows[0] || null;
}

//  Admin 

export async function adminListOrders({ status } = {}) {
  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE o.status = $1`;
  }

  const { rows } = await pool.query(
    `
    SELECT
      o.id, o.status, o.subtotal, o.delivery_fee, o.total, o.created_at,
      u.phone_number,
      a.street, a.city, a.region
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN addresses a ON a.id = o.address_id
    ${where}
    ORDER BY o.created_at DESC
    `,
    values
  );

  return rows;
}

export async function adminGetOrderDetail(orderId) {
  const orderRes = await pool.query(
    `
    SELECT
      o.id, o.status, o.subtotal, o.delivery_fee, o.total, o.created_at,
      u.id AS user_id, u.phone_number,
      a.street, a.city, a.region
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN addresses a ON a.id = o.address_id
    WHERE o.id = $1
    LIMIT 1
    `,
    [orderId]
  );

  if (!orderRes.rows.length) return null;
  const order = orderRes.rows[0];

  const itemsRes = await pool.query(
    `
    SELECT
      oi.id, oi.product_id, oi.quantity, oi.price,
      (oi.quantity * oi.price) AS line_total,
      p.name, p.image_url, p.unit
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
    ORDER BY p.name ASC
    `,
    [orderId]
  );

  return { order, items: itemsRes.rows };
}


function canTransition(current, next) {
  if (current === next) return true;

  const allowed = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  return allowed[current]?.includes(next);
}

export async function adminUpdateOrderStatus(orderId, nextStatus) {

  const currentRes = await pool.query(
    `SELECT id, status FROM orders WHERE id = $1 LIMIT 1`,
    [orderId]
  );
  if (!currentRes.rows.length) return null;

  const current = currentRes.rows[0].status;

  if (!canTransition(current, nextStatus)) {
    const e = new Error(`Invalid status transition: ${current} -> ${nextStatus}`);
    e.status = 409;
    throw e;
  }

  const { rows } = await pool.query(
    `UPDATE orders SET status = $2 WHERE id = $1 RETURNING id, status`,
    [orderId, nextStatus]
  );

  return rows[0];
}
