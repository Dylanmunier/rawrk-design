import type { Order } from "./types";

let orders: Order[] = [];

export function createOrder(order: Order) {
  orders.push(order);
  return order;
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id) || null;
}

export function listOrders() {
  return orders;
}

export function updateOrder(id: string, updates: Partial<Order>) {
  const order = getOrderById(id);
  if (!order) return null;
  Object.assign(order, updates);
  return order;
}

export function deleteOrder(id: string) {
  orders = orders.filter((o) => o.id !== id);
} 