"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

const CreateNewChatBtn = () => {
  const pathname = usePathname();
  const { accessToken, firebaseMethods } = useFirebase();
  const { createNewChat } = firebaseMethods;

  return (
    accessToken && (
      <Box position="absolute" top={100} left={5}>
        <Tooltip
          label="New Chat"
          fontSize={"sm"}
          hasArrow
          placement="right"
          ml={1}
        >
          <IconButton
            aria-label="Create New Chat"
            icon={<IoMdAdd />}
            variant="solid"
            rounded={"xl"}
            size={"md"}
            onClick={() => {
              createNewChat();
            }}
            disabled={pathname === "/"}
          />
        </Tooltip>
      </Box>
    )
  );
};

export default CreateNewChatBtn;
