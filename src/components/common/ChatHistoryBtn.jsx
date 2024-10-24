"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaHistory } from "react-icons/fa";

const ChatHistoryBtn = () => {
  const { accessToken } = useFirebase();

  return (
    accessToken && (
      <Box position="absolute" top={150} left={5}>
        <Tooltip
          label="Chat History"
          fontSize={"sm"}
          hasArrow
          placement="right"
          ml={1}
        >
          <IconButton
            aria-label="Create New Chat"
            icon={<FaHistory />}
            variant="solid"
            rounded={"xl"}
            size={"md"}
          />
        </Tooltip>
      </Box>
    )
  );
};

export default ChatHistoryBtn;
