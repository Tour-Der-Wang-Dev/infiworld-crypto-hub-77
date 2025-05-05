
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

type PaymentMethod = "card" | "crypto" | "promptpay";
type PaymentType = "marketplace" | "freelance" | "reservation";

interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  paymentType: PaymentType;
  relatedId: string;
  useEscrow?: boolean;
  sellerId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Extract authorization header for user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers: corsHeaders, status: 401 }
      );
    }

    // Create Supabase client with the Service Role Key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify user auth
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: corsHeaders, status: 401 }
      );
    }

    const userId = userData.user.id;
    const requestData: PaymentRequest = await req.json();
    
    // Validate payment data
    if (!requestData.amount || !requestData.method || !requestData.paymentType || !requestData.relatedId) {
      return new Response(
        JSON.stringify({ error: "Missing required payment information" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // If using escrow, seller ID is required
    if (requestData.useEscrow && !requestData.sellerId) {
      return new Response(
        JSON.stringify({ error: "Missing seller ID for escrow payment" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // Process different payment methods
    let paymentResult;
    
    // In a real implementation, we would integrate with payment providers here
    switch (requestData.method) {
      case "card":
        // Simulate card payment processing
        // In production, this is where we would call Stripe API
        paymentResult = { 
          success: true, 
          transactionId: crypto.randomUUID(),
          receiptUrl: `https://infiworld.com/receipts/${Date.now()}`
        };
        break;
      
      case "crypto":
        // Simulate crypto payment processing
        // In production, this is where we would call Coinbase Commerce API
        paymentResult = { 
          success: true, 
          transactionId: crypto.randomUUID() 
        };
        break;
      
      case "promptpay":
        // Simulate PromptPay processing
        // In production, this is where we would call Omise API
        paymentResult = { 
          success: true, 
          transactionId: crypto.randomUUID() 
        };
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: "Unsupported payment method" }),
          { headers: corsHeaders, status: 400 }
        );
    }

    // Create payment record in Supabase
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,
        amount: requestData.amount,
        currency: requestData.currency || "THB",
        payment_method: requestData.method,
        related_type: requestData.paymentType,
        related_id: requestData.relatedId,
        payment_status: "completed",
        receipt_url: paymentResult.receiptUrl,
        payment_details: { 
          provider_transaction_id: paymentResult.transactionId,
          payment_timestamp: new Date().toISOString()
        }
      })
      .select("id")
      .single();
    
    if (paymentError) {
      console.error("Database error:", paymentError);
      return new Response(
        JSON.stringify({ error: "Failed to record payment" }),
        { headers: corsHeaders, status: 500 }
      );
    }

    // Create escrow record if needed
    if (requestData.useEscrow && requestData.sellerId && paymentData?.id) {
      const { error: escrowError } = await supabaseAdmin
        .from("escrow_transactions")
        .insert({
          payment_id: paymentData.id,
          buyer_id: userId,
          seller_id: requestData.sellerId,
          escrow_status: "initiated",
          release_conditions: "ส่งมอบสินค้าหรือบริการเรียบร้อย",
          contract_details: {
            item_id: requestData.relatedId,
            item_type: requestData.paymentType,
            created_at: new Date().toISOString()
          }
        });
      
      if (escrowError) {
        console.error("Escrow record error:", escrowError);
        return new Response(
          JSON.stringify({ error: "Payment successful but escrow record failed" }),
          { headers: corsHeaders, status: 500 }
        );
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        paymentId: paymentData?.id,
        message: "Payment processed successfully",
        receiptUrl: paymentResult.receiptUrl
      }),
      { headers: corsHeaders, status: 200 }
    );
    
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Payment processing failed" }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
