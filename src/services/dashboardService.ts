import { supabase } from '../lib/supabase';

export interface UserActivity {
  careerGoalsCompleted: number;
  resumeAnalysisCount: number;
  mockInterviewsCount: number;
  lastActivity: string | null;
  joinDate: string;
  profileCompleteness: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export class DashboardService {
  /**
   * Get comprehensive user activity data
   */
  static async getUserActivity(): Promise<UserActivity> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get career goals count
      const { count: careerGoalsCount } = await supabase
        .from('career_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate profile completeness
      const profileCompleteness = this.calculateProfileCompleteness(user, profile);

      // For now, we'll use localStorage to track resume analysis and mock interviews
      // In a production app, you'd store this in the database
      const resumeAnalysisCount = parseInt(localStorage.getItem('resumeAnalysisCount') || '0');
      const mockInterviewsCount = parseInt(localStorage.getItem('mockInterviewsCount') || '0');
      const lastActivity = localStorage.getItem('lastActivity');

      return {
        careerGoalsCompleted: careerGoalsCount || 0,
        resumeAnalysisCount,
        mockInterviewsCount,
        lastActivity,
        joinDate: profile?.created_at || user.created_at,
        profileCompleteness
      };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      // Return default values if there's an error
      return {
        careerGoalsCompleted: 0,
        resumeAnalysisCount: 0,
        mockInterviewsCount: 0,
        lastActivity: null,
        joinDate: new Date().toISOString(),
        profileCompleteness: 50
      };
    }
  }

  /**
   * Calculate profile completeness percentage
   */
  private static calculateProfileCompleteness(user: any, profile: any): number {
    let completeness = 0;
    const maxScore = 100;
    
    // Basic auth info (20 points)
    if (user?.email) completeness += 20;
    
    // Profile info (40 points)
    if (profile?.full_name) completeness += 20;
    if (profile?.avatar_url) completeness += 20;
    
    // Activity-based completeness (40 points)
    const careerGoalsSet = localStorage.getItem('careerGoalsSet') === 'true';
    const resumeUploaded = localStorage.getItem('resumeUploaded') === 'true';
    const interviewPracticed = localStorage.getItem('interviewPracticed') === 'true';
    
    if (careerGoalsSet) completeness += 15;
    if (resumeUploaded) completeness += 15;
    if (interviewPracticed) completeness += 10;
    
    return Math.min(completeness, maxScore);
  }

  /**
   * Get recent user activities
   */
  static async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // In a production app, you'd fetch this from a dedicated activities table
      // For now, we'll construct from available data and localStorage
      const activities: RecentActivity[] = [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return activities;

      // Check for career goals
      const { data: careerGoals } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (careerGoals && careerGoals.length > 0) {
        activities.push({
          id: `career-goals-${careerGoals[0].id}`,
          action: 'Completed career goals assessment',
          timestamp: careerGoals[0].updated_at,
          details: `Set goal: ${careerGoals[0].career_goals.substring(0, 50)}...`
        });
      }

      // Add activities from localStorage
      const lastResumeAnalysis = localStorage.getItem('lastResumeAnalysis');
      if (lastResumeAnalysis) {
        activities.push({
          id: 'resume-analysis',
          action: 'Analyzed resume with AI',
          timestamp: lastResumeAnalysis,
          details: 'Received detailed feedback and optimization suggestions'
        });
      }

      const lastMockInterview = localStorage.getItem('lastMockInterview');
      if (lastMockInterview) {
        const interviewRole = localStorage.getItem('lastInterviewRole') || 'Unknown Role';
        activities.push({
          id: 'mock-interview',
          action: 'Practiced mock interview',
          timestamp: lastMockInterview,
          details: `Interview for ${interviewRole} position`
        });
      }

      const profileUpdated = localStorage.getItem('profileLastUpdated');
      if (profileUpdated) {
        activities.push({
          id: 'profile-update',
          action: 'Updated profile information',
          timestamp: profileUpdated,
          details: 'Enhanced profile completeness'
        });
      }

      // Sort by timestamp (most recent first)
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5); // Limit to 5 most recent activities

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Track user activity (call this when user completes actions)
   */
  static trackActivity(activityType: 'resume_analysis' | 'mock_interview' | 'career_goals' | 'profile_update', details?: string) {
    const timestamp = new Date().toISOString();
    
    switch (activityType) {
      case 'resume_analysis':
        const currentCount = parseInt(localStorage.getItem('resumeAnalysisCount') || '0');
        localStorage.setItem('resumeAnalysisCount', (currentCount + 1).toString());
        localStorage.setItem('lastResumeAnalysis', timestamp);
        localStorage.setItem('resumeUploaded', 'true');
        break;
        
      case 'mock_interview':
        const interviewCount = parseInt(localStorage.getItem('mockInterviewsCount') || '0');
        localStorage.setItem('mockInterviewsCount', (interviewCount + 1).toString());
        localStorage.setItem('lastMockInterview', timestamp);
        localStorage.setItem('interviewPracticed', 'true');
        if (details) localStorage.setItem('lastInterviewRole', details);
        break;
        
      case 'career_goals':
        localStorage.setItem('careerGoalsSet', 'true');
        break;
        
      case 'profile_update':
        localStorage.setItem('profileLastUpdated', timestamp);
        break;
    }
    
    localStorage.setItem('lastActivity', timestamp);
  }

  /**
   * Get user progress metrics
   */
  static async getProgressMetrics(): Promise<{
    careerGoalsProgress: number;
    resumeOptimization: number;
    interviewSkills: number;
    overallProgress: number;
  }> {
    try {
      const activity = await this.getUserActivity();
      
      // Calculate progress based on activity
      const careerGoalsProgress = activity.careerGoalsCompleted > 0 ? 75 : 0;
      const resumeOptimization = Math.min(85, activity.resumeAnalysisCount * 25);
      const interviewSkills = Math.min(90, activity.mockInterviewsCount * 15);
      
      const overallProgress = Math.round(
        (careerGoalsProgress + resumeOptimization + interviewSkills + activity.profileCompleteness) / 4
      );
      
      return {
        careerGoalsProgress,
        resumeOptimization,
        interviewSkills,
        overallProgress
      };
    } catch (error) {
      console.error('Error calculating progress metrics:', error);
      return {
        careerGoalsProgress: 0,
        resumeOptimization: 0,
        interviewSkills: 0,
        overallProgress: 0
      };
    }
  }
}