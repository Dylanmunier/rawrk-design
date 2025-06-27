import type { Product } from "./types";

let products: Product[] = [];

export function createProduct(product: Product) {
  products.push(product);
  return product;
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id) || null;
}

export function listProducts() {
  return products;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const product = getProductById(id);
  if (!product) return null;
  Object.assign(product, updates);
  return product;
}

export function deleteProduct(id: string) {
  products = products.filter((p) => p.id !== id);
} 