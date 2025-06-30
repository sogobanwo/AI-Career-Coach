import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, FileText, MessageCircle, TrendingUp, Star, Sparkles, Brain, User, Calendar, Award, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardService, type UserActivity, type RecentActivity } from '../services/dashboardService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [progressMetrics, setProgressMetrics] = useState({
    careerGoalsProgress: 0,
    resumeOptimization: 0,
    interviewSkills: 0,
    overallProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [activity, activities, metrics] = await Promise.all([
        DashboardService.getUserActivity(),
        DashboardService.getRecentActivities(),
        DashboardService.getProgressMetrics()
      ]);
      
      setUserActivity(activity);
      setRecentActivities(activities);
      setProgressMetrics(metrics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('career goals')) return Target;
    if (action.includes('resume')) return FileText;
    if (action.includes('interview')) return MessageCircle;
    if (action.includes('profile')) return User;
    return CheckCircle;
  };

  const quickActions = [
    {
      title: 'Set Career Goals',
      description: 'Define your career aspirations and get personalized guidance',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      link: '/career-goals',
      status: userActivity?.careerGoalsCompleted ? 'Completed' : 'Start Now',
      completed: userActivity?.careerGoalsCompleted > 0
    },
    {
      title: 'Analyze Resume',
      description: 'Get AI-powered insights to improve your resume',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      link: '/resume-upload',
      status: userActivity?.resumeAnalysisCount ? `${userActivity.resumeAnalysisCount} Analysis` : 'Upload',
      completed: userActivity?.resumeAnalysisCount > 0
    },
    {
      title: 'Practice Interview',
      description: 'Mock interviews with real-time AI feedback',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      link: '/mock-interview',
      status: userActivity?.mockInterviewsCount ? `${userActivity.mockInterviewsCount} Sessions` : 'Practice',
      completed: userActivity?.mockInterviewsCount > 0
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Brain className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className={`mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.user_metadata?.full_name || 'Career Champion'}!
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {userActivity?.lastActivity 
                      ? `Last active ${formatTimeAgo(userActivity.lastActivity)}`
                      : 'Ready to accelerate your career growth today?'
                    }
                  </p>
                  {userActivity && (
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(userActivity.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>{userActivity.profileCompleteness}% Profile Complete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{userActivity?.careerGoalsCompleted || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Goals Set</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{progressMetrics.resumeOptimization}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Resume Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{userActivity?.mockInterviewsCount || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{progressMetrics.overallProgress}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span>Quick Actions</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.link}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/30 animate-scale-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {action.completed && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:gradient-text transition-all duration-300">
                  {action.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {action.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    action.completed 
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                      : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  }`}>
                    {action.status}
                  </span>
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <span className="text-xs">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className={`mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Progress Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Your Progress</span>
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Career Goals</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progressMetrics.careerGoalsProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${progressMetrics.careerGoalsProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume Optimization</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{progressMetrics.resumeOptimization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${progressMetrics.resumeOptimization}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Skills</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{progressMetrics.interviewSkills}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${progressMetrics.interviewSkills}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const IconComponent = getActivityIcon(activity.action);
                    return (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                          {activity.details && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.details}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Start using the platform to see your activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-8 text-white text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-8 w-8 animate-pulse" />
              <h3 className="text-2xl font-bold">AI Career Insights</h3>
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              {progressMetrics.overallProgress < 50 
                ? "You're just getting started! Complete your career goals assessment to unlock personalized recommendations."
                : progressMetrics.interviewSkills < 60
                  ? "Great progress! Focus on interview preparation to reach your next career milestone faster."
                  : "Excellent work! You're well on your way to achieving your career goals. Keep up the momentum!"
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {progressMetrics.careerGoalsProgress === 0 ? (
                <Link
                  to="/career-goals"
                  className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Career Assessment
                </Link>
              ) : progressMetrics.interviewSkills < 60 ? (
                <Link
                  to="/mock-interview"
                  className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Interview Practice
                </Link>
              ) : (
                <Link
                  to="/career-advice"
                  className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Advanced Insights
                </Link>
              )}
              <Link
                to="/career-advice"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
              >
                View All Recommendations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}