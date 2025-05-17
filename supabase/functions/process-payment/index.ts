
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
    // Get authenticated user from the request
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      throw new Error("Missing authorization header")
    }

    const { amount, currency = "THB", method, paymentType, relatedId, useEscrow, sellerId } = await req.json()

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

    // Validate sellerId if using escrow
    if (useEscrow && !sellerId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Seller ID is required for escrow transactions",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Here would be the actual payment processing logic
    // For now, we'll simulate success and store the transaction in Supabase
    
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.38.4")
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get user from auth token
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error("Authentication failed")
    }

    // Create transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        amount,
        currency,
        payment_method: method,
        payment_status: "completed", // In a real implementation, this would depend on the payment gateway response
        related_type: paymentType,
        related_id: relatedId,
        receipt_url: `https://example.com/receipts/receipt-${Date.now()}.pdf`, // Example URL
      })
      .select("id")
      .single()
    
    if (transactionError) {
      throw transactionError
    }

    // Create escrow record if needed
    if (useEscrow && transactionData && sellerId) {
      const { error: escrowError } = await supabase
        .from("escrow_transactions")
        .insert({
          payment_id: transactionData.id,
          buyer_id: user.id,
          seller_id: sellerId,
          escrow_status: "initiated",
          contract_details: { item: "Purchase through " + paymentType },
          release_conditions: "Buyer confirmation required",
        })
      
      if (escrowError) {
        throw escrowError
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        paymentId: transactionData?.id,
        receiptUrl: `https://example.com/receipts/receipt-${Date.now()}.pdf`, // Example URL
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error: any) {
    console.error("Payment processing error:", error)
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
