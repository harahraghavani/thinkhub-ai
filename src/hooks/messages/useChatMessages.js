import { useContext } from "react";
import { MessagesContext } from "@/context/message/MessagesContext";

export const useChatMessages = () => useContext(MessagesContext);
