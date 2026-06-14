import pool from "../../../configs/db.js";

export async function listProducts({ category_id, q, only_active = true }) {
  const filters = [];
  const values = [];
  let i = 1;

  if (only_active) {
    filters.push(`p.is_active = TRUE`);
  }
  if (category_id) {
    filters.push(`p.category_id = $${i++}`);
    values.push(category_id);
  }
  if (q) {
    filters.push(`(p.name ILIKE $${i} OR p.description ILIKE $${i})`);
    values.push(`%${q}%`);
    i++;
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `
    SELECT
      p.id, p.category_id, p.name, p.description,
      p.price, p.discount_price, p.unit, p.image_url, p.is_active,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${where}
    ORDER BY p.name ASC
    `,
    values
  );

  return rows;
}

export async function getProduct(productId, { only_active = true } = {}) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id, p.category_id, p.name, p.description,
      p.price, p.discount_price, p.unit, p.image_url, p.is_active,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = $1 ${only_active ? "AND p.is_active = TRUE" : ""}
    LIMIT 1
    `,
    [productId]
  );
  return rows[0] || null;
}

export async function createProduct(payload) {
  const { rows } = await pool.query(
    `INSERT INTO products
      (id, category_id, name, description, price, discount_price, unit, image_url, is_active)
     VALUES
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, category_id, name, description, price, discount_price, unit, image_url, is_active`,
    [
      payload.category_id,
      payload.name,
      payload.description ?? null,
      payload.price,
      payload.discount_price ?? null,
      payload.unit ?? null,
      payload.image_url ?? null,
      payload.is_active ?? true,
    ]
  );
  return rows[0];
}

export async function updateProduct(productId, payload) {
  const { rows } = await pool.query(
    `UPDATE products
     SET
       category_id = COALESCE($2, category_id),
       name = COALESCE($3, name),
       description = COALESCE($4, description),
       price = COALESCE($5, price),
       discount_price = COALESCE($6, discount_price),
       unit = COALESCE($7, unit),
       image_url = COALESCE($8, image_url),
       is_active = COALESCE($9, is_active)
     WHERE id = $1
     RETURNING id, category_id, name, description, price, discount_price, unit, image_url, is_active`,
    [
      productId,
      payload.category_id ?? null,
      payload.name ?? null,
      payload.description ?? null,
      payload.price ?? null,
      payload.discount_price ?? null,
      payload.unit ?? null,
      payload.image_url ?? null,
      payload.is_active ?? null,
    ]
  );
  return rows[0] || null;
}

export async function deleteProduct(productId) {
  const result = await pool.query(`DELETE FROM products WHERE id = $1`, [productId]);
  return { deleted: result.rowCount > 0 };
}
