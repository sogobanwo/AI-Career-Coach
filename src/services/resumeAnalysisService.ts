import { supabase } from '../lib/supabase';
import { DashboardService } from './dashboardService';
import { PDFExtractor } from './pdfExtractor';

export interface ResumeAnalysisResponse {
  success: boolean;
  analysis: {
    overallScore: number;
    fullAnalysis: string;
    categoryScores: {
      technical: number;
      experience: number;
      education: number;
      formatting: number;
      keywords: number;
      achievements: number;
    };
    metadata: {
      model: string;
      tokenUsage: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
      };
      timestamp: string;
      fileName: string;
      textLength: number;
    };
  };
}

export interface ResumeAnalysisError {
  error: string;
  details: string;
}

export class ResumeAnalysisService {
  /**
   * Extract text content from uploaded file
   */
  static async extractTextFromFile(file: File): Promise<string> {
    try {
      // Handle PDF files
      if (PDFExtractor.isPDF(file)) {
        const validation = PDFExtractor.validatePDF(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        return await PDFExtractor.extractTextFromPDF(file);
      }
      
      // Handle text files
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = (event) => {
            const result = event.target?.result as string;
            resolve(result);
          };
          
          reader.onerror = () => {
            reject(new Error('Failed to read text file'));
          };
          
          reader.readAsText(file);
        });
      }
      
      // Handle DOCX files (basic text extraction)
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.toLowerCase().endsWith('.docx')) {
        // For DOCX files, we'll provide a helpful error message
        throw new Error('DOCX files are not yet supported. Please convert your resume to PDF or plain text format.');
      }
      
      throw new Error('Unsupported file format. Please upload a PDF or text file.');
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw error;
    }
  }

  /**
   * Analyze resume using AI
   */
  static async analyzeResume(file: File): Promise<ResumeAnalysisResponse> {
    try {
      // Extract text from file
      const resumeText = await this.extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Unable to extract sufficient text from the file. Please ensure your resume contains readable text.');
      }

      // Call the edge function with improved error handling
      const { data: response, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText: resumeText.trim(),
          fileName: file.name
        }
      });

      // Handle Supabase function invocation errors
      if (error) {
        console.error('Supabase function invocation error:', error);
        
        // Check if it's a network or configuration error
        if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
          throw new Error('Network error: Please check your internet connection and try again.');
        }
        
        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          throw new Error('Resume analysis service is temporarily unavailable. Please try again later.');
        }
        
        throw new Error(`Service error: ${error.message || 'Unable to analyze resume at this time'}`);
      }

      // Handle cases where response exists but indicates failure
      if (!response) {
        throw new Error('No response received from analysis service. Please try again.');
      }

      if (!response.success) {
        const errorMessage = response.details || response.error || 'Analysis failed';
        throw new Error(`Analysis failed: ${errorMessage}`);
      }

      // Validate response structure
      if (!response.analysis || typeof response.analysis.overallScore !== 'number') {
        throw new Error('Invalid response format from analysis service. Please try again.');
      }

      // Track the activity for dashboard
      DashboardService.trackActivity('resume_analysis');

      return response;
    } catch (error) {
      console.error('Resume analysis service error:', error);
      
      // Re-throw with user-friendly message if it's already a user-facing error
      if (error instanceof Error && (
          error.message.includes('Network error:') || 
          error.message.includes('Analysis failed:') ||
          error.message.includes('Service error:') ||
          error.message.includes('DOCX files are not yet supported') ||
          error.message.includes('Unsupported file format') ||
          error.message.includes('Failed to extract text from PDF') ||
          error.message.includes('PDF file')
        )) {
        throw error;
      }
      
      // For unexpected errors, provide a generic message
      throw new Error('An unexpected error occurred while analyzing your resume. Please try again or contact support if the problem persists.');
    }
  }

  /**
   * Parse analysis text into structured sections
   */
  static parseAnalysisIntoSections(analysisText: string) {
    const sections = {
      strengths: [] as string[],
      improvements: [] as string[],
      recommendations: [] as string[],
      atsOptimization: '',
      industryAdvice: '',
      nextSteps: ''
    };

    // Split by sections and extract content
    const strengthsMatch = analysisText.match(/\*\*STRENGTHS\*\*(.*?)(?=\*\*|$)/s);
    if (strengthsMatch) {
      sections.strengths = strengthsMatch[1]
        .split(/[-•]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    }

    const improvementsMatch = analysisText.match(/\*\*AREAS FOR IMPROVEMENT\*\*(.*?)(?=\*\*|$)/s);
    if (improvementsMatch) {
      sections.improvements = improvementsMatch[1]
        .split(/[-•]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    }

    const recommendationsMatch = analysisText.match(/\*\*DETAILED RECOMMENDATIONS\*\*(.*?)(?=\*\*|$)/s);
    if (recommendationsMatch) {
      sections.recommendations = recommendationsMatch[1]
        .split(/[-•]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    }

    const atsMatch = analysisText.match(/\*\*ATS OPTIMIZATION\*\*(.*?)(?=\*\*|$)/s);
    if (atsMatch) {
      sections.atsOptimization = atsMatch[1].trim();
    }

    const industryMatch = analysisText.match(/\*\*INDUSTRY-SPECIFIC ADVICE\*\*(.*?)(?=\*\*|$)/s);
    if (industryMatch) {
      sections.industryAdvice = industryMatch[1].trim();
    }

    const nextStepsMatch = analysisText.match(/\*\*NEXT STEPS\*\*(.*?)(?=\*\*|$)/s);
    if (nextStepsMatch) {
      sections.nextSteps = nextStepsMatch[1].trim();
    }

    return sections;
  }
}