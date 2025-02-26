export const PAYSTACK_CONFIG = {
  publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  currency: "GHS",
  channels: ["card", "bank", "mobile_money"],
  validatePayment: true,
}; 