import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js using the correct Vite-compatible approach
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export class PDFExtractor {
  /**
   * Extract text content from a PDF file
   */
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items into a single string
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF document.');
    }
  }

  /**
   * Check if a file is a PDF
   */
  static isPDF(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  /**
   * Validate PDF file before processing
   */
  static validatePDF(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!this.isPDF(file)) {
      return { isValid: false, error: 'File must be a PDF document' };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'PDF file size must be less than 10MB' };
    }

    // Check if file is empty
    if (file.size === 0) {
      return { isValid: false, error: 'PDF file appears to be empty' };
    }

    return { isValid: true };
  }
}