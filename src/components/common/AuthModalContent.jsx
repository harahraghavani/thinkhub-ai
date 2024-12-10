"use client";

import { useRouter } from "next/navigation";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const AuthModalContent = () => {
  const router = useRouter();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const alertBg = useColorModeValue("orange.50", "rgba(251, 211, 141, 0.16)");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleAuthorize = () => {
    router.push("/login");
  };

  return (
    <Flex direction="column" gap={6}>
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="lg"
        p={6}
        bg={alertBg}
        border="1px solid"
        borderColor="orange.200"
      >
        <Box mb={4}>
          <AlertIcon boxSize="2rem" />
        </Box>

        <Flex direction="column" gap={2}>
          <Text fontSize="md" fontWeight="medium">
            To proceed with this action, please log in.
          </Text>
          <Text fontSize="sm" color={textColor}>
            Your security and privacy are important to us.
          </Text>
        </Flex>
      </Alert>

      <Flex justify="flex-end" gap={3}>
        <Button
          colorScheme="red"
          onClick={handleAuthorize}
          size="md"
          px={6}
          _hover={{
            transform: "translateY(-3px)",
            boxShadow: "xl",
          }}
          transition="all 0.2s ease-in-out"
        >
          Authorize
        </Button>
      </Flex>
    </Flex>
  );
};

export default AuthModalContent;
