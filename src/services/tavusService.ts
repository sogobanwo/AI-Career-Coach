import { supabase } from '../lib/supabase';
import { DashboardService } from './dashboardService';

export interface TavusConversationRequest {
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
    apply_greenscreen?: boolean;
    max_call_duration?: number;
    participant_egress_policy?: string;
    enable_background_blur?: boolean;
    language?: string;
  };
}

export interface TavusConversationResponse {
  conversation_id: string;
  conversation_name: string;
  status: 'active' | 'ended';
  conversation_url: string;
  replica_id: string;
  persona_id: string;
  created_at: string;
  isMockMode?: boolean;
}

export interface TavusError {
  error: string;
  details: string;
}

export class TavusService {
  /**
   * Create a new conversation with Tavus
   */
  static async createConversation(jobRole: string, candidateName: string, customContext?: string): Promise<TavusConversationResponse> {
    try {
      // Send the correct request structure that the Edge Function expects
      const request = {
        jobRole,
        candidateName,
        customContext
      };

      const { data: response, error } = await supabase.functions.invoke('tavus-create-conversation', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to create conversation: ${error.message}`);
      }

      if (!response.success) {
        throw new Error(response.details || response.error || 'Failed to create conversation');
      }

      // Track the activity for dashboard
      DashboardService.trackActivity('mock_interview', jobRole);

      return {
        ...response.conversation,
        isMockMode: response.isMockMode || false
      };
    } catch (error) {
      console.error('Tavus service error:', error);
      throw error;
    }
  }

  /**
   * End an existing conversation
   */
  static async endConversation(conversationId: string): Promise<void> {
    try {
      const { data: response, error } = await supabase.functions.invoke('tavus-end-conversation', {
        body: { conversationId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to end conversation: ${error.message}`);
      }

      if (!response.success) {
        throw new Error(response.details || response.error || 'Failed to end conversation');
      }
    } catch (error) {
      console.error('Tavus service error:', error);
      throw error;
    }
  }

  /**
   * Get conversation status
   */
  static async getConversationStatus(conversationId: string): Promise<any> {
    try {
      const { data: response, error } = await supabase.functions.invoke('tavus-get-conversation', {
        body: { conversationId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get conversation status: ${error.message}`);
      }

      if (!response.success) {
        throw new Error(response.details || response.error || 'Failed to get conversation status');
      }

      return response.conversation;
    } catch (error) {
      console.error('Tavus service error:', error);
      throw error;
    }
  }
}