import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Sparkles, Brain, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { CareerAdviceService, type CareerGoalsData } from '../services/careerAdviceService';

export default function CareerGoalsPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<CareerGoalsData>({
    careerGoals: '',
    experienceLevel: '',
    challenges: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setIsVisible(true);
    // Load existing career goals if available
    loadExistingGoals();
  }, []);

  const loadExistingGoals = async () => {
    try {
      const existingGoals = await CareerAdviceService.getUserCareerGoals();
      if (existingGoals) {
        setFormData({
          careerGoals: existingGoals.career_goals,
          experienceLevel: existingGoals.experience_level,
          challenges: existingGoals.challenges || ''
        });
      }
    } catch (error) {
      console.error('Error loading existing goals:', error);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1 && !formData.careerGoals.trim()) {
      newErrors.careerGoals = 'Please describe your career goals';
    }
    if (step === 2 && !formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select your experience level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await CareerAdviceService.analyzeCareerGoals(formData);
      
      // Store the advice response for the next page
      localStorage.setItem('careerAdviceResponse', JSON.stringify(response));
      
      // Navigate to advice page
      navigate('/career-advice');
    } catch (error) {
      console.error('Error getting career advice:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to get career advice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const experienceOptions = [
    { 
      value: 'entry-level', 
      label: 'Entry Level', 
      desc: '0-2 years of experience', 
      color: 'from-green-500 to-emerald-500',
      icon: '🌱'
    },
    { 
      value: 'mid-career', 
      label: 'Mid-Career', 
      desc: '3-7 years of experience', 
      color: 'from-blue-500 to-cyan-500',
      icon: '🚀'
    },
    { 
      value: 'senior', 
      label: 'Senior', 
      desc: '8+ years of experience', 
      color: 'from-purple-500 to-pink-500',
      icon: '👑'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 rounded-3xl mb-8 animate-pulse-glow shadow-2xl">
            <Target className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Define Your{' '}
            <span className="gradient-text">Career Goals</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tell us about your aspirations and we'll provide personalized guidance powered by advanced AI
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-8 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : currentStep === step - 1
                      ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mt-4 space-x-20">
            {['Goals', 'Experience', 'Challenges'].map((label, index) => (
              <span key={label} className={`text-sm font-medium transition-colors duration-300 ${
                currentStep >= index + 1 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-gray-700/30 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Error Display */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slide-up">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400 text-sm font-medium">{submitError}</span>
                </div>
              </div>
            )}

            {/* Step 1: Career Goals */}
            <div className={`transition-all duration-500 ${currentStep === 1 ? 'block animate-slide-up' : 'hidden'}`}>
              <div className="text-center mb-8">
                <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What are your career aspirations?</h2>
                <p className="text-gray-600 dark:text-gray-300">Be specific about your goals and dreams</p>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  id="careerGoals"
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  className={`form-input ${errors.careerGoals ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="e.g., Become a senior software engineer, transition to product management..."
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-purple-500 dark:text-purple-400 animate-pulse" />
                </div>
                {errors.careerGoals && (
                  <div className="flex items-center space-x-2 mt-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.careerGoals}</span>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular career goals:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Become a team lead',
                    'Switch to tech industry',
                    'Start my own business',
                    'Get promoted to manager',
                    'Learn new skills'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, careerGoals: suggestion }))}
                      className="px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Experience Level */}
            <div className={`transition-all duration-500 ${currentStep === 2 ? 'block animate-slide-up' : 'hidden'}`}>
              <div className="text-center mb-8">
                <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What's your experience level?</h2>
                <p className="text-gray-600 dark:text-gray-300">Help us tailor advice to your career stage</p>
              </div>
              
              <div className="grid gap-4">
                {experienceOptions.map((option) => (
                  <label key={option.value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={option.value}
                      checked={formData.experienceLevel === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      formData.experienceLevel === option.value
                        ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-xl transform scale-105`
                        : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{option.icon}</div>
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{option.label}</h3>
                            <p className={`${formData.experienceLevel === option.value ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                              {option.desc}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          formData.experienceLevel === option.value
                            ? 'border-white bg-white'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {formData.experienceLevel === option.value && (
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transform scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {errors.experienceLevel && (
                <div className="flex items-center space-x-2 mt-4 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.experienceLevel}</span>
                </div>
              )}
            </div>

            {/* Step 3: Challenges */}
            <div className={`transition-all duration-500 ${currentStep === 3 ? 'block animate-slide-up' : 'hidden'}`}>
              <div className="text-center mb-8">
                <Zap className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What challenges are you facing?</h2>
                <p className="text-gray-600 dark:text-gray-300">Share your obstacles so we can help you overcome them</p>
              </div>
              
              <div className="relative">
                <textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  rows={6}
                  className="form-input resize-none"
                  placeholder="Describe any obstacles, skill gaps, or areas where you need guidance..."
                />
                <div className="absolute bottom-4 right-4">
                  <Brain className="h-6 w-6 text-blue-500 dark:text-blue-400 animate-pulse" />
                </div>
              </div>

              {/* Common Challenges */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Common challenges:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Lack of relevant experience',
                    'Skill gaps in technology',
                    'Interview anxiety',
                    'Career direction uncertainty',
                    'Work-life balance',
                    'Networking difficulties'
                  ].map((challenge) => (
                    <button
                      key={challenge}
                      type="button"
                      onClick={() => {
                        const current = formData.challenges;
                        const newValue = current ? `${current}, ${challenge}` : challenge;
                        setFormData(prev => ({ ...prev, challenges: newValue }));
                      }}
                      className="px-4 py-2 bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-400 rounded-lg text-sm hover:bg-orange-100 dark:hover:bg-gray-600 transition-colors text-left"
                    >
                      {challenge}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  currentStep === 1 
                    ? 'invisible' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transform hover:scale-105'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <span className="flex items-center space-x-2">
                    <span>Next Step</span>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg px-12 py-4 ripple"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>AI is analyzing...</span>
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Get AI Insights</span>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Loading Animation */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center max-w-md mx-4 shadow-2xl animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Brain className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI is Working Its Magic</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Analyzing your goals and crafting personalized advice...</p>
              <div className="flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}