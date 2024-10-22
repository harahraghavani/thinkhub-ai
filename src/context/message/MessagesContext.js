"use client";

import { createContext, useState } from "react";

const MessagesContext = createContext();

const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const values = {
    messages,
    setMessages,
  };

  return (
    <MessagesContext.Provider value={values}>
      {children}
    </MessagesContext.Provider>
  );
};

export { MessagesContext, MessageProvider };
