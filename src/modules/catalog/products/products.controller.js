import { createProductSchema, updateProductSchema } from "./products.validation.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./products.servce.js";

export async function list(req, res, next) {
  try {
    const { category_id, q } = req.query;
    const products = await listProducts({ category_id, q, only_active: true });
    res.json({ success: true, products });
  } catch (err) { next(err); }
}

export async function detail(req, res, next) {
  try {
    const product = await getProduct(req.params.id, { only_active: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) { next(err); }
}

// Admin endpoints
export async function adminList(req, res, next) {
  try {
    const { category_id, q } = req.query;
    const products = await listProducts({ category_id, q, only_active: false });
    res.json({ success: true, products });
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const payload = createProductSchema.parse(req.body);
    const product = await createProduct(payload);
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const payload = updateProductSchema.parse(req.body);
    const product = await updateProduct(req.params.id, payload);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    const result = await deleteProduct(req.params.id);
    if (!result.deleted) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}
