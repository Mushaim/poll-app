import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Option {
  id: number;
  value: string;
  questionId: number;
}

interface Question {
  id: number;
  title: string;
  options: Option[];
  answer: string;
  submittedAt: Date;
  timeDifference: string;
}

interface ApiResponse {
  questions: Question[];
}

const DisplayQuestionsContainer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<any>(null);

  const getSessionData = async () => {
    try {
      const session = await getServerSession();
      if (!session) {
        router.push('/login'); 
      } 
      else {
        setSession(session);
        console.log(JSON.stringify(session))
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = (questionId: number) => {
    window.location.href = `/PollContainer?questionId=${questionId}`;
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/displayQuestion');
      const data: ApiResponse = await response.json();

      const updatedQuestions = data.questions.map((question) => {
        const submittedAt = new Date(question.submittedAt);
        const currentTime = new Date();
        const timeDifference = getTimeDifference(submittedAt, currentTime);
        return {
          ...question,
          timeDifference,
        };
      });

      setQuestions(updatedQuestions);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeDifference = (submittedAt: Date, currentTime: Date) => {
    const timeDiff = Math.abs(currentTime.getTime() - submittedAt.getTime());
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  const router = useRouter();

  const handleCreatePoll = () => {
    router.push('/CreatePollContainer');
  };

  return (
    <>
          {/* Render user session information */}
          {session && (
        <div className="flex justify-end mt-4 mr-4">
          <p className="text-gray-500">Logged in as: {JSON.stringify(session)}</p>
        </div>
      )}

      <div className="flex justify-end mt-4 mr-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleCreatePoll}
        >
          Create Poll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mx-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border border-lavender-200 p-4 text-center cursor-pointer"
            onClick={() => handleQuestionClick(question.id)}
          >
            <a className="text-blue-500 font-bold underline">{question.title}</a>
            <p>Submitted {question.timeDifference}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisplayQuestionsContainer;
