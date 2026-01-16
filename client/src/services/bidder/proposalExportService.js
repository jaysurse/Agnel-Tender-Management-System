/**
 * Proposal Export Service
 *
 * Client-side service for proposal export functionality.
 * Currently provides stub methods - ready to connect to backend when available.
 *
 * @module proposalExportService
 */

import api from './api';

/**
 * Export formats supported
 */
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  DOCX: 'docx'
};

/**
 * Export templates available
 */
export const EXPORT_TEMPLATES = {
  FORMAL: 'formal',
  MODERN: 'modern',
  MINIMAL: 'minimal'
};

export const proposalExportService = {
  /**
   * Export proposal to specified format
   *
   * @param {string} proposalId - The proposal ID to export
   * @param {Object} options - Export options
   * @param {string} options.format - Export format ('pdf' | 'docx')
   * @param {string} options.template - Template style ('formal' | 'modern' | 'minimal')
   * @returns {Promise<Blob>} - The exported file as a Blob
   *
   * @example
   * const blob = await proposalExportService.exportProposal('123', {
   *   format: 'pdf',
   *   template: 'formal'
   * });
   * downloadBlob(blob, 'proposal.pdf');
   */
  exportProposal: async (proposalId, options = {}) => {
    const { format = 'pdf', template = 'formal' } = options;

    try {
      // TODO: Connect to backend when available
      // const response = await api.get(`/proposals/${proposalId}/export`, {
      //   params: { format, template },
      //   responseType: 'blob'
      // });
      // return response.data;

      // STUB: Simulate export delay and return mock response
      console.log(`[Export Service] Exporting proposal ${proposalId} as ${format} with ${template} template`);

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing

      // Return a mock blob for now
      const mockContent = `Mock ${format.toUpperCase()} export - Proposal ID: ${proposalId}, Template: ${template}`;
      const blob = new Blob([mockContent], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      return blob;
    } catch (error) {
      console.error('[Export Service] Export failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to export proposal');
    }
  },

  /**
   * Get export preview data (for live preview in modal)
   *
   * @param {string} proposalId - The proposal ID
   * @param {string} template - Template style
   * @returns {Promise<Object>} - Preview data including structured content
   */
  getExportPreview: async (proposalId, template = 'formal') => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.get(`/proposals/${proposalId}/export/preview`, {
      //   params: { template }
      // });
      // return response.data;

      // STUB: Return mock preview data
      console.log(`[Export Service] Getting preview for proposal ${proposalId}`);

      return {
        success: true,
        data: {
          title: 'Proposal Preview',
          template,
          sections: [],
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('[Export Service] Preview failed:', error);
      throw new Error('Failed to generate preview');
    }
  },

  /**
   * Download a blob as a file
   *
   * @param {Blob} blob - The file blob
   * @param {string} filename - Desired filename
   */
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Generate filename for export
   *
   * @param {Object} proposal - Proposal object
   * @param {Object} tender - Tender object
   * @param {string} format - Export format
   * @returns {string} - Generated filename
   */
  generateFilename: (proposal, tender, format) => {
    const tenderTitle = tender?.title?.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) || 'proposal';
    const date = new Date().toISOString().split('T')[0];
    const version = proposal?.version || 1;

    return `${tenderTitle}_v${version}_${date}.${format}`;
  }
};

export default proposalExportService;
