import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';

export const AuthService = {
  async login(email, password) {
    // TODO: replace with real user lookup
    const ok = email && password;
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { sub: email, role: 'bidder' },
      getEnv('JWT_SECRET', 'dev-secret'),
      { expiresIn: '7d' }
    );
    return { token, user: { email, name: 'Demo User', role: 'bidder' } };
  },
  async register({ email, password, name }) {
    // TODO: persist user in DB
    const passwordHash = await bcrypt.hash(password, 10);
    return { id: Date.now(), email, name, passwordHash };
  },
};
