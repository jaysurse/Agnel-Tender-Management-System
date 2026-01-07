export const TenderService = {
  async list() {
    return [
      { id: 1, title: 'Sample Tender', status: 'draft' },
      { id: 2, title: 'Published Tender', status: 'published' },
    ];
  },
  async getById(id) {
    return { id, title: 'Sample Tender', status: 'draft' };
  },
};
