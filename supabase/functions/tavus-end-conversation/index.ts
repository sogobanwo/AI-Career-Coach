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

    // Handle mock conversations (they don't need to be ended via API)
    if (conversationId.startsWith('mock_')) {
      console.log('Ending mock conversation:', conversationId)
      
      const response = {
        success: true,
        conversation: {
          conversation_id: conversationId,
          status: 'ended',
          ended_at: new Date().toISOString()
        },
        message: 'Mock conversation ended successfully'
      }

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables for real Tavus API calls
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

    console.log('Ending real Tavus conversation:', conversationId)

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
        error: errorText,
        conversationId: conversationId
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

    // Parse Tavus API response with comprehensive error handling
    let tavusData
    try {
      const responseText = await tavusResponse.text()
      console.log('Tavus API response text:', responseText)
      
      // Check if response is empty or just whitespace
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from Tavus API, treating as success')
        tavusData = {
          conversation_id: conversationId,
          status: 'ended',
          ended_at: new Date().toISOString()
        }
      } else {
        // Try to parse as JSON
        tavusData = JSON.parse(responseText)
      }
    } catch (jsonError) {
      console.error('Failed to parse Tavus API response as JSON:', {
        error: jsonError,
        status: tavusResponse.status,
        headers: Object.fromEntries(tavusResponse.headers.entries()),
        conversationId: conversationId
      })
      
      // If JSON parsing fails but the HTTP status was successful,
      // we'll treat it as a successful end operation
      console.log('Treating as successful end operation despite JSON parsing error')
      tavusData = {
        conversation_id: conversationId,
        status: 'ended',
        ended_at: new Date().toISOString()
      }
    }

    // Return success response
    const response = {
      success: true,
      conversation: tavusData,
      message: 'Conversation ended successfully'
    }

    console.log('Successfully ended conversation:', conversationId)

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