import type { Vendor } from "./types";

let vendors: Vendor[] = [];

export function createVendor(vendor: Vendor) {
  vendors.push(vendor);
  return vendor;
}

export function getVendorById(id: string) {
  return vendors.find((v) => v.id === id) || null;
}

export function listVendors() {
  return vendors;
}

export function updateVendor(id: string, updates: Partial<Vendor>) {
  const vendor = getVendorById(id);
  if (!vendor) return null;
  Object.assign(vendor, updates);
  return vendor;
}

export function deleteVendor(id: string) {
  vendors = vendors.filter((v) => v.id !== id);
} 