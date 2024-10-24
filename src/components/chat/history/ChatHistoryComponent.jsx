"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

const ChatHistoryComponent = () => {
  const { firebaseMethods, states } = useFirebase();
  const { user } = states;
  const { getChatHistoryData } = firebaseMethods;

  useEffect(() => {
    if (user) {
      getChatHistoryData();
    }
  }, [user]);

  return <Box>Chat History</Box>;
};

export default ChatHistoryComponent;
