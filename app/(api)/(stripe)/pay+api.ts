import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { payment_method_id, payment_intent_id, customer_id } = body;

    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required payment information",
          status: 400,
          // eslint-disable-next-line prettier/prettier
        })
      );
    }

    const paymentMethod = stripe.paymentMethods.attach(payment_method_id, {
      customer: customer_id,
    });

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: (await paymentMethod).id,
    });

    return new Response(
      JSON.stringify({
        success: "true",
        message: "Payment confirmed Successfully",
        result: result,
        // eslint-disable-next-line prettier/prettier
      })
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error,
        status: 500,
        // eslint-disable-next-line prettier/prettier
      })
    );
  }
}
