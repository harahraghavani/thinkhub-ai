"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaHistory } from "react-icons/fa";

const ChatHistoryBtn = () => {
  const router = useRouter();
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
            aria-label="Chat History"
            icon={<FaHistory />}
            variant="solid"
            rounded={"xl"}
            size={"md"}
            onClick={() => {
              router.push("chat/history");
            }}
          />
        </Tooltip>
      </Box>
    )
  );
};

export default ChatHistoryBtn;
