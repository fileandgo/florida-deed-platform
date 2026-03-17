// Email abstraction - swap provider without changing callers

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

// Console provider for development
class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    console.log('[EMAIL]', {
      to: message.to,
      subject: message.subject,
      preview: (message.text || message.html).substring(0, 100),
    });
  }
}

// Future: Replace with SendGrid, SES, Resend, etc.
const emailProvider: EmailProvider = new ConsoleEmailProvider();

export async function sendEmail(message: EmailMessage): Promise<void> {
  return emailProvider.send(message);
}

export async function sendOrderSubmittedEmail(to: string, orderNumber: string, documentType: string) {
  return sendEmail({
    to,
    subject: `Order Confirmed - ${orderNumber}`,
    html: `<h2>Your Deed Preparation Order Has Been Submitted</h2>
      <p>Order Number: <strong>${orderNumber}</strong></p>
      <p>Document Type: ${documentType}</p>
      <p>Our team will begin reviewing your order shortly. You can track your order status in your customer portal.</p>
      <p>Thank you for choosing File and Go.</p>`,
    text: `Order ${orderNumber} confirmed. Document: ${documentType}. Track status in your customer portal.`,
  });
}

export async function sendPaymentReceivedEmail(to: string, orderNumber: string, amount: string) {
  return sendEmail({
    to,
    subject: `Payment Received - ${orderNumber}`,
    html: `<h2>Payment Received</h2>
      <p>We've received your payment of <strong>${amount}</strong> for order <strong>${orderNumber}</strong>.</p>
      <p>Your order is now being processed by our team.</p>`,
  });
}

export async function sendActionRequiredEmail(to: string, orderNumber: string, message: string) {
  return sendEmail({
    to,
    subject: `Action Required - ${orderNumber}`,
    html: `<h2>Action Required for Your Order</h2>
      <p>Order Number: <strong>${orderNumber}</strong></p>
      <p>${message}</p>
      <p>Please log in to your customer portal to take action.</p>`,
  });
}

export async function sendStatusUpdatedEmail(to: string, orderNumber: string, newStatus: string) {
  return sendEmail({
    to,
    subject: `Order Update - ${orderNumber}`,
    html: `<h2>Your Order Has Been Updated</h2>
      <p>Order Number: <strong>${orderNumber}</strong></p>
      <p>New Status: <strong>${newStatus}</strong></p>
      <p>Log in to your customer portal for details.</p>`,
  });
}
