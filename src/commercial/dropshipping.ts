import type { Order, Vendor } from "./types";

export async function sendOrderToVendor(order: Order, vendor: Vendor) {
  // Ici, tu pourrais faire un appel HTTP à l'API du fournisseur
  // Pour l'instant, on simule une réussite
  return { success: true, trackingNumber: "TRACK123456" };
}

export async function getTrackingInfo(trackingNumber: string) {
  // Simule une requête de suivi
  return { status: "shipped", trackingNumber };
} 