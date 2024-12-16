"use client";
import CreateNewChatBtn from "@/components/common/CreateNewChatBtn";
import { Button, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import NoDataFound from "@/components/common/NoDataFound";
import { GREETINGS_KEYWORDS } from "@/constant/appConstant";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { formateString, truncateText } from "@/utility/utils/utils";
import { RiDeleteBin6Line } from "react-icons/ri";
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
import { useEffect, useState } from "react";
import CommonModal from "@/components/common/CommonModal";

export default function ChatHistoryComponent() {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isTablet] = useMediaQuery("(min-width: 600px)");
  const { colorMode } = useColorMode();
  const { firebaseMethods, states } = useFirebase();
  const { user, chatHistory, isChatLoading, isDeleting } = states;
  const { getChatHistoryData, deleteChatHistoryById } = firebaseMethods;
  const [selectedChatId, setSelectedChatId] = useState(null);

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
          <Text fontWeight="bold">
            {truncateText(
              formateString(userMessage.content),
              isTablet ? 40 : 20
            )}
          </Text>
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

  const handleCloseModal = () => {
    onClose();
    setSelectedChatId(null);
  };

  useEffect(() => {
    user && getChatHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
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
        <Flex
          direction="column"
          height="calc(100vh - 80px)"
          width="100%"
          py={5}
        >
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
                      const chatId = chat?.chatId;
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
                            position="relative"
                            _hover={{
                              "& .delete-icon": {
                                opacity: { base: 1, md: 1 },
                                visibility: { base: "visible", md: "visible" },
                              },
                            }}
                            onClick={() => {
                              if (chatId) {
                                router.push(`/chat/${chatId}`);
                              }
                            }}
                          >
                            <CardBody p={3}>
                              {content}
                              <Box
                                className="delete-icon"
                                position="absolute"
                                top={2}
                                right={2}
                                opacity={{ base: 1, md: 0 }}
                                visibility={{ base: "visible", md: "hidden" }}
                                transition="all 0.2s"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedChatId(chatId);
                                  onOpen();
                                }}
                                p={2}
                                borderRadius="full"
                                _hover={{
                                  bg:
                                    colorMode === "dark"
                                      ? "whiteAlpha.200"
                                      : "blackAlpha.50",
                                }}
                              >
                                <RiDeleteBin6Line />
                              </Box>
                            </CardBody>
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
      {isOpen && (
        <CommonModal title="Delete Chat" isOpen onClose={handleCloseModal}>
          <Box display="flex" flexDirection="column" gap={5}>
            <Box>
              <Text>Do you want to permanently delete this chat?</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" gap={3}>
              <Button
                variant="outline"
                colorScheme="red"
                width="100%"
                onClick={async () => {
                  await deleteChatHistoryById(selectedChatId);
                  handleCloseModal();
                }}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                variant="solid"
                onClick={handleCloseModal}
                colorScheme="green"
                width="100%"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CommonModal>
      )}
    </>
  );
}
