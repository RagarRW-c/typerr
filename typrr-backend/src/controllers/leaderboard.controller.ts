import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGlobalLeaderboard = async (req: Request, res: Response) => {
  try {
    const { language, difficulty, limit = 100 } = req.query;

    const where: any = {};
    if (language) where.language = language;
    if (difficulty) where.difficulty = difficulty;

    // Get best attempts per user
    const attempts = await prisma.attempt.findMany({
      where,
      orderBy: { wpm: 'desc' },
      take: Number(limit),
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    // Group by user and get best WPM
    const leaderboard = attempts.reduce((acc: any[], attempt) => {
      const existing = acc.find(item => item.userId === attempt.userId);
      
      if (!existing) {
        acc.push({
          userId: attempt.userId,
          username: attempt.user.username,
          bestWpm: attempt.wpm,
          accuracy: attempt.accuracy,
          language: attempt.language,
          difficulty: attempt.difficulty,
          createdAt: attempt.createdAt,
        });
      }
      
      return acc;
    }, []);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getLanguageLeaderboard = async (req: Request, res: Response) => {
  try {
    const { language } = req.params;
    const { limit = 50 } = req.query;

    const attempts = await prisma.attempt.findMany({
      where: { language },
      orderBy: { wpm: 'desc' },
      take: Number(limit),
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const leaderboard = attempts.reduce((acc: any[], attempt) => {
      const existing = acc.find(item => item.userId === attempt.userId);
      
      if (!existing) {
        acc.push({
          userId: attempt.userId,
          username: attempt.user.username,
          bestWpm: attempt.wpm,
          accuracy: attempt.accuracy,
          createdAt: attempt.createdAt,
        });
      }
      
      return acc;
    }, []);

    res.json({ language, leaderboard });
  } catch (error) {
    console.error('Get language leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get language leaderboard' });
  }
};