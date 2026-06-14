import { createCategorySchema, updateCategorySchema } from "./categories.validation.js";
import { listCategories, createCategory, updateCategory, deleteCategory } from "./categories.service.js";

export async function list(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, categories });
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const payload = createCategorySchema.parse(req.body);
    const category = await createCategory(payload);
    res.status(201).json({ success: true, category });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const payload = updateCategorySchema.parse(req.body);
    const category = await updateCategory(req.params.id, payload);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    const result = await deleteCategory(req.params.id);
    if (!result.deleted) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}
