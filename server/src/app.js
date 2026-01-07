import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { loadEnv } from './config/env.js';

// Load environment variables
loadEnv();

// Routes
import authRoutes from './routes/auth.routes.js';
import tenderRoutes from './routes/tender.routes.js';
import aiRoutes from './routes/ai.routes.js';
import proposalRoutes from './routes/proposal.routes.js';

// Error handler
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/proposals', proposalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

export default app;
