"use client";

import { customMarkdownTheme } from "@/components/common/Home";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { formateString, truncateText } from "@/utility/utils/utils";
import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatHistoryComponent() {
  const { firebaseMethods, states } = useFirebase();
  const { user, chatHistory, isChatLoading } = states;
  const { getChatHistoryData } = firebaseMethods;

  useEffect(() => {
    user && getChatHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderChatContent = (messages) => {
    if (messages.length === 0) return null;

    const userMessage = messages[0];
    let assistantMessage = messages[1];

    // Check if the first message is a greeting
    const greetings = ["hello", "hi", "hey", "greetings"];
    const isGreeting = greetings.some((greeting) =>
      userMessage.content.toLowerCase().startsWith(greeting)
    );

    if (isGreeting && messages.length > 2) {
      assistantMessage = messages[3];
    } else if (!isGreeting && messages.length > 1) {
      assistantMessage = messages[1];
    }

    return (
      <VStack align="stretch" spacing={2}>
        <Box>
          <Text fontWeight="bold">{userMessage.content}</Text>
        </Box>
        {assistantMessage && (
          <Box>
            <Text isTruncated>
              {truncateText(formateString(assistantMessage.content))}
            </Text>
          </Box>
        )}
      </VStack>
    );
  };

  return (
    <Container
      maxWidth={{
        base: "90%",
        md: "2xl",
      }}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      padding={0}
    >
      <Flex direction="column" height="calc(100vh - 80px)" width="100%" py={5}>
        <Flex direction="column" overflow="auto">
          {isChatLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Grid gap={4}>
              {chatHistory?.length > 0 ? (
                chatHistory.map((chat) => {
                  const content = renderChatContent(chat.messages);
                  return (
                    content && (
                      <Card
                        key={chat.id}
                        boxShadow={"inner"}
                        border={"1px solid #ccc"}
                      >
                        <CardBody p={3}>{content}</CardBody>
                      </Card>
                    )
                  );
                })
              ) : (
                <Text>No chat history</Text>
              )}
            </Grid>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
