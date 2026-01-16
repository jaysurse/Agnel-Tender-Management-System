/**
 * Proposal Publish Service
 *
 * Client-side service for proposal publishing workflow.
 * Currently provides stub methods - ready to connect to backend when available.
 *
 * @module proposalPublishService
 */

import api from './api';

/**
 * Proposal statuses in the publishing workflow
 */
export const PROPOSAL_STATUS = {
  DRAFT: 'DRAFT',
  FINAL: 'FINAL',
  PUBLISHED: 'PUBLISHED',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

/**
 * Status transition rules
 */
export const STATUS_TRANSITIONS = {
  DRAFT: ['FINAL'],
  FINAL: ['DRAFT', 'PUBLISHED'],
  PUBLISHED: [], // Cannot transition from PUBLISHED
  SUBMITTED: [], // Cannot transition from SUBMITTED
  UNDER_REVIEW: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: [],
  REJECTED: []
};

export const proposalPublishService = {
  /**
   * Finalize a proposal (DRAFT → FINAL)
   *
   * @param {string} proposalId - The proposal ID to finalize
   * @returns {Promise<Object>} - Updated proposal data
   */
  finalizeProposal: async (proposalId) => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.post(`/proposals/${proposalId}/finalize`);
      // return response.data;

      // STUB: Simulate API call
      console.log(`[Publish Service] Finalizing proposal ${proposalId}`);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

      return {
        success: true,
        data: {
          proposal: {
            id: proposalId,
            status: PROPOSAL_STATUS.FINAL,
            finalizedAt: new Date().toISOString()
          }
        },
        message: 'Proposal finalized successfully'
      };
    } catch (error) {
      console.error('[Publish Service] Finalize failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to finalize proposal');
    }
  },

  /**
   * Publish a proposal (FINAL → PUBLISHED)
   *
   * @param {string} proposalId - The proposal ID to publish
   * @returns {Promise<Object>} - Updated proposal data
   */
  publishProposal: async (proposalId) => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.post(`/proposals/${proposalId}/publish`);
      // return response.data;

      // STUB: Simulate API call
      console.log(`[Publish Service] Publishing proposal ${proposalId}`);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

      return {
        success: true,
        data: {
          proposal: {
            id: proposalId,
            status: PROPOSAL_STATUS.PUBLISHED,
            publishedAt: new Date().toISOString()
          }
        },
        message: 'Proposal published successfully'
      };
    } catch (error) {
      console.error('[Publish Service] Publish failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to publish proposal');
    }
  },

  /**
   * Revert a finalized proposal back to draft (FINAL → DRAFT)
   *
   * @param {string} proposalId - The proposal ID to revert
   * @returns {Promise<Object>} - Updated proposal data
   */
  revertToDraft: async (proposalId) => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.post(`/proposals/${proposalId}/revert`);
      // return response.data;

      // STUB: Simulate API call
      console.log(`[Publish Service] Reverting proposal ${proposalId} to draft`);

      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        success: true,
        data: {
          proposal: {
            id: proposalId,
            status: PROPOSAL_STATUS.DRAFT
          }
        },
        message: 'Proposal reverted to draft'
      };
    } catch (error) {
      console.error('[Publish Service] Revert failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to revert proposal');
    }
  },

  /**
   * Create a new version of a published proposal
   *
   * @param {string} proposalId - The proposal ID to create version from
   * @returns {Promise<Object>} - New proposal version data
   */
  createNewVersion: async (proposalId) => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.post(`/proposals/${proposalId}/new-version`);
      // return response.data;

      // STUB: Simulate API call
      console.log(`[Publish Service] Creating new version of proposal ${proposalId}`);

      await new Promise(resolve => setTimeout(resolve, 1200));

      return {
        success: true,
        data: {
          proposal: {
            id: `${proposalId}_v2`, // New ID for new version
            parentProposalId: proposalId,
            version: 2,
            status: PROPOSAL_STATUS.DRAFT,
            createdAt: new Date().toISOString()
          }
        },
        message: 'New version created successfully'
      };
    } catch (error) {
      console.error('[Publish Service] Create version failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to create new version');
    }
  },

  /**
   * Get version history for a proposal
   *
   * @param {string} proposalId - The proposal ID
   * @returns {Promise<Array>} - Array of version objects
   */
  getVersionHistory: async (proposalId) => {
    try {
      // TODO: Connect to backend when available
      // const response = await api.get(`/proposals/${proposalId}/versions`);
      // return response.data;

      // STUB: Return mock version history
      console.log(`[Publish Service] Getting version history for proposal ${proposalId}`);

      return {
        success: true,
        data: {
          versions: [
            {
              version: 1,
              status: PROPOSAL_STATUS.DRAFT,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isCurrent: true
            }
          ]
        }
      };
    } catch (error) {
      console.error('[Publish Service] Get versions failed:', error);
      throw new Error('Failed to get version history');
    }
  },

  /**
   * Check if a status transition is valid
   *
   * @param {string} currentStatus - Current proposal status
   * @param {string} targetStatus - Target status to transition to
   * @returns {boolean} - Whether the transition is valid
   */
  canTransitionTo: (currentStatus, targetStatus) => {
    const validTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    return validTransitions.includes(targetStatus);
  },

  /**
   * Get the next available status for a proposal
   *
   * @param {string} currentStatus - Current proposal status
   * @returns {Array<string>} - Array of valid next statuses
   */
  getNextStatuses: (currentStatus) => {
    return STATUS_TRANSITIONS[currentStatus] || [];
  }
};

export default proposalPublishService;
