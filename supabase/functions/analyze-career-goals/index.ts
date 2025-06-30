import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CareerGoalsRequest {
  careerGoals: string;
  experienceLevel: string;
  challenges: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
}

serve(async (req) => {
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
    const { careerGoals, experienceLevel, challenges }: CareerGoalsRequest = await req.json()

    // Validate required fields
    if (!careerGoals || !experienceLevel) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: careerGoals and experienceLevel are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables
    const picaSecretKey = Deno.env.get('PICA_SECRET_KEY')
    const picaGeminiConnectionKey = Deno.env.get('PICA_GEMINI_CONNECTION_KEY')

    if (!picaSecretKey || !picaGeminiConnectionKey) {
      console.error('Missing environment variables:', { 
        hasSecretKey: !!picaSecretKey, 
        hasConnectionKey: !!picaGeminiConnectionKey 
      })
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing API credentials' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Construct the prompt for Gemini
    const prompt = `You are a professional career coach AI with expertise in career development, job market trends, and professional growth strategies. Analyze the following user's career information and provide comprehensive, actionable advice.

User Information:
- Career Goals: ${careerGoals}
- Experience Level: ${experienceLevel}
- Challenges: ${challenges || 'Not specified'}

Please provide a detailed response that includes:

1. **Assessment**: A brief analysis of their current situation and goals
2. **Specific Recommendations**: At least 4-5 concrete, actionable steps they can take
3. **Skill Development**: Specific skills they should focus on developing
4. **Timeline**: Suggested timeframe for achieving their goals
5. **Resources**: Specific resources, certifications, or learning paths they should consider
6. **Market Insights**: Relevant industry trends and opportunities
7. **Next Steps**: Immediate actions they can take this week

Keep the tone professional yet encouraging, and make sure all advice is practical and achievable. Focus on their specific experience level and tailor recommendations accordingly.`

    // Prepare request to Gemini API
    const geminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }

    // Make request to Gemini API via Pica
    const geminiResponse = await fetch(
      'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pica-secret': picaSecretKey,
          'x-pica-connection-key': picaGeminiConnectionKey,
          'x-pica-action-id': 'conn_mod_def::GCmd5BQE388::PISTzTbvRSqXx0N0rMa-Lw'
        },
        body: JSON.stringify(geminiRequestBody)
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        error: errorText
      })
      
      return new Response(
        JSON.stringify({ 
          error: `AI service error: ${geminiResponse.status} ${geminiResponse.statusText}`,
          details: 'Unable to generate career advice at this time. Please try again later.'
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const geminiData: GeminiResponse = await geminiResponse.json()

    // Extract the AI response
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('No candidates in Gemini response:', geminiData)
      return new Response(
        JSON.stringify({ 
          error: 'No advice generated',
          details: 'The AI was unable to generate career advice. Please try rephrasing your goals.'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const aiAdvice = geminiData.candidates[0].content.parts[0].text

    // Parse and structure the response
    const response = {
      success: true,
      advice: aiAdvice,
      metadata: {
        model: geminiData.modelVersion || 'gemini-1.5-flash',
        tokenUsage: geminiData.usageMetadata,
        timestamp: new Date().toISOString(),
        userInput: {
          careerGoals,
          experienceLevel,
          challenges: challenges || null
        }
      }
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
        details: 'An unexpected error occurred while processing your request.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})