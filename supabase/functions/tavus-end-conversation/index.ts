const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EndConversationRequest {
  conversationId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { conversationId }: EndConversationRequest = await req.json()

    // Validate required fields
    if (!conversationId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: conversationId is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables
    const tavusApiKey = Deno.env.get('TAVUS_API_KEY')

    if (!tavusApiKey) {
      console.error('Missing TAVUS_API_KEY environment variable')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing Tavus API key' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Make request to Tavus API to end conversation
    const tavusResponse = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/end`,
      {
        method: 'POST',
        headers: {
          'x-api-key': tavusApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    )

    if (!tavusResponse.ok) {
      const errorText = await tavusResponse.text()
      console.error('Tavus API error:', {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        error: errorText
      })
      
      return new Response(
        JSON.stringify({ 
          error: `Tavus API error: ${tavusResponse.status} ${tavusResponse.statusText}`,
          details: 'Unable to end conversation at this time. Please try again later.'
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const tavusData = await tavusResponse.json()

    // Return success response
    const response = {
      success: true,
      conversation: tavusData,
      message: 'Conversation ended successfully'
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while ending the conversation.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})