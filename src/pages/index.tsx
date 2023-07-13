import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DisplayQuestionContainer from './DisplayQuestionContainer';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  console.log(session, status);

  const handleClick = () => {
    router.push('/DisplayQuestionContainer');
  };
  return (
    <>
      <Head>
        <title>Poll App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <DisplayQuestionContainer></DisplayQuestionContainer>
      </div>

    </>
  );
};

export default Home;