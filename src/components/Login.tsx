import React, { useRef, useContext } from "react";
import { EmailContext } from "@/context/EmailContext";
import { useRouter } from "next/router";

interface Props {
  onLoginBtnClicked: (email: string | null, password: string | undefined) => void;
  errorMessage: string;
}

const Login: React.FC<Props> = ({ onLoginBtnClicked }) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setEmail } = useContext(EmailContext);
  const router = useRouter();

  const onBtnClicked = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    onLoginBtnClicked(email || null, password);
    setEmail(email);
  };

  const navigateToRegister = () => {
    router.push("/RegisterUserContainer");
  };

  return (
    <>
      <div className="p-8 h-screen flex justify-center items-center bg-gray-100">
        <div className="w-80">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={onBtnClicked}
                className="bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                LOGIN
              </button>
            </div>
            <div className="text-center mt-4">
              <label className="text-gray-600">
                Do not have an account?{" "}
                <a className="text-indigo-500" onClick={navigateToRegister}>
                  Register now
                </a>
              </label>
            </div>
          </form>
        </div>
      </div>
      <div id="create-poll-container" data-email=""></div>
    </>
  );
};

export default Login;
