// import { db } from "@/server";
// import { orders } from "@/server/schema";
// import { eq } from "drizzle-orm";
// import { type NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// export async function POST(req: NextRequest) {
//   const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
//     apiVersion: "2024-06-20",
//   });
//   const sig = req.headers.get("stripe-signature") || "";
//   const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

//   // Read the request body as text
//   const reqText = await req.text();
//   // Convert the text to a buffer
//   const reqBuffer = Buffer.from(reqText);

//   let event;

//   try {
//     // Construct the Stripe webhook event from the request
//     event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
//   } catch (err: any) {
//     // Return a 400 error response for webhook errors
//     return new NextResponse(`Webhook Error: ${err.message}`, {
//       status: 400,
//     });
//   }

//   // Handle the Stripe webhook event
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       try {
//         // Retrieve detailed information about the payment intent from Stripe
//         const retrieveOrder = await stripe.paymentIntents.retrieve(
//           event.data.object.id,
//           { expand: ["latest_charge"] }
//         );
//         const charge = retrieveOrder.latest_charge as Stripe.Charge;

//         // Update the database with the 'succeeded' status and receipt URL
//         await db
//           .update(orders)
//           .set({
//             status: "succeeded",
//             receiptURL: charge.receipt_url,
//           })
//           .where(eq(orders.paymentIntentID, event.data.object.id))
//           .returning();

//         // Log the receipt URL and charge details for debugging
//         console.log("Receipt URL:", charge.receipt_url);
//         console.log("Charge Details:", charge);

//         // Return a 200 response to Stripe acknowledging receipt of the webhook event
//         return new Response("Payment Intent Processed", { status: 200 });
//       } catch (error) {
//         // Handle database update errors
//         console.error("Database Update Error:", error);
//         return new NextResponse("Internal Server Error", { status: 500 });
//       }

//     default:
//       // Log the event type for other webhook events
//       console.log("Unhandled Event Type:", event.type);
//       // Return a 200 response for other types of events (not recommended to use 300)
//       return new Response("Unhandled Event", { status: 300 });
//   }
// }

import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-06-20",
  });
  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Read the request body as text
  const reqText = await req.text();
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // Handle the event just an example!
  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;

      await db
        .update(orders)
        .set({
          status: "succeeded",
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentID, event.data.object.id))
        .returning();
      console.log(charge.receipt_url);
      console.log(charge);

      // Then define and call a function to handle the event product.created
      break;

    default:
      console.log(`${event.type}`);
  }

  return new Response("ok", { status: 200 });
}
