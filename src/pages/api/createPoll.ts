import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';

const createPollHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { question, options, session} = req.body;
    console.log(question,options,session)
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Please provide a question and at least two options.' });
    } else if (options.length > 4) {
      return res.status(400).json({ error: 'Please provide a question and at most four options.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const createdQuestion = await prisma.question.create({
      data: {
        title: question,
        options: {
          create: options.map((option: string) => ({ value: option })),
        },
        userId: user.id,
      },
      include: {
        options: true,
      },
    });

    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

export default createPollHandler;
