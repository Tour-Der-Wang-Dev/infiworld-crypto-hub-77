
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

// Define corsHeaders with environment variable for origin restriction
const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_DOMAIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Handle OPTIONS requests for CORS preflight
const handleOptionsRequest = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// Process the payment
const processPayment = async (req: Request) => {
  try {
    const { amount, currency, method, paymentType, relatedId, useEscrow, sellerId } = await req.json()

    // Validate required fields
    if (!amount || !method || !paymentType || !relatedId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Here would be the actual payment processing logic
    // For now, we'll simulate success

    // Create response with payment ID to simulate successful payment
    const paymentId = `pay_${Date.now()}`
    
    return new Response(
      JSON.stringify({
        success: true,
        paymentId,
        receiptUrl: `https://example.com/receipts/${paymentId}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
}

// Request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleOptionsRequest()
  }

  // Process payment requests
  if (req.method === "POST") {
    return processPayment(req)
  }

  // Return 405 for unsupported methods
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
  )
})
