import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Sparkles, Brain, Star, Zap, Download, ExternalLink, FileIcon } from 'lucide-react';
import { ResumeAnalysisService, type ResumeAnalysisResponse } from '../services/resumeAnalysisService';

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ResumeAnalysisResponse | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileUpload = (uploadedFile: File) => {
    // Reset previous state
    setError('');
    setAnalysisResults(null);
    setUploadProgress(0);
    setExtractionProgress(0);
    
    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf'];
    const allowedExtensions = ['.txt', '.pdf', '.docx'];
    
    const isValidType = allowedTypes.includes(uploadedFile.type) || 
                       allowedExtensions.some(ext => uploadedFile.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      setError('Please upload a PDF, DOCX, or text file');
      return;
    }

    // Check file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(uploadedFile);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setIsExtracting(true);
    setError('');
    
    try {
      // Simulate text extraction progress for PDFs
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        let progress = 0;
        const extractionInterval = setInterval(() => {
          progress += 20;
          setExtractionProgress(progress);
          if (progress >= 100) {
            clearInterval(extractionInterval);
            setIsExtracting(false);
          }
        }, 300);
      } else {
        setIsExtracting(false);
      }
      
      const response = await ResumeAnalysisService.analyzeResume(file);
      setAnalysisResults(response);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setExtractionProgress(0);
    setAnalysisResults(null);
    setError('');
    setIsExtracting(false);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <div className="text-red-500 text-2xl">📄</div>;
    }
    if (fileName.toLowerCase().endsWith('.docx')) {
      return <div className="text-blue-500 text-2xl">📝</div>;
    }
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  // Parse the analysis into sections for better display
  const parsedSections = analysisResults ? 
    ResumeAnalysisService.parseAnalysisIntoSections(analysisResults.analysis.fullAnalysis) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 dark:from-purple-500 dark:to-pink-600 rounded-3xl mb-8 animate-pulse-glow shadow-2xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Resume{' '}
            <span className="gradient-text">Analysis</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get AI-powered insights to improve your resume and stand out to employers
          </p>

          {/* Feature Highlights */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Brain className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">PDF Support</span>
            </div>
            <div className="flex items-center space-x-2 text-pink-600 dark:text-pink-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">ATS Optimization</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 animate-slide-up">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-white/20 dark:border-gray-700/30 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105' 
                : file 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-6 animate-scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg animate-pulse-glow">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    {getFileIcon(file.name)}
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{file.name}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Ready for AI analysis</p>
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>Type: {file.type || 'Document'}</span>
                    {file.name.toLowerCase().endsWith('.pdf') && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">PDF Text Extraction Supported</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                <button
                  onClick={resetUpload}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-lg transition-colors hover:underline"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl group-hover:from-purple-100 group-hover:to-purple-200 dark:group-hover:from-purple-800 dark:group-hover:to-purple-700 transition-all duration-300">
                  <Upload className="h-10 w-10 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Upload Your Resume
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    Drag and drop your file here, or click to browse
                  </p>
                  
                  <label className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Upload className="h-5 w-5 mr-2" />
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.docx"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>PDF, DOCX, TXT</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Max 10MB</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Secure & Private</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {file && !analysisResults && (
            <div className="text-center mt-10">
              <button
                onClick={analyzeResume}
                disabled={isAnalyzing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl px-12 py-6 ripple"
              >
                {isAnalyzing ? (
                  <span className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <Brain className="h-6 w-6 animate-pulse" />
                    <span>
                      {isExtracting ? 'Extracting text from PDF...' : 'AI is analyzing your resume...'}
                    </span>
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Analyze Resume with AI</span>
                    <Zap className="h-6 w-6" />
                  </span>
                )}
              </button>
              
              {/* Text Extraction Progress for PDFs */}
              {isExtracting && extractionProgress > 0 && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Extracting text from PDF...</p>
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${extractionProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{extractionProgress}% complete</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-12 animate-slide-up">
            {/* Overall Score */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-gray-700/30">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-center space-x-3">
                  <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
                  <span>Resume Score</span>
                  <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                </h2>
                
                <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysisResults.analysis.overallScore / 100)}`}
                      className="transition-all duration-2000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <div className="absolute text-4xl font-bold gradient-text">
                    {analysisResults.analysis.overallScore}%
                  </div>
                </div>
                
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {analysisResults.analysis.overallScore >= 80 ? 'Excellent resume with minor improvements needed' :
                   analysisResults.analysis.overallScore >= 60 ? 'Good resume with room for enhancement' :
                   'Resume needs significant improvements'}
                </p>

                {/* Category Breakdown */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  {Object.entries(analysisResults.analysis.categoryScores).map(([category, score], index) => (
                    <div key={category} className="text-center p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">
                        {category === 'technical' ? 'Technical Skills' :
                         category === 'experience' ? 'Work Experience' :
                         category === 'education' ? 'Education' :
                         category === 'formatting' ? 'Formatting' :
                         category === 'keywords' ? 'Keywords & ATS' :
                         'Achievements'}
                      </h4>
                      <div className="text-2xl font-bold gradient-text">{Math.round(score)}%</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metadata */}
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                  Analyzed by {analysisResults.analysis.metadata.model} • {analysisResults.analysis.metadata.tokenUsage.totalTokenCount} tokens • {new Date(analysisResults.analysis.metadata.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Full Analysis Display */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Detailed AI Analysis</h3>
                </div>
                
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                  <Download className="h-5 w-5" />
                  <span>Download Report</span>
                </button>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8">
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {analysisResults.analysis.fullAnalysis}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-10 text-white text-center">
              <h3 className="text-3xl font-bold mb-6">Ready to Optimize Your Resume?</h3>
              <p className="text-xl mb-8 text-white/90">
                Implement these AI-powered recommendations to increase your chances of landing interviews
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Report</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all transform hover:scale-105 flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>Schedule Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center max-w-md mx-4 shadow-2xl animate-scale-in">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                <Brain className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {isExtracting ? 'Extracting Text from PDF' : 'AI Analysis in Progress'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                {isExtracting 
                  ? 'Reading and extracting text content from your PDF resume...'
                  : 'Our advanced AI is analyzing your resume for optimization opportunities...'
                }
              </p>
              
              {/* Progress indicator */}
              {isExtracting && extractionProgress > 0 && (
                <div className="mb-6">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${extractionProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{extractionProgress}% extracted</p>
                </div>
              )}
              
              <div className="flex justify-center space-x-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}