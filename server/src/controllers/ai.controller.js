import { AIService } from '../services/ai.service.js';

export async function askAI(req, res, next) {
  try {
    const { prompt } = req.body;
    const answer = await AIService.ask(prompt);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
}
