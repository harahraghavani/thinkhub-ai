"use client";

import { useRouter } from "next/navigation";
import { Alert, AlertIcon, Box, Button, Flex } from "@chakra-ui/react";

const AuthModalContent = () => {
  const router = useRouter();

  const handleAuthorize = () => {
    router.push("/login");
  };

  return (
    <Flex direction="column" gap={5} py={2}>
      <Box>
        <Alert status="warning">
          <AlertIcon />
          To proceed with this action, please log in.
          <br /> Your security and privacy are important to us.
        </Alert>
      </Box>
      <Flex justifyContent="flex-end">
        <Button colorScheme="red" onClick={handleAuthorize}>
          Authorise
        </Button>
      </Flex>
    </Flex>
  );
};

export default AuthModalContent;
