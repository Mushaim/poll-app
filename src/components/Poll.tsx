import router from 'next/router';
import React, { useState } from 'react';

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

interface PollProps {
  question: Question;
  emailRef: string;
}

const Poll: React.FC<PollProps> = ({ question, emailRef }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [percentages, setPercentages] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (optionId: number) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOptionId) {
      alert('Please select an option');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/calculateAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          optionId: selectedOptionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPercentages(data.percentages);
      } else {
        throw new Error('Failed to submit answer');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/DisplayQuestionContainer');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold my-4">{question.title}</h1>
        <ul className="space-y-2">
          {question.options.map((option) => (
            <li key={option.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="form-radio text-blue-500"
                />
                <span>{option.value}</span>
                {percentages[option.id] && (
                  <span>{`${percentages[option.id].toFixed(2)}%`}</span>
                )}
              </label>
            </li>
          ))}
        </ul>
        <button
          className={`bg-blue-500 text-white py-2 px-4 rounded mt-4 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={!selectedOptionId || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          className="bg-gray-300 text-gray-600 py-2 px-4 rounded mt-4"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Poll;
