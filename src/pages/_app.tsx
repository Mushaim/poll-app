import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import EmailProvider from '../context/EmailContext';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <EmailProvider>
      <Component {...pageProps} />
    </EmailProvider>
  );
};

export default MyApp;

