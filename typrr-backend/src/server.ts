import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import attemptsRoutes from './routes/attempts.routes';
import leaderboardRoutes from './routes/leaderboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json());

// ============================
// Routes (API endpoints)
// ============================
app.use('/api/auth', authRoutes);
app.use('/api/attempts', attemptsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ============================
// 👇 DODANE: Root endpoint "/" 
// ============================
app.get('/', (req, res) => {
  res.send('✅ Typrr Backend działa poprawnie! 🚀');
});

// ============================
// Health check (dla monitoringu)
// ============================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Typrr Backend API is running!' });
});

// ============================
// Error handling middleware
// ============================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================
// Server start
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
