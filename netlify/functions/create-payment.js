// EL CEREBRO SEGURO DEL BACKEND
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // 1. Creamos la "Intención de Pago" (No lo cobramos directamente)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount, // En céntimos (ej: 2500 para 25.00€)
      currency: 'eur',
      // Permite usar tarjeta y soporta la verificación del banco (3D Secure)
      payment_method_types: ['card'], 
    });

    // 2. Le devolvemos el "Secreto" al Frontend para que termine el pago de forma segura
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        clientSecret: paymentIntent.client_secret 
      })
    };

  } catch (error) {
    // 3. Si hay algún error (falta de fondos, etc.), no petamos, avisamos.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};