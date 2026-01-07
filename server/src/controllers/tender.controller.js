import { TenderService } from '../services/tender.service.js';

export async function listTenders(req, res, next) {
  try {
    const list = await TenderService.list();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function getTender(req, res, next) {
  try {
    const item = await TenderService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}
