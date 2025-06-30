import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConversationRequest {
  jobRole: string;
  candidateName?: string;
  customContext?: string;
}

interface TavusConversationRequest {
  replica_id?: string;
  persona_id?: string;
  audio_only?: boolean;
  callback_url?: string;
  conversation_name?: string;
  conversational_context?: string;
  custom_greeting?: string;
  properties?: {
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    max_call_duration?: number;
    language?: string;
  };
}

interface TavusConversationResponse {
  conversation_id: string;
  conversation_name: string;
  status: 'active' | 'ended';
  conversation_url: string;
  replica_id: string;
  persona_id: string;
  created_at: string;
}

// Mock conversation generator for when Tavus API is unavailable
function generateMockConversation(jobRole: string, candidateName?: string): any {
  const conversationId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const name = candidateName || 'Candidate';
  
  return {
    success: true,
    conversation: {
      conversation_id: conversationId,
      conversation_name: `${jobRole} Interview with ${name}`,
      status: 'active',
      conversation_url: null, // Set to null to indicate mock mode
      replica_id: 'mock_replica_id',
      persona_id: 'mock_persona_id',
      created_at: new Date().toISOString()
    },
    isMockMode: true
  };
}

function generateInterviewContext(jobRole: string, candidateName?: string, customContext?: string): string {
  const roleContexts: { [key: string]: string } = {
    'Software Engineer': `You are conducting a technical interview for a Software Engineer position. Focus on coding skills, problem-solving abilities, system design, and technical experience. Ask about programming languages, frameworks, debugging approaches, and past projects. Be encouraging but thorough in your assessment.`,
    
    'Product Manager': `You are interviewing for a Product Manager role. Focus on product strategy, user experience, data analysis, stakeholder management, and leadership skills. Ask about product launches, metrics, user research, and cross-functional collaboration.`,
    
    'Data Scientist': `You are conducting an interview for a Data Scientist position. Focus on statistical knowledge, machine learning, data analysis, programming skills (Python/R), and business impact. Ask about past projects, model building, data visualization, and statistical methods.`,
    
    'UX Designer': `You are interviewing for a UX Designer role. Focus on design thinking, user research, prototyping, usability testing, and design tools. Ask about design process, user empathy, problem-solving, and portfolio projects.`,
    
    'Marketing Manager': `You are conducting an interview for a Marketing Manager position. Focus on campaign strategy, digital marketing, analytics, brand management, and customer acquisition. Ask about successful campaigns, ROI measurement, and market analysis.`,
    
    'Sales Representative': `You are interviewing for a Sales Representative role. Focus on sales techniques, customer relationship building, negotiation skills, and target achievement. Ask about sales processes, objection handling, and customer success stories.`,
    
    'Business Analyst': `You are conducting an interview for a Business Analyst position. Focus on analytical skills, requirements gathering, process improvement, and stakeholder communication. Ask about data analysis, business process mapping, and project management.`,
    
    'DevOps Engineer': `You are interviewing for a DevOps Engineer role. Focus on infrastructure, automation, CI/CD, cloud platforms, and monitoring. Ask about deployment strategies, infrastructure as code, troubleshooting, and scalability.`
  };

  const baseContext = roleContexts[jobRole] || `You are conducting a professional interview for a ${jobRole} position. Ask relevant questions about their experience, skills, and qualifications for this role.`;
  
  const candidateContext = candidateName 
    ? ` The candidate's name is ${candidateName}.` 
    : ' The candidate is joining the interview.';
  
  const additionalContext = customContext ? ` Additional context: ${customContext}` : '';
  
  return baseContext + candidateContext + additionalContext + ` Conduct a thorough but friendly interview, asking follow-up questions based on their responses. Provide constructive feedback and maintain a professional, encouraging tone throughout the conversation. The interview should last approximately 15-30 minutes.`;
}

function generateCustomGreeting(jobRole: string, candidateName?: string): string {
  const name = candidateName || 'there';
  
  const greetings: { [key: string]: string } = {
    'Software Engineer': `Hello ${name}! Welcome to your technical interview for the Software Engineer position. I'm excited to learn about your coding experience and problem-solving approach. Are you ready to get started?`,
    
    'Product Manager': `Hi ${name}! Thanks for joining me today for the Product Manager interview. I'm looking forward to discussing your product strategy experience and how you approach building great products. Shall we begin?`,
    
    'Data Scientist': `Hello ${name}! Welcome to your Data Scientist interview. I'm eager to hear about your experience with data analysis, machine learning, and how you turn data into actionable insights. Let's dive in!`,
    
    'UX Designer': `Hi ${name}! Great to meet you for the UX Designer interview. I'm excited to learn about your design process, user research experience, and how you create meaningful user experiences. Ready to start?`,
    
    'Marketing Manager': `Hello ${name}! Welcome to your Marketing Manager interview. I'm looking forward to discussing your marketing strategies, campaign successes, and how you drive customer engagement. Let's begin!`,
    
    'Sales Representative': `Hi ${name}! Thanks for joining the Sales Representative interview. I'm excited to hear about your sales experience, relationship-building skills, and how you achieve your targets. Shall we get started?`,
    
    'Business Analyst': `Hello ${name}! Welcome to your Business Analyst interview. I'm eager to discuss your analytical skills, process improvement experience, and how you bridge business and technical requirements. Ready to begin?`,
    
    'DevOps Engineer': `Hi ${name}! Great to meet you for the DevOps Engineer interview. I'm looking forward to discussing your infrastructure experience, automation skills, and how you ensure reliable deployments. Let's start!`
  };

  return greetings[jobRole] || `Hello ${name}! Welcome to your interview for the ${jobRole} position. I'm excited to learn more about your experience and qualifications. Let's begin!`;
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
    const { jobRole, candidateName, customContext }: ConversationRequest = await req.json()

    // Validate required fields
    if (!jobRole) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: jobRole is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables
    const tavusApiKey = Deno.env.get('TAVUS_API_KEY')
    const tavusPersonaId = Deno.env.get('TAVUS_PERSONA_ID')
    const tavusReplicaId = Deno.env.get('TAVUS_REPLICA_ID')

    // If environment variables are missing, use mock conversation
    if (!tavusApiKey) {
      console.log('Using mock conversation due to missing Tavus API credentials')
      const mockResponse = generateMockConversation(jobRole, candidateName);
      
      return new Response(
        JSON.stringify(mockResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate conversation context and greeting
    const conversationalContext = generateInterviewContext(jobRole, candidateName, customContext);
    const customGreeting = generateCustomGreeting(jobRole, candidateName);
    const conversationName = `${jobRole} Interview${candidateName ? ` with ${candidateName}` : ''}`;

    // Prepare request to Tavus API
    const tavusRequestBody: TavusConversationRequest = {
      conversation_name: conversationName,
      conversational_context: conversationalContext,
      custom_greeting: customGreeting,
      audio_only: false,
      properties: {
        participant_left_timeout: 300, // 5 minutes
        participant_absent_timeout: 120, // 2 minutes
        enable_recording: true,
        enable_transcription: true,
        max_call_duration: 1800, // 30 minutes
        language: 'en'
      }
    };

    // Add persona_id or replica_id if available
    if (tavusPersonaId) {
      tavusRequestBody.persona_id = tavusPersonaId;
    }
    if (tavusReplicaId) {
      tavusRequestBody.replica_id = tavusReplicaId;
    }

    try {
      // Make request to Tavus API
      const tavusResponse = await fetch(
        'https://tavusapi.com/v2/conversations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': tavusApiKey
          },
          body: JSON.stringify(tavusRequestBody)
        }
      )

      if (!tavusResponse.ok) {
        const errorText = await tavusResponse.text()
        console.error('Tavus API error:', {
          status: tavusResponse.status,
          statusText: tavusResponse.statusText,
          error: errorText
        })
        
        // Fallback to mock conversation if API fails
        console.log('Falling back to mock conversation due to Tavus API error')
        const mockResponse = generateMockConversation(jobRole, candidateName);
        
        return new Response(
          JSON.stringify(mockResponse),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const conversationData: TavusConversationResponse = await tavusResponse.json()

      // Structure the response
      const response = {
        success: true,
        conversation: conversationData,
        isMockMode: false
      }

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (apiError) {
      console.error('Tavus API request failed:', apiError)
      
      // Fallback to mock conversation if API request fails
      console.log('Falling back to mock conversation due to API request failure')
      const mockResponse = generateMockConversation(jobRole, candidateName);
      
      return new Response(
        JSON.stringify(mockResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while creating the conversation.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})