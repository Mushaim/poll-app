import React, { useContext, useState } from "react";
import CreatePoll from "@/components/CreatePoll";
import { EmailContext } from "@/context/EmailContext";
import router from "next/router";

interface Props {
  email: string;
}

const CreatePollContainer: React.FC = () => {
  const { email } = useContext(EmailContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmitBtnClicked = async (questionsWithAnswers: {
    question: string;
    options: string[];
  }) => {
    try {
      console.log("email", email)
      console.log("questionsWithAnswers", questionsWithAnswers);
      const response = await fetch("/api/createPoll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...questionsWithAnswers, email }),
      });

      if (response.ok) {
        router.push("/DisplayQuestionContainer");
      } else {
        throw new Error("Failed to submit the poll.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CreatePoll onSubmitBtnClicked={onSubmitBtnClicked} />
    </>
  );
};

export default CreatePollContainer;
