"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { useParams, useRouter } from "next/navigation";
import FormInput from "../form/FromInput";
import {
  Box,
  Container,
  Flex,
  IconButton,
  Skeleton,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { HiMiniCheck, HiOutlineSparkles } from "react-icons/hi2";
import { PiCopySimple } from "react-icons/pi";
import Markdown from "react-markdown";
import { MdDownload } from "react-icons/md";
import Image from "next/image";
import { ROLE_ASSISTANT, ROLE_USER } from "@/constant/appConstant";
import ChatLoading from "../common/ChatLoading";
import GradientLoader from "../home/GradientLoader";
import { useForm } from "react-hook-form";
import CommonModal from "../common/CommonModal";
import AuthModalContent from "../common/AuthModalContent";
import { useMarkdownTheme } from "@/hooks/markdownTheme/useMarkdownTheme";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

const ShareChat = () => {
  const params = useParams();
  const router = useRouter();
  const chatEndRef = useRef(null);

  const { customMarkdownTheme } = useMarkdownTheme();

  // react hook form
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const inputValue = watch("promptInput");

  // Custome hooks
  const {
    accessToken,
    firebaseMethods,
    states,
    startChatBtnClick,
    isChatGenerating,
  } = useFirebase();

  const { messages, user, getMessageLoader } = states;
  const { getChatByChatID, isCurrentUserChat, getChatById } = firebaseMethods;

  // States
  const [isCopied, setIsCopied] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const [isImageGeneration, setIsImageGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Chakra UI Hooks
  const {
    isOpen: openAuthModal,
    onClose: closeAuthModal,
    onOpen: toggleAuthModal,
  } = useDisclosure();
  const { colorMode } = useColorMode();

  const getCurrentUserStatus = useCallback(async () => {
    setIsLoading(true);
    const isCurrentUser = await isCurrentUserChat(params?.id);
    if (isCurrentUser) {
      router.replace(`/chat/${params?.id}`);
    } else {
      if (accessToken) {
        const newId = uuidv4();
        await getChatById(params?.id, newId);
        router.push(`/chat/${newId}`);
      } else {
        await getChatByChatID(params?.id);
        setIsStreamComplete(true);
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  const handleSendMessage = async () => {
    if (!accessToken) {
      handleOpenAuthModal();
      return;
    }
  };

  const handleOpenAuthModal = () => {
    toggleAuthModal();
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (params?.id) {
      getCurrentUserStatus();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Container
        maxWidth={{
          base: "90%",
          md: "2xl",
        }}
        display="flex"
        flexDirection="column"
        overflow={"hidden"}
        padding={0}
      >
        <Flex direction="column" height="calc(100vh - 80px)" width={"100%"}>
          <Flex flex={1} direction="column" overflow="hidden">
            <Box
              flex={1}
              overflowY="auto"
              px={{
                base: 0,
                md: 0,
              }}
              py={4}
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {params?.id && isLoading ? (
                <GradientLoader />
              ) : (
                <>
                  <VStack align="stretch" mx={0} width="100%">
                    {messages &&
                      messages.length > 0 &&
                      messages?.map((msg, index) => {
                        return (
                          <Fragment key={msg.text}>
                            <Flex
                              key={index}
                              align={
                                msg.role === ROLE_USER
                                  ? "flex-end"
                                  : "flex-start"
                              }
                              direction="column"
                              w="full"
                              mb={msg.role === ROLE_USER ? 8 : 0}
                            >
                              <Flex
                                align="unset"
                                gap={msg.role === ROLE_USER ? 0 : 4}
                                width={
                                  msg.role === ROLE_USER ? "unset" : "100%"
                                }
                              >
                                {msg.role === ROLE_ASSISTANT &&
                                  (msg.isLoading || msg.isImgLoading ? (
                                    <ChatLoading />
                                  ) : (
                                    <Box>
                                      <HiOutlineSparkles size={30} />
                                    </Box>
                                  ))}
                                <Box
                                  bg={
                                    msg.role === ROLE_USER
                                      ? colorMode === "light"
                                        ? "gray.200"
                                        : "gray.600"
                                      : colorMode === "light"
                                      ? ""
                                      : ""
                                  }
                                  px={msg.role === ROLE_USER ? 4 : 0}
                                  py={msg.role === ROLE_USER ? 2.5 : 0}
                                  borderRadius="lg"
                                  transition="background 0.3s ease-in"
                                  width={"100%"}
                                  overflow={"auto"}
                                >
                                  {msg.role === ROLE_ASSISTANT ? (
                                    isImageGeneration && msg.isImgLoading ? (
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={5}
                                      >
                                        <Text>Generating Image...</Text>
                                        <Box position="relative" width="100%">
                                          <Skeleton
                                            width="100%"
                                            height={{
                                              base: 300,
                                              md: 600,
                                            }}
                                            borderRadius="10px"
                                            fadeDuration={0.3}
                                            speed={0.7}
                                            position="relative"
                                          />
                                          <Box
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            style={{
                                              transform:
                                                "translate(-50%, -50%)",
                                            }}
                                          >
                                            <Spinner
                                              size={{
                                                base: "lg",
                                                md: "xl",
                                              }}
                                              thickness="2px"
                                            />
                                          </Box>
                                        </Box>
                                      </Box>
                                    ) : msg?.image ? (
                                      <Box
                                        borderRadius={"md"}
                                        mb={8}
                                        position="relative"
                                        className="group"
                                      >
                                        <Image
                                          src={msg?.image?.secure_url}
                                          alt="intellihub-ai"
                                          width={msg?.image?.width}
                                          height={msg?.image?.height}
                                          style={{
                                            borderRadius: "10px",
                                          }}
                                          quality={100}
                                        />
                                        <IconButton
                                          aria-label="Download image"
                                          icon={<MdDownload color={"black"} />}
                                          position="absolute"
                                          top={{
                                            base: "10%",
                                            md: "5%",
                                          }}
                                          right={"-7px"}
                                          transform="translate(-50%, -50%)"
                                          opacity={{
                                            base: 100,
                                            md: 0,
                                          }}
                                          rounded="full"
                                          background="white"
                                          transition="opacity 0.2s"
                                          _groupHover={{ opacity: 1 }}
                                          _hover={{
                                            background: "white",
                                          }}
                                          onClick={() => {
                                            if (msg?.image?.secure_url) {
                                              saveAs(
                                                msg.image.secure_url,
                                                `${msg?.image?.public_id}.jpg`
                                              );
                                            }
                                          }}
                                        />
                                      </Box>
                                    ) : msg.isLoading ? (
                                      <Text>Intellihub is thinking...</Text>
                                    ) : (
                                      <Markdown
                                        components={customMarkdownTheme}
                                        rehypePlugins={[[remarkGfm]]}
                                      >
                                        {msg.content}
                                      </Markdown>
                                    )
                                  ) : (
                                    <Text whiteSpace="pre-wrap">
                                      {msg?.content?.trim()}
                                    </Text>
                                  )}
                                </Box>
                              </Flex>
                              {msg.role === ROLE_ASSISTANT &&
                                !msg.isLoading &&
                                isStreamComplete &&
                                !msg.image && (
                                  <Box>
                                    {isCopied && selectedIndex === index ? (
                                      <IconButton
                                        bg="transparent"
                                        icon={<HiMiniCheck size={20} />}
                                        _hover={{ bg: "transparent" }}
                                        _active={{ bg: "transparent" }}
                                        _focusVisible={{
                                          bg: "transparent",
                                          outline: "none",
                                        }}
                                        cursor="default"
                                      />
                                    ) : (
                                      <IconButton
                                        bg="transparent"
                                        icon={<PiCopySimple size={20} />}
                                        _hover={{ bg: "transparent" }}
                                        _active={{ bg: "transparent" }}
                                        _focusVisible={{
                                          bg: "transparent",
                                          outline: "none",
                                        }}
                                        onClick={() =>
                                          handleCopy(msg.content, index)
                                        }
                                      />
                                    )}
                                  </Box>
                                )}
                            </Flex>
                          </Fragment>
                        );
                      })}
                  </VStack>
                  <div ref={chatEndRef} />
                </>
              )}
            </Box>
          </Flex>
          <Box as="footer" py={4}>
            <FormInput
              name="promptInput"
              id="promptInput"
              register={register}
              errors={errors}
              rules={{}}
              placeHolderText={
                isImageGeneration
                  ? "Describe what you want to generate"
                  : "Message IntelliHub"
              }
              sendOnClick={async () => {
                await handleSendMessage();
              }}
              btnDisabled={!inputValue}
              labelMargin="0"
            />
          </Box>
        </Flex>
      </Container>
      {openAuthModal && (
        <CommonModal
          isOpen={openAuthModal}
          onClose={closeAuthModal}
          title="Authorization Required"
        >
          <AuthModalContent />
        </CommonModal>
      )}
    </>
  );
};

export default ShareChat;
