import {
  createAddressSchema,
  updateAddressSchema,
} from "./addresses.validation.js";

import {
  listAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "./addresses.service.js";

export async function list(req, res, next) {
  try {
    const rows = await listAddresses(req.user.id);
    res.json({ success: true, addresses: rows });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const payload = createAddressSchema.parse(req.body);
    const row = await createAddress(req.user.id, payload);
    res.status(201).json({ success: true, address: row });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const payload = updateAddressSchema.parse(req.body);
    const row = await updateAddress(req.user.id, req.params.id, payload);
    if (!row) return res.status(404).json({ success: false, message: "Address not found" });
    res.json({ success: true, address: row });
  } catch (err) {
    next(err);
  }
}

export async function makeDefault(req, res, next) {
  try {
    const row = await setDefaultAddress(req.user.id, req.params.id);
    res.json({ success: true, address: row });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await deleteAddress(req.user.id, req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
