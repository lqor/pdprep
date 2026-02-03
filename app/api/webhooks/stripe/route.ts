import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing Stripe signature or webhook secret", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case "checkout.session.completed":
        // TODO: Create/update subscription in database
        break;
      case "customer.subscription.updated":
        // TODO: Update subscription status
        break;
      case "customer.subscription.deleted":
        // TODO: Mark subscription as canceled
        break;
      case "invoice.payment_failed":
        // TODO: Send payment failed email, update status
        break;
      default:
        break;
    }
  }

  return new Response("OK", { status: 200 });
}

export const runtime = "nodejs";
