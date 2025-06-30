import React, { useState, useEffect } from 'react';
import { Play, Send, Star, Clock, Brain, Sparkles, Zap, MessageCircle, TrendingUp, Video, PhoneOff, Mic, MicOff, Camera, CameraOff, AlertTriangle, ExternalLink } from 'lucide-react';
import { TavusService } from '../services/tavusService';
import { useAuth } from '../contexts/AuthContext';

export default function MockInterviewPage() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationData, setConversationData] = useState<any>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewActive) {
      interval = setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive]);

  const jobRoles = [
    { value: 'Software Engineer', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { value: 'Product Manager', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { value: 'Data Scientist', icon: '📈', color: 'from-green-500 to-emerald-500' },
    { value: 'UX Designer', icon: '🎨', color: 'from-orange-500 to-red-500' },
    { value: 'Marketing Manager', icon: '📢', color: 'from-indigo-500 to-purple-500' },
    { value: 'Sales Representative', icon: '💼', color: 'from-teal-500 to-cyan-500' },
    { value: 'Business Analyst', icon: '📋', color: 'from-pink-500 to-rose-500' },
    { value: 'DevOps Engineer', icon: '⚙️', color: 'from-gray-500 to-slate-500' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create conversation with Tavus
      const conversation = await TavusService.createConversation(
        selectedRole,
        user?.user_metadata?.full_name || 'Candidate'
      );
      
      console.log('Conversation created:', conversation);
      console.log('Conversation URL:', conversation.conversation_url);
      
      // Log additional details about the conversation
      if (conversation.conversation_url) {
        console.log('✅ Live Tavus conversation URL available:', conversation.conversation_url);
        console.log('📋 Conversation ID:', conversation.conversation_id);
        console.log('🎭 Replica ID:', conversation.replica_id);
        console.log('👤 Persona ID:', conversation.persona_id);
        console.log('📅 Created at:', conversation.created_at);
        console.log('🔄 Status:', conversation.status);
      } else {
        console.log('⚠️ No conversation URL - running in mock mode');
        console.log('🎮 Mock mode active:', conversation.isMockMode);
      }
      
      setConversationData(conversation);
      setIsMockMode(conversation.isMockMode || false);
      setIsInterviewActive(true);
      setInterviewTime(0);
      setIsVideoLoaded(false);
      
      // For real Tavus connections, set loaded after a brief delay
      if (!conversation.isMockMode && conversation.conversation_url) {
        console.log('🔄 Loading video interface for URL:', conversation.conversation_url);
        setTimeout(() => {
          setIsVideoLoaded(true);
          console.log('✅ Video interface loaded successfully');
        }, 2000);
      } else {
        // For mock mode, set loaded immediately
        setIsVideoLoaded(true);
        console.log('🎮 Mock mode interface loaded');
      }
      
    } catch (err) {
      console.error('❌ Error starting interview:', err);
      setError(err instanceof Error ? err.message : 'Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async () => {
    if (conversationData?.conversation_id && !isMockMode) {
      try {
        console.log('🔄 Ending conversation:', conversationData.conversation_id);
        await TavusService.endConversation(conversationData.conversation_id);
        console.log('✅ Conversation ended successfully');
      } catch (err) {
        console.error('❌ Error ending conversation:', err);
      }
    } else {
      console.log('🎮 Ending mock interview session');
    }
    
    setIsInterviewActive(false);
    setConversationData(null);
    setIsVideoLoaded(false);
    setInterviewTime(0);
    setIsMockMode(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log('🔇 Mute toggled:', !isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    console.log('📹 Camera toggled:', !isCameraOn);
  };

  const openConversationInNewTab = () => {
    if (conversationData?.conversation_url) {
      console.log('🔗 Opening conversation in new tab:', conversationData.conversation_url);
      window.open(conversationData.conversation_url, '_blank');
    } else {
      console.log('⚠️ No conversation URL available to open');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
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
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Video Interview{' '}
            <span className="gradient-text">Practice</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practice with our AI interviewer powered by Tavus and improve your performance with real-time video conversations
          </p>

          {/* Feature Highlights */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Video className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Live Video AI</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Brain className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Tavus Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Star className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Real-time Interaction</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 animate-slide-up">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Job Role Selection */}
        {!isInterviewActive && (
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-white/20 dark:border-gray-700/30 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center space-x-3">
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
              <span>Select Your Target Role</span>
              <Zap className="h-8 w-8 text-blue-500 animate-pulse" />
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobRoles.map((role, index) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 animate-scale-in ${
                    selectedRole === role.value
                      ? `border-transparent bg-gradient-to-br ${role.color} text-white shadow-xl scale-105`
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <span className="font-semibold text-lg">{role.value}</span>
                  {selectedRole === role.value && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Star className="h-4 w-4 animate-pulse" />
                      <span className="text-sm opacity-90">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {selectedRole && (
              <div className="text-center mt-12 animate-slide-up">
                <div className="mb-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    Ready to practice for <span className="font-semibold gradient-text">{selectedRole}</span> position?
                  </p>
                  <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>15-30 minutes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>Live video AI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="h-4 w-4" />
                      <span>Tavus powered</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={startInterview}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl py-6 px-12 ripple"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Starting AI Interview...</span>
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </span>
                  ) : (
                    <span className="flex items-center space-x-3">
                      <Play className="h-6 w-6" />
                      <span>Start AI Video Interview</span>
                      <Video className="h-6 w-6 animate-pulse" />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interview Interface */}
        {isInterviewActive && (
          <div className="space-y-8">
            {/* Interview Status Bar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isMockMode ? 'Demo Interview Mode' : 'Live AI Interview'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {selectedRole}
                  </span>
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isMockMode ? 'Demo Mode' : 'Powered by Tavus'}
                    </span>
                  </div>
                  {isMockMode && (
                    <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Demo Mode Active</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg">{formatTime(interviewTime)}</span>
                  </div>
                  <button
                    onClick={endInterview}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
                  >
                    <PhoneOff className="h-4 w-4" />
                    <span>End Interview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Interface */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-gray-700/30 animate-scale-in">
              <div className="relative mx-auto max-w-6xl">
                {conversationData?.conversation_url && !isMockMode ? (
                  <div className="relative">
                    {!isVideoLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                            <Video className="h-10 w-10 text-white animate-pulse" />
                          </div>
                          <h3 className="text-2xl font-bold gradient-text mb-3">Connecting to AI Interviewer</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Please wait while we establish the video connection...</p>
                          <div className="flex justify-center space-x-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <iframe
                      src={conversationData.conversation_url}
                      className="w-full h-96 lg:h-[600px] rounded-2xl border-2 border-gray-200 dark:border-gray-600"
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      onLoad={() => setIsVideoLoaded(true)}
                      title="Tavus AI Interview"
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Live Interview</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span className="text-sm">AI Interviewer Active</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={openConversationInNewTab}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={toggleMute}
                          className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={toggleCamera}
                          className={`p-2 rounded-lg transition-colors ${!isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
                          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                        >
                          {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 lg:h-[600px] bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                        <MessageCircle className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {isMockMode ? 'Demo Interview Mode' : 'Video Connection Unavailable'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                        {isMockMode 
                          ? 'This is a demonstration of the interview interface. In production, this would connect to a live Tavus AI interviewer.'
                          : 'Unable to establish video connection. The interview simulation is running in demo mode.'
                        }
                      </p>
                      
                      {/* Show conversation URL if available but not embedded */}
                      {conversationData?.conversation_url && (
                        <div className="mb-6">
                          <button
                            onClick={openConversationInNewTab}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                          >
                            <ExternalLink className="h-5 w-5" />
                            <span>Open Interview in New Tab</span>
                          </button>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Click to join your live AI interview session
                          </p>
                        </div>
                      )}
                      
                      {isMockMode && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Features:</h4>
                          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                            <li>• Simulated interview timer</li>
                            <li>• Mock conversation interface</li>
                            <li>• Practice interview flow</li>
                            <li>• UI/UX demonstration</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Information */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Interview Details</h3>
                    <div className="space-y-1 text-gray-700 dark:text-gray-300">
                      <p><strong>Position:</strong> {selectedRole}</p>
                      <p><strong>Candidate:</strong> {user?.user_metadata?.full_name || 'Anonymous'}</p>
                      <p><strong>Duration:</strong> {formatTime(interviewTime)}</p>
                      <p><strong>Mode:</strong> {isMockMode ? 'Demo/Practice Mode' : \'Live Tavus AI'}</p>
                      {conversationData && (
                        <>
                          <p><strong>Session ID:</strong> {conversationData.conversation_id}</p>
                          {conversationData.conversation_url && (
                            <p><strong>Status:</strong> <span className="text-green-600 dark:text-green-400">Connected</span></p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-3 animate-pulse-glow">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isMockMode ? 'Demo tracking active' : 'Performance tracking active'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Interview Tips</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <Video className="h-6 w-6 mx-auto mb-2" />
                  <p><strong>Maintain Eye Contact</strong><br />Look directly at the camera when speaking</p>
                </div>
                <div>
                  <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                  <p><strong>Speak Clearly</strong><br />Use clear, concise language and examples</p>
                </div>
                <div>
                  <Star className="h-6 w-6 mx-auto mb-2" />
                  <p><strong>Be Authentic</strong><br />Show your personality and enthusiasm</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}