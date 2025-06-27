export async function sendOrderConfirmationEmail(to: string, orderId: string) {
  // Ici, tu brancheras un vrai service d'email (SendGrid, Mailjet, etc.)
  return { success: true };
}

export async function sendShippingNotificationEmail(to: string, trackingNumber: string) {
  return { success: true };
} 