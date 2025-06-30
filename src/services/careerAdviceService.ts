import { supabase } from '../lib/supabase';
import { DashboardService } from './dashboardService';

export interface CareerGoalsData {
  careerGoals: string;
  experienceLevel: string;
  challenges?: string;
}

export interface CareerAdviceResponse {
  success: boolean;
  advice: string;
  metadata: {
    model: string;
    tokenUsage: {
      promptTokenCount: number;
      candidatesTokenCount: number;
      totalTokenCount: number;
    };
    timestamp: string;
    userInput: CareerGoalsData;
  };
}

export interface CareerAdviceError {
  error: string;
  details: string;
}

export class CareerAdviceService {
  static async analyzeCareerGoals(data: CareerGoalsData): Promise<CareerAdviceResponse> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save career goals to database first
      const { error: saveError } = await supabase
        .from('career_goals')
        .upsert({
          user_id: user.id,
          career_goals: data.careerGoals,
          experience_level: data.experienceLevel,
          challenges: data.challenges || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (saveError) {
        console.error('Error saving career goals:', saveError);
        // Continue with API call even if save fails
      }

      // Call the edge function
      const { data: response, error } = await supabase.functions.invoke('analyze-career-goals', {
        body: data
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Failed to get career advice: ${error.message}`);
      }

      if (!response.success) {
        throw new Error(response.details || response.error || 'Failed to generate career advice');
      }

      // Track the activity for dashboard
      DashboardService.trackActivity('career_goals');

      return response;
    } catch (error) {
      console.error('Career advice service error:', error);
      throw error;
    }
  }

  static async getUserCareerGoals(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching career goals:', error);
      return null;
    }
  }
}