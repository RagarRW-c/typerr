import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const saveAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { snippetId, language, difficulty, category, wpm, accuracy, errors, timeMs, mode } = req.body;

    if (!snippetId || !language || !difficulty || !category || wpm == null || accuracy == null || errors == null || timeMs == null || !mode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        snippetId,
        language,
        difficulty,
        category,
        wpm,
        accuracy,
        errors,
        timeMs,
        mode,
      },
    });

    res.status(201).json({
      message: 'Attempt saved successfully',
      attempt,
    });
  } catch (error) {
    console.error('Save attempt error:', error);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
};

export const getUserAttempts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { limit = 10, language, difficulty } = req.query;

    const where: any = { userId };
    if (language) where.language = language;
    if (difficulty) where.difficulty = difficulty;

    const attempts = await prisma.attempt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json({ attempts });
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ error: 'Failed to get attempts' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const attempts = await prisma.attempt.findMany({
      where: { userId },
    });

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageWpm: 0,
        bestWpm: 0,
        averageAccuracy: 0,
        totalTime: 0,
      });
    }

    const totalWpm = attempts.reduce((sum, a) => sum + a.wpm, 0);
    const totalAccuracy = attempts.reduce((sum, a) => sum + a.accuracy, 0);
    const totalTime = attempts.reduce((sum, a) => sum + a.timeMs, 0);
    const bestWpm = Math.max(...attempts.map(a => a.wpm));

    res.json({
      totalAttempts: attempts.length,
      averageWpm: totalWpm / attempts.length,
      bestWpm,
      averageAccuracy: totalAccuracy / attempts.length,
      totalTime,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};