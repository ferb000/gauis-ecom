import pool from "../../configs/db.js";


// Helper: ensures only ONE default address per user.

async function clearDefaultForUser(client, userId) {
  await client.query(
    `UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default = TRUE`,
    [userId]
  );
}

export async function listAddresses(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, label, street, city, region, is_default
     FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, id DESC`,
    [userId]
  );
  return rows;
}

export async function createAddress(userId, payload) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // make it default automatically
    const existing = await client.query(
      `SELECT COUNT(*)::int AS count FROM addresses WHERE user_id = $1`,
      [userId]
    );
    const hasAny = existing.rows[0].count > 0;

    const wantsDefault = payload.is_default === true;
    const makeDefault = wantsDefault || !hasAny;

    if (makeDefault) {
      await clearDefaultForUser(client, userId);
    }

    const { rows } = await client.query(
      `INSERT INTO addresses (id, user_id, label, street, city, region, is_default)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, label, street, city, region, is_default`,
      [
        userId,
        payload.label ?? null,
        payload.street,
        payload.city,
        payload.region ?? null,
        makeDefault,
      ]
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

export async function updateAddress(userId, addressId, payload) {
  const { rows } = await pool.query(
    `UPDATE addresses
     SET
       label = COALESCE($3, label),
       street = COALESCE($4, street),
       city = COALESCE($5, city),
       region = COALESCE($6, region)
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, label, street, city, region, is_default`,
    [
      addressId,
      userId,
      payload.label ?? null,
      payload.street ?? null,
      payload.city ?? null,
      payload.region ?? null,
    ]
  );

  return rows[0] || null;
}

export async function setDefaultAddress(userId, addressId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Ensure address belongs to user
    const check = await client.query(
      `SELECT id FROM addresses WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [addressId, userId]
    );
    if (check.rows.length === 0) {
      const e = new Error("Address not found");
      e.status = 404;
      throw e;
    }

    await clearDefaultForUser(client, userId);

    const { rows } = await client.query(
      `UPDATE addresses
       SET is_default = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, label, street, city, region, is_default`,
      [addressId, userId]
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

export async function deleteAddress(userId, addressId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if address is default
    const { rows: found } = await client.query(
      `SELECT id, is_default FROM addresses WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    if (found.length === 0) {
      const e = new Error("Address not found");
      e.status = 404;
      throw e;
    }

    const wasDefault = found[0].is_default === true;

    await client.query(
      `DELETE FROM addresses WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    // If deleted address was default, promote another address to default 
    if (wasDefault) {
      const remaining = await client.query(
        `SELECT id FROM addresses WHERE user_id = $1 ORDER BY id DESC LIMIT 1`,
        [userId]
      );

      if (remaining.rows.length > 0) {
        await clearDefaultForUser(client, userId);
        await client.query(
          `UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2`,
          [remaining.rows[0].id, userId]
        );
      }
    }

    await client.query("COMMIT");
    return { deleted: true, wasDefault };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
