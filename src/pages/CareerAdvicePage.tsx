import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, FileText, MessageCircle, Lightbulb, Sparkles, Brain, Star, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import type { CareerAdviceResponse } from '../services/careerAdviceService';

export default function CareerAdvicePage() {
  const navigate = useNavigate();
  const [adviceData, setAdviceData] = useState<CareerAdviceResponse | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get advice data from localStorage
    const storedAdvice = localStorage.getItem('careerAdviceResponse');
    if (!storedAdvice) {
      navigate('/career-goals');
      return;
    }

    try {
      const parsedAdvice: CareerAdviceResponse = JSON.parse(storedAdvice);
      setAdviceData(parsedAdvice);
      setIsVisible(true);
    } catch (err) {
      console.error('Error parsing advice data:', err);
      setError('Failed to load career advice. Please try again.');
      navigate('/career-goals');
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            to="/career-goals"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Try Again</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!adviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Brain className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your personalized advice...</p>
        </div>
      </div>
    );
  }

  // Parse the AI advice into sections for better display
  const parseAdviceContent = (advice: string) => {
    const sections = advice.split(/\n\s*\n/);
    return sections.map(section => section.trim()).filter(section => section.length > 0);
  };

  const adviceSections = parseAdviceContent(adviceData.advice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 dark:bg-green-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 rounded-3xl mb-8 animate-pulse-glow shadow-2xl">
            <Lightbulb className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Personalized{' '}
            <span className="gradient-text">Career Advice</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered insights tailored specifically to your goals and experience
          </p>

          {/* Success Indicators */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Analysis Complete</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Star className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Personalized for You</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">AI-Powered</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Generated by {adviceData.metadata.model} • {adviceData.metadata.tokenUsage.totalTokenCount} tokens • {new Date(adviceData.metadata.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Video Player Section */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-white/20 dark:border-gray-700/30 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span>AI Career Coaching Session</span>
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          </h2>
          
          <div className="relative mx-auto max-w-4xl">
            <div 
              className={`w-full h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 ${isVideoPlaying ? 'animate-pulse-glow' : ''}`}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 rounded-full mb-6 cursor-pointer transition-all duration-300 shadow-2xl ${isVideoPlaying ? 'animate-pulse scale-110' : 'hover:scale-110 hover:shadow-3xl'}`}>
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-3">Tavus AI Video Agent</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  {isVideoPlaying ? 'Your personalized coaching session is playing...' : 'Click to start your personalized coaching session'}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>HD Quality</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Personalized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            {isVideoPlaying && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between text-white animate-slide-up">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Play className="h-5 w-5" />
                  </button>
                  <span className="text-sm">2:34 / 8:45</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live AI Session</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Advice Content */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-white/20 dark:border-gray-700/30 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Your Personalized Career Roadmap</h3>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {/* User Input Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Goals & Background:</h4>
              <div className="space-y-2 text-gray-800 dark:text-gray-200">
                <p><strong>Career Goals:</strong> {adviceData.metadata.userInput.careerGoals}</p>
                <p><strong>Experience Level:</strong> {adviceData.metadata.userInput.experienceLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                {adviceData.metadata.userInput.challenges && (
                  <p><strong>Challenges:</strong> {adviceData.metadata.userInput.challenges}</p>
                )}
              </div>
            </div>
            
            {/* AI Advice Sections */}
            <div className="space-y-6">
              {adviceSections.map((section, index) => (
                <div key={index} className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {section}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className={`grid md:grid-cols-2 gap-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link
            to="/resume-upload"
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/30 card-3d"
          >
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse-glow">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all duration-300">
                  Analyze Your Resume
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">AI-Powered Analysis</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Get detailed feedback on your resume and identify skill gaps to address for your career goals
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              <span>Start Analysis</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/mock-interview"
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/30 card-3d"
          >
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse-glow">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all duration-300">
                  Practice Interviews
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Brain className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Real-time Feedback</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Prepare for your dream job with AI-powered mock interviews and instant performance feedback
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              <span>Start Practice</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>
        </div>

        {/* Success Metrics */}
        <div className={`mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-10 text-white text-center transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold mb-6">Your Success Journey Starts Now</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/90">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2.5x</div>
              <div className="text-white/90">Faster Career Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Careers Transformed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}