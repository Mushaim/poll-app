import Login from "@/components/Login";
import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";

const LoginContainer: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onLoginBtnClicked = async (email: string | null, password: string | undefined) => {
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password fields.");
    } else {
      setErrorMessage("");
      try {
        const data = await signIn('credentials', {
          email: email,
          password: password,
          redirect:false
        });

        if (data) {
          router.push(`/DisplayQuestionContainer`);
        } else {
          console.log(data);
          setErrorMessage("Email and password do not match.");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("An error occurred while trying to log in. Please try again later.");
      }
    }
  };

  return (
    <>
      <Login
        onLoginBtnClicked={onLoginBtnClicked}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default LoginContainer;
