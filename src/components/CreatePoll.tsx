import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  onSubmitBtnClicked: (questionsWithAnswers: { question: string; options: string[] }) => void;
}

const CreatePoll: React.FC<Props> = ({ onSubmitBtnClicked }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const router = useRouter();

  const handleAddTextField = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (options.length < 2) {
      setOptions([...options, '']);
    } else if (options.length === 2) {
      setOptions([...options, 'option3', 'option4']);
    }
  };

  const handleCancelClick = () => {
    router.push('/DisplayQuestionContainer');
  };

  const handleSubmitClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const questionsWithAnswers = {
      question: question,
      options: options,
    };

    await onSubmitBtnClicked(questionsWithAnswers);
    router.push('/DisplayQuestionContainer');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 max-w-sm bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
        <div className="text-2xl font-medium">Create Poll</div>
        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your question here"
            className="w-full h-20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="w-full space-y-2">
            {options.map((value, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleAddTextField}
          >
            Add Option
          </button>
          <div className="space-x-2">
            <button
              type="submit"
              className="bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmitClick}
            >
              SUBMIT
            </button>
            <button
              type="button"
              className="bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancelClick}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
