import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Simple response logic - in production, this would connect to an AI model
    const responses = {
      maintenance: "I can help you submit a maintenance request. Would you like to report an issue?",
      parking: "I can check parking space availability and help you reserve a spot. What would you like to know?",
      facilities: "I can show you available community facilities and help you make a booking. What are you interested in?",
      default: "I'm here to help with community resources, maintenance requests, and facility bookings. How can I assist you today?"
    };

    let response = responses.default;
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('maintenance') || lowercaseMessage.includes('repair')) {
      response = responses.maintenance;
    } else if (lowercaseMessage.includes('parking') || lowercaseMessage.includes('car')) {
      response = responses.parking;
    } else if (lowercaseMessage.includes('facility') || lowercaseMessage.includes('book')) {
      response = responses.facilities;
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});