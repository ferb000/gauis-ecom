import pool from "../../../configs/db.js"

export async function listCategories() {
  const { rows } = await pool.query(
    `SELECT id, name, description, image_url
     FROM categories
     ORDER BY name ASC`
  );
  return rows;
}

export async function createCategory(payload) {
  const { rows } = await pool.query(
    `INSERT INTO categories (id, name, description, image_url)
     VALUES (gen_random_uuid(), $1, $2, $3)
     RETURNING id, name, description, image_url`,
    [payload.name, payload.description ?? null, payload.image_url ?? null]
  );
  return rows[0];
}

export async function updateCategory(categoryId, payload) {
  const { rows } = await pool.query(
    `UPDATE categories
     SET
       name = COALESCE($2, name),
       description = COALESCE($3, description),
       image_url = COALESCE($4, image_url)
     WHERE id = $1
     RETURNING id, name, description, image_url`,
    [categoryId, payload.name ?? null, payload.description ?? null, payload.image_url ?? null]
  );
  return rows[0] || null;
}

export async function deleteCategory(categoryId) {
  // block delete if products exist in categor
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1`,
    [categoryId]
  );

  if (countRows[0].count > 0) {
    const e = new Error("Cannot delete category with products. Move products first.");
    e.status = 409;
    throw e;
  }

  const result = await pool.query(`DELETE FROM categories WHERE id = $1`, [categoryId]);
  return { deleted: result.rowCount > 0 };
}
