"use client";
import ChatHistoryComponent from "@/components/chat/history/ChatHistoryComponent";
import NabBar from "@/components/common/NavBar";
import { Box } from "@chakra-ui/react";

const ChatHistory = () => {
  return (
    <Box>
      <NabBar />
      <ChatHistoryComponent />
    </Box>
  );
};

export default ChatHistory;
