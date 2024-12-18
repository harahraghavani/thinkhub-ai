"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

const AuthModalContent = () => {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const alertBg = useColorModeValue("orange.50", "rgba(251, 211, 141, 0.16)");
  const textColor = useColorModeValue("gray.600", "gray.300");

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
        <Link href={isHomePage ? `/login` : `/login?chatId=${id}`}>
          <Button
            colorScheme="red"
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
        </Link>
      </Flex>
    </Flex>
  );
};

export default AuthModalContent;
