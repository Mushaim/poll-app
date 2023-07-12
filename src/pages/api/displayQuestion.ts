import { PrismaClient, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { useSession } from 'next-auth/react';

const prisma = new PrismaClient();

const displayQuestionHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        options: true,
        answer: true,
        submittedAt: true,
      },
    });

    const formattedQuestions = questions.map((question) => {
      return {
        ...question,
        submittedAt: question.submittedAt.toString(), 
      };
    });

    res.status(200).json({ questions: formattedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the questions' });
  }
};

export default displayQuestionHandler;
