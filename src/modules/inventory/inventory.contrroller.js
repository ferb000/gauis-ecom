import { upsertInventorySchema, adjustStockSchema } from "./inventory.validation.js";
import { upsertInventory, adjustStock, getInventory, listInventory } from "./inventory.service.js";

export async function upsert(req, res, next) {
  try {
    const payload = upsertInventorySchema.parse(req.body);
    const row = await upsertInventory(payload);


    res.status(201).json({ success: true, inventory: row });
  } catch (err) {
    next(err);
  }
}

export async function adjust(req, res, next) {
  try {
    const payload = adjustStockSchema.parse(req.body);
    const row = await adjustStock(req.params.productId, payload.delta);

    res.json({ success: true, inventory: row });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const row = await getInventory(req.params.productId);
    if (!row) return res.status(404).json({ success: false, message: "Inventory not found" });
    res.json({ success: true, inventory: row });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const { q } = req.query;
    const rows = await listInventory({ q });
    res.json({ success: true, inventory: rows });
  } catch (err) {
    next(err);
  }
}
