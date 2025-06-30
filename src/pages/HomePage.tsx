import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, FileText, MessageCircle, TrendingUp, Star, Sparkles, Zap, Brain, Play, CheckCircle } from 'lucide-react';
import BoltBadge from '../components/BoltBadge';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-cycle through steps for demo
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Personalized Career Advice',
      description: 'Get tailored guidance based on your goals and experience level',
      color: 'from-blue-500 to-cyan-500',
      delay: '0s',
      benefits: ['AI-powered insights', 'Industry-specific advice', 'Goal-oriented roadmap']
    },
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'AI-powered analysis to identify skill gaps and improvements',
      color: 'from-purple-500 to-pink-500',
      delay: '0.2s',
      benefits: ['ATS optimization', 'Skill gap analysis', 'Professional formatting']
    },
    {
      icon: MessageCircle,
      title: 'Mock Interviews',
      description: 'Practice with our AI interviewer and get instant feedback',
      color: 'from-green-500 to-emerald-500',
      delay: '0.4s',
      benefits: ['Real-time feedback', 'Industry questions', 'Performance scoring']
    },
    {
      icon: TrendingUp,
      title: 'Career Growth Tracking',
      description: 'Monitor your progress and celebrate your achievements',
      color: 'from-orange-500 to-red-500',
      delay: '0.6s',
      benefits: ['Progress analytics', 'Goal tracking', 'Achievement badges']
    }
  ];

  const stats = [
    { number: '10K+', label: 'Careers Transformed', icon: Star, color: 'text-yellow-500' },
    { number: '95%', label: 'Success Rate', icon: TrendingUp, color: 'text-green-500' },
    { number: '24/7', label: 'AI Support', icon: Brain, color: 'text-blue-500' },
    { number: '50+', label: 'Industries Covered', icon: Target, color: 'text-purple-500' }
  ];

  const steps = [
    { title: 'Define Goals', icon: Target, description: 'Tell us your career aspirations' },
    { title: 'Get Advice', icon: Brain, description: 'Receive personalized AI guidance' },
    { title: 'Optimize Resume', icon: FileText, description: 'Improve your professional profile' },
    { title: 'Practice Interviews', icon: MessageCircle, description: 'Master your interview skills' }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" style={{ animationDelay: `${i}s` }}></div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <BoltBadge />
          </div>
          
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              <span className="inline-block animate-float">AI</span>{' '}
              <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>Career</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient inline-block animate-float" style={{ animationDelay: '1s' }}>
                Coach
              </span>
            </h1>
          </div>
          
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Your Path to{' '}
              <span className="font-bold text-gray-900 dark:text-white">Career Success</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              to="/career-goals"
              className="group relative btn-primary text-xl py-6 px-12 ripple"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span>Start Your Journey</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
            
            <Link
              to="/about"
              className="group btn-secondary text-xl py-6 px-12"
            >
              <span className="flex items-center space-x-2">
                <span>Learn More</span>
                <Sparkles className="h-5 w-5 group-hover:animate-spin" />
              </span>
            </Link>
          </div>

          {/* Process Steps */}
          <div className={`max-w-4xl mx-auto mb-20 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className={`relative p-6 rounded-2xl transition-all duration-500 ${
                  currentStep === index 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105' 
                    : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white'
                }`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      currentStep === index 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    }`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className={`text-sm ${currentStep === index ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Step number */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === index 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/20 dark:border-gray-700/30">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-32 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform provides comprehensive career guidance tailored to your unique journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-10 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 card-3d animate-scale-in border border-white/20 dark:border-gray-700/30"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500" 
                     style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
                
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse-glow`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {feature.description}
                </p>

                {/* Feature Benefits */}
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"
                     style={{ backgroundImage: `linear-gradient(90deg, var(--tw-gradient-stops))` }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-slide-up">
            <h2 className="text-5xl font-bold text-white mb-8 animate-float">
              Ready to Transform Your Career?
            </h2>
            
            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of professionals who have accelerated their career growth with our AI-powered coaching
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/career-goals"
                className="group relative bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl ripple"
              >
                <span className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 group-hover:animate-pulse" />
                  <span>Get Started Now</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
              
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white animate-bounce-gentle`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-semibold">Join 10,000+ users</div>
                  <div className="text-sm opacity-75">Already transforming careers</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">4.9★</div>
                <div className="text-white/80 text-sm">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80 text-sm">Secure & Private</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}