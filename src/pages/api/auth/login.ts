import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
import prisma from '../../../../prisma/client';
import { withIronSession, Session } from 'next-iron-session';

const ironSessionConfig = {
  password: "123456789", // Provide your own session password
  cookieName: 'poll-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

async function handleRequest(req: NextApiRequest & { session: Session }, res: NextApiResponse): Promise<void> {
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

    const options: AuthOptions = {
      providers: [], // No specific provider needed for credentials-based authentication
      callbacks: {
        signIn: async ({ email }) => {
          // Save email, userID, and username in the session
          req.session.set('email', email);
          req.session.set('userID', user.id.toString());
          req.session.set('username', user.name);
          await req.session.save();

          return true; // Return true to indicate successful sign-in
        },
      },
      session: {
        strategy: 'jwt',
      },
    };

    await NextAuth(req, res, options);

    // Return the user object
    res.status(200).json(user);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred while trying to log in. Please try again later.' });
  }
}

export default withIronSession(handleRequest, ironSessionConfig);
