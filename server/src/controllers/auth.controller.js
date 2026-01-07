import { AuthService } from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const result = await AuthService.register({ email, password, name });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}
