import React, { useState } from "react";
import CreatePoll from "@/components/CreatePoll";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


const CreatePollContainer: React.FC = () => {
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  

  const onSubmitBtnClicked = async (questionsWithAnswers: {
    question: string;
    options: string[];
  }) => {
    try {
      if (!session?.user?.email) {
        throw new Error("User email not found in session.");
      }
      console.log("container:", session.user.email)

      const response = await fetch("/api/createPoll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...questionsWithAnswers, session }),
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

  return <CreatePoll onSubmitBtnClicked={onSubmitBtnClicked} />;
};

export default CreatePollContainer;
