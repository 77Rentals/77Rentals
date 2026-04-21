import { GuestRequirement, PartnershipResponse } from '@/data/partnerHub';

/**
 * Hook for managing Partner Hub data with localStorage persistence
 */
export function usePartnerHub() {
  /**
   * Get all requirements or filter by ID
   */
  const getRequirements = (id?: string): GuestRequirement[] => {
    const data = localStorage.getItem('partnerRequirements');
    const requirements: GuestRequirement[] = data ? JSON.parse(data) : [];
    return id ? requirements.filter((r) => r.id === id) : requirements;
  };

  /**
   * Add a new requirement
   */
  const addRequirement = (req: GuestRequirement): void => {
    const reqs = getRequirements();
    reqs.push(req);
    localStorage.setItem('partnerRequirements', JSON.stringify(reqs));
  };

  /**
   * Update an existing requirement
   */
  const updateRequirement = (id: string, updates: Partial<GuestRequirement>): void => {
    const reqs = getRequirements();
    const index = reqs.findIndex((r) => r.id === id);
    if (index !== -1) {
      reqs[index] = { ...reqs[index], ...updates };
      localStorage.setItem('partnerRequirements', JSON.stringify(reqs));
    }
  };

  /**
   * Get all responses, optionally filtered by requirement ID
   */
  const getResponses = (requirementId?: string): PartnershipResponse[] => {
    const data = localStorage.getItem('partnerResponses');
    const responses: PartnershipResponse[] = data ? JSON.parse(data) : [];
    return requirementId ? responses.filter((r) => r.requirementId === requirementId) : responses;
  };

  /**
   * Add a new response
   */
  const addResponse = (resp: PartnershipResponse): void => {
    const resps = getResponses();
    resps.push(resp);
    localStorage.setItem('partnerResponses', JSON.stringify(resps));
  };

  /**
   * Update an existing response
   */
  const updateResponse = (id: string, updates: Partial<PartnershipResponse>): void => {
    const resps = getResponses();
    const index = resps.findIndex((r) => r.id === id);
    if (index !== -1) {
      resps[index] = { ...resps[index], ...updates };
      localStorage.setItem('partnerResponses', JSON.stringify(resps));
    }
  };

  /**
   * Get count of open requirements
   */
  const getOpenRequirementsCount = (): number => {
    return getRequirements().filter((r) => r.status === 'open').length;
  };

  /**
   * Get count of responses for a specific requirement
   */
  const getResponseCountForRequirement = (requirementId: string): number => {
    return getResponses(requirementId).length;
  };

  /**
   * Get responses by owner email
   */
  const getResponsesByOwner = (ownerEmail: string): PartnershipResponse[] => {
    return getResponses().filter((r) => r.ownerContact.email === ownerEmail);
  };

  /**
   * Delete a requirement by ID
   */
  const deleteRequirement = (id: string): void => {
    const reqs = getRequirements();
    const filtered = reqs.filter((r) => r.id !== id);
    localStorage.setItem('partnerRequirements', JSON.stringify(filtered));
  };

  return {
    getRequirements,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    getResponses,
    addResponse,
    updateResponse,
    getOpenRequirementsCount,
    getResponseCountForRequirement,
    getResponsesByOwner,
  };
}
