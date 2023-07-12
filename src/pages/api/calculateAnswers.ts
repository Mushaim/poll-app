import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      

      const { questionId, optionId,session } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (!optionId) {
        return res.status(400).json({ error: 'No option selected' });
      }
      const existingAnswer = await prisma.answer.findFirst({
        where: {
          questionId: parseInt(questionId),
          userId: user.id,
        },
      });

      if (existingAnswer) {
        return res
          .status(409)
          .json({ error: 'User has already answered the question' });
      }
      

      const answer = await prisma.answer.create({
        data: {
          option: { connect: { id: parseInt(optionId) } },
          question: { connect: { id: parseInt(questionId) } },
          user: { connect: { id: user.id } },
        },
        include: { question: { include: { options: true, answers: true } } },
      });

      if (!answer.question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const optionCounts: Record<number, number> = {};
      answer.question.options.forEach((option) => {
        optionCounts[option.id] = 0;
      });

      answer.question.answers.forEach((answer) => {
        optionCounts[answer.optionId]++;
      });

      const totalAnswers = answer.question.answers.length;
      const percentageMap: Record<number, number> = {};
      answer.question.options.forEach((option) => {
        const percentage =
          totalAnswers > 0 ? (optionCounts[option.id] / totalAnswers) * 100 : 0;
        percentageMap[option.id] = percentage;
      });

      const result = {
        answer,
        question: answer.question,
        percentages: percentageMap,
      };

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to submit answer' });
    } finally {
      await prisma.$disconnect();
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
