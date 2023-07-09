import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { questionId } = req.query;

    try {
      const question = await prisma.question.findUnique({
        where: { id: Number(questionId) },
        include: {
          options: true,
          answers: true,
        },
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.status(200).json({ question });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
