"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";

const CreateNewChatBtn = () => {
  const { accessToken } = useFirebase();

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
          />
        </Tooltip>
      </Box>
    )
  );
};

export default CreateNewChatBtn;
