import type { Customer } from "./types";

let customers: Customer[] = [];

export function createCustomer(customer: Customer) {
  customers.push(customer);
  return customer;
}

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id) || null;
}

export function listCustomers() {
  return customers;
}

export function updateCustomer(id: string, updates: Partial<Customer>) {
  const customer = getCustomerById(id);
  if (!customer) return null;
  Object.assign(customer, updates);
  return customer;
}

export function deleteCustomer(id: string) {
  customers = customers.filter((c) => c.id !== id);
} 