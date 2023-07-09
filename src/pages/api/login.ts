import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';

async function handleRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST requests are allowed.' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email and password do not match.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred while trying to log in. Please try again later.' });
  }
}

export default handleRequest;
