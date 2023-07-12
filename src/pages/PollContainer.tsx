import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Poll from '@/components/Poll';
import LoginRequired from './loginRequired';

interface Option {
  id: number;
  value: string;
  questionId: number;
}

interface Answer {
  id: number;
  optionId: number;
  questionId: number;
}

interface Question {
  id: number;
  title: string;
  options: Option[];
  answers: Answer[];
}

interface PollContainerProps {
  emailRef: string;
}

const PollContainer: React.FC<PollContainerProps> = ({ emailRef }) => {

  const [question, setQuestion] = useState<Question | null>(null);
  const router = useRouter();
  const { questionId } = router.query;

  useEffect(() => {
    if (questionId) {
      fetchQuestionData();
    }
  }, [questionId]);

  const fetchQuestionData = async () => {
    try {
      try {
        LoginRequired();
      } catch (error) {
        console.error(error);
      }
      const response = await fetch(`/api/poll?questionId=${questionId}`);
      const data = await response.json();
      setQuestion(data.question);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {question ? (
        <Poll question={question} emailRef={emailRef} />
      ) : (
        <div>Loading question...</div>
      )}
    </div>
  );
};

export default PollContainer;
