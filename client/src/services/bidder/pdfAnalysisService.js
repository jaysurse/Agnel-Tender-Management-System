/**
 * PDF Analysis Service
 * Client-side service for PDF upload and analysis
 */
import api from './api';

export const pdfAnalysisService = {
  /**
   * Upload and analyze a PDF tender document
   * @param {File} file - PDF file to analyze
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePDF(file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }

    const response = await api.post('/pdf/analyze', formData, config);
    return response.data;
  },

  /**
   * Evaluate a proposal against tender requirements
   * UPDATED: Sends only sessionId and minimal proposal data (no large payloads)
   * @param {string} sessionId - Analysis session ID
   * @param {Object} proposal - Minimal proposal with sections [{id, title, content}]
   * @param {string} tenderId - Optional tender ID for reference
   * @returns {Promise<Object>} Evaluation results
   */
  async evaluateProposal(sessionId, proposal, tenderId = null) {
    // Send ONLY minimal data - backend loads context internally
    const response = await api.post('/pdf/evaluate', {
      sessionId,
      proposal: {
        sections: proposal.sections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content,
          wordCount: s.wordCount,
        })),
      },
      tenderId,
    });
    return response.data;
  },

  /**
   * Regenerate a specific proposal section
   * @param {Object} params - Section regeneration params
   * @returns {Promise<Object>} New section content
   */
  async regenerateSection({ sectionId, sectionTitle, tenderContext, currentContent, instructions }) {
    const response = await api.post('/pdf/regenerate-section', {
      sectionId,
      sectionTitle,
      tenderContext,
      currentContent,
      instructions,
    });
    return response.data;
  },
};

export default pdfAnalysisService;
