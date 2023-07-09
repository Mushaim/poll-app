import React, { createContext, useState } from 'react';

interface EmailContextProps {
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
}

export const EmailContext = createContext<EmailContextProps>({
  email: undefined,
  setEmail: () => {},
});

interface EmailProviderProps {
  children: React.ReactNode;
}

const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | undefined>(undefined);

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;
