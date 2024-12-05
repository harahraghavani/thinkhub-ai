"use client";
import CreateNewChatBtn from "@/components/common/CreateNewChatBtn";
import NoDataFound from "@/components/common/NoDataFound";
import { GREETINGS_KEYWORDS } from "@/constant/appConstant";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { formateString, truncateText } from "@/utility/utils/utils";
import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Skeleton,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatHistoryComponent() {
  const router = useRouter();
  const { colorMode } = useColorMode();
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
    const isGreeting = GREETINGS_KEYWORDS.some((greeting) =>
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
      <Box
        display={{
          base: "none",
          lg: "block",
        }}
      >
        <CreateNewChatBtn />
      </Box>
      <Flex direction="column" height="calc(100vh - 80px)" width="100%" py={5}>
        <Flex
          direction="column"
          sx={{
            paddingRight: {
              base: 0,
              md: "12px",
            },
            overflowY: {
              base: "scroll",
              md: "auto",
            },
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: {
                base: "transparent",
                md: colorMode === "dark" ? "gray.600" : "gray.300",
              },
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: {
                base: "transparent",
                md: colorMode === "dark" ? "gray.400" : "gray.500",
              },
              borderRadius: "4px",
            },
          }}
        >
          {isChatLoading ? (
            <Text>
              <Skeleton height={"60px"} borderRadius={"md"} mb={5} />
              <Skeleton height={"60px"} borderRadius={"md"} mb={5} />
              <Skeleton height={"60px"} borderRadius={"md"} mb={5} />
              <Skeleton height={"60px"} borderRadius={"md"} mb={5} />
              <Skeleton height={"60px"} borderRadius={"md"} mb={5} />
            </Text>
          ) : (
            <>
              <Grid gap={4}>
                {chatHistory?.length > 0 ? (
                  chatHistory.map((chat) => {
                    const chatId = chat?.id;
                    const content = renderChatContent(chat.messages);

                    return (
                      content && (
                        <Card
                          key={chat.id}
                          boxShadow={"inner"}
                          border={`1px solid ${
                            colorMode === "dark"
                              ? "rgba(255,255,255, 0.3)"
                              : "#ccc"
                          }`}
                          cursor={"pointer"}
                          onClick={() => {
                            if (chatId) {
                              router.push(`/chat/${chatId}`);
                            }
                          }}
                        >
                          <CardBody p={3}>{content}</CardBody>
                        </Card>
                      )
                    );
                  })
                ) : (
                  <>
                    <NoDataFound message="No chat history found" />
                  </>
                )}
              </Grid>
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
