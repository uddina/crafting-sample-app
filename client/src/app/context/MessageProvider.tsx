import { createContext, useContext } from "react";
import { Message } from "../types";
import React from "react";

const MessageContext = createContext<{
  messages: Message[];
  removeMessage: (index: number) => void;
  addMessage: (message: Message) => void;
}>({
  messages: [],
  removeMessage: () => {},
  addMessage: () => {},
});

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const removeMessage = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const addMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  return (
    <MessageContext.Provider value={{ messages, removeMessage, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageProvider() {
  const { messages, removeMessage, addMessage } = useContext(MessageContext);
  return {
    messages,
    removeMessage,
    addMessage,
  };
}
