import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY ?? "";

export const stripe = new Stripe(apiKey, {
  apiVersion: "2023-10-16",
  typescript: true,
});
