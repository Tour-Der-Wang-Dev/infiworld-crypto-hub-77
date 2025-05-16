
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const frontendDomain = Deno.env.get('FRONTEND_DOMAIN') ?? '*';

// Use environment variable for CORS domain with fallback to wildcard
const corsHeaders = {
  'Access-Control-Allow-Origin': frontendDomain,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

interface PaymentRequest {
  amount: number;
  currency: string;
  method: 'card' | 'crypto' | 'promptpay';
  paymentType: string;
  relatedId: string;
  useEscrow?: boolean;
  sellerId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get the payment details from the request
    const paymentData: PaymentRequest = await req.json();
    
    // Validate request body
    if (!paymentData.amount || !paymentData.method || !paymentData.paymentType || !paymentData.relatedId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required payment information' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate escrow usage
    if (paymentData.useEscrow && !paymentData.sellerId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Seller ID is required for escrow payments'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    // Get the user from the auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing authorization header' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }
    
    // Process the payment (this is a simulation)
    console.log('Processing payment:', paymentData);
    
    // In a real implementation, you would call a payment gateway API here
    // For simulation, we'll just create a transaction record
    
    // Simulate successful payment
    const paymentId = `payment_${Date.now()}`;
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        paymentId: paymentId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
        receiptUrl: `https://example.com/receipts/${paymentId}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
