/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../form/FromInput";
import {
  FLUX_1_SCHNELL,
  ROLE_ASSISTANT,
  ROLE_USER,
} from "@/constant/appConstant";
import { v4 as uuidv4 } from "uuid";
import { MdDownload } from "react-icons/md";

import { PiCopySimple } from "react-icons/pi";
import { HiMiniCheck } from "react-icons/hi2";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Container,
  Flex,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useDisclosure,
  Badge,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Skeleton,
  useToast,
  Button,
} from "@chakra-ui/react";

import { generateStreamedTextData } from "@/server/server";
import { readStreamableValue } from "ai/rsc";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import CommonModal from "./CommonModal";
import AuthModalContent from "./AuthModalContent";
import { useChangeModel } from "@/hooks/changeModel/useChangeModel";
import { useParams, useRouter } from "next/navigation";
import GradientLoader from "../home/GradientLoader";
import { formateString } from "@/utility/utils/utils";
import { FaRegQuestionCircle } from "react-icons/fa";
import Image from "next/image";
import { saveAs } from "file-saver";
import ChatLoading from "./ChatLoading";
import { useMarkdownTheme } from "@/hooks/markdownTheme/useMarkdownTheme";
import { Logo } from "@/utility/utils/svg";

const Home = () => {
  const { customMarkdownTheme } = useMarkdownTheme();

  const chatEndRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const toast = useToast();

  // Chakra UI Hooks
  const {
    isOpen: openAuthModal,
    onClose: closeAuthModal,
    onOpen: toggleAuthModal,
  } = useDisclosure();
  const { colorMode } = useColorMode();

  const {
    isOpen: openPreviewModal,
    onClose: closePreviewModal,
    onOpen: togglePreviewModal,
  } = useDisclosure();

  // States
  const [isCopied, setIsCopied] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const [isImageGeneration, setIsImageGeneration] = useState(false);
  const [isError, setIsError] = useState(false);
  const selectedImgSrc = useRef(null);

  // Custome hooks
  const {
    accessToken,
    firebaseMethods,
    states,
    startChatBtnClick,
    isChatGenerating,
  } = useFirebase();

  const { messages, user, getMessageLoader, setMessages } = states;

  const { createMessageReference, getChatByChatID } = firebaseMethods;
  const { selectedAIModel } = useChangeModel();

  // react hook form
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const inputValue = watch("promptInput");

  const handleCopy = (text, index) => {
    // Check if the text is a code block
    const plainText = formateString(text);

    navigator.clipboard.writeText(plainText).then(() => {
      setSelectedIndex(index);
      setIsCopied(true);
      // Revert back to copy icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
        setSelectedIndex(null);
      }, 2000);
    });
  };

  const handleOpenAuthModal = () => {
    toggleAuthModal();
  };

  const handleSendMessage = async (prompt) => {
    if (!accessToken) {
      handleOpenAuthModal();
      return;
    }

    startChatBtnClick.current = true;
    isChatGenerating.current = true;
    setIsStreamComplete(false);
    const newUserMessage = {
      role: ROLE_USER,
      content: inputValue?.trim(),
      timestamp: Date.now(),
    };

    if (!isError && !prompt) {
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    }

    // Start with an empty assistant message
    const newAssistantMessage = {
      role: ROLE_ASSISTANT,
      content: "",
      isLoading: true,
      isImgLoading: true,
    };
    setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

    setValue("promptInput", "");
    const {
      output,
      isError: responseError,
      error,
    } = await generateStreamedTextData({
      messages: [...messages, newUserMessage],
      model: selectedAIModel,
      prompt: prompt ?? inputValue,
      isImageGeneration,
    });

    if (responseError) {
      setIsError(true);
      setMessages((prevMessages) => {
        // Remove the last message (assistant message)
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        return updatedMessages;
      });
      toast({
        title: error,
        status: "error",
        duration: 3000,
        position: "bottom",
        isClosable: true,
      });
      setIsImageGeneration(false);
      setIsStreamComplete(false);
      isChatGenerating.current = false;
      return;
    }

    if (isImageGeneration) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: "Image Generation",
          isLoading: false,
          image: output,
          isImgLoading: false,
        };
        return updatedMessages;
      });
      setIsImageGeneration(false);
    } else {
      let fullContent = "";

      for await (const delta of readStreamableValue(output)) {
        fullContent += delta;
        // Update the last message (assistant's message) with the new content
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: fullContent,
            isLoading: false,
            isImgLoading: false,
            image: null,
          };
          return updatedMessages;
        });
      }
    }
    setIsError(false);
    setIsImageGeneration(false);
    setIsStreamComplete(true);
    isChatGenerating.current = false;
  };

  const storeDataInFirebase = async (messagesToStore) => {
    const chatId = params?.id ? params.id : uuidv4();
    startChatBtnClick.current &&
      createMessageReference(messagesToStore, chatId);
    !params?.id && router.replace(`/chat/${chatId}`);
    startChatBtnClick.current = false;
  };

  useEffect(() => {
    if (isStreamComplete) {
      storeDataInFirebase(messages);
    }
  }, [isStreamComplete, messages, storeDataInFirebase]);

  useEffect(() => {
    if (user && params?.id) {
      getChatByChatID(params?.id);
      setIsStreamComplete(true);
    }
    // eslint-disable-next-line
  }, [user, params?.id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isBtnDisable = () => {
    if (isChatGenerating.current) {
      return true;
    }
    if (!inputValue) {
      return true;
    }
    return false;
  };

  return (
    <Fragment>
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
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {params?.id && getMessageLoader ? (
                <GradientLoader />
              ) : (
                <>
                  <VStack align="stretch" mx={0} width="100%">
                    {messages &&
                      messages.length > 0 &&
                      messages?.map((msg, index) => {
                        return (
                          <Fragment key={index}>
                            <Flex
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
                                {msg.role === ROLE_ASSISTANT && (
                                  <Box>
                                    <Logo
                                      colorMode={colorMode}
                                      isLoading={
                                        msg.isLoading || msg.isImgLoading
                                      }
                                    />
                                  </Box>
                                )}
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
                                            <ChatLoading />
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
                                            cursor: "pointer",
                                          }}
                                          quality={100}
                                          priority
                                          onClick={async () => {
                                            selectedImgSrc.current = msg?.image;
                                            setTimeout(() => {
                                              togglePreviewModal();
                                            }, 100);
                                          }}
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
            {accessToken && (
              <Flex
                justify="space-between"
                alignItems={{
                  base: "flex-start",
                  md: "center",
                }}
                flexDirection={{
                  base: "column",
                  md: "row",
                }}
                gap={{
                  base: 1,
                  md: 0,
                }}
              >
                <Badge
                  variant="subtle"
                  colorScheme="gray"
                  textTransform={"none"}
                  rounded={"full"}
                  letterSpacing={0.3}
                  px={3}
                >
                  <Text
                    as="span"
                    fontWeight="extrabold"
                    textTransform="uppercase"
                  >
                    {isImageGeneration ? FLUX_1_SCHNELL : selectedAIModel}
                  </Text>
                </Badge>
                <Flex
                  alignItems="center"
                  pr={{
                    base: 0,
                    md: 1.2,
                  }}
                  pl={{
                    base: 2,
                    md: 0,
                  }}
                >
                  <Badge
                    colorScheme="transparent"
                    textTransform={"none"}
                    rounded={"full"}
                    letterSpacing={0.3}
                    padding={0}
                  >
                    Want to generate an image
                  </Badge>
                  <Popover placement="top">
                    <PopoverTrigger>
                      <IconButton
                        size="sm"
                        background="transparent"
                        _hover={{
                          background: "transparent",
                        }}
                      >
                        <FaRegQuestionCircle />
                      </IconButton>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Badge
                          colorScheme="transparent"
                          textTransform={"none"}
                          rounded={"full"}
                          letterSpacing={0.3}
                          padding={0}
                        >
                          Toogle the switch to enable image generation
                        </Badge>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Switch
                    size="sm"
                    isChecked={isImageGeneration}
                    onChange={() => {
                      setIsImageGeneration(!isImageGeneration);
                    }}
                  />
                </Flex>
              </Flex>
            )}
            {isError ? (
              <Box
                display="flex"
                justifyContent={{
                  base: "flex-start",
                  md: "center",
                }}
              >
                <Button
                  onClick={async () => {
                    const filteredArray = messages?.filter?.(
                      (item) => item?.role === ROLE_USER
                    );
                    const prompt =
                      filteredArray[filteredArray.length - 1].content;
                    setIsError(false);

                    await handleSendMessage(prompt);
                  }}
                >
                  Regenerate
                </Button>
              </Box>
            ) : (
              <FormInput
                name="promptInput"
                id="promptInput"
                register={register}
                errors={errors}
                rules={{}}
                placeHolderText={
                  isImageGeneration
                    ? "Describe what you want to generate"
                    : "Message ThinkHub"
                }
                sendOnClick={async () => {
                  await handleSendMessage();
                }}
                btnDisabled={isBtnDisable()}
                labelMargin="0"
              />
            )}
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
      {openPreviewModal && (
        <CommonModal
          isOpen={openPreviewModal}
          onClose={() => {
            closePreviewModal();
            selectedImgSrc.current = null;
          }}
          maxWidth="lg"
          outsideAllowed
          blurValue={20}
        >
          <Box display="flex" flexDirection="column" gap={5} pt={2}>
            <Image
              src={selectedImgSrc?.current?.secure_url}
              alt="intellihub-ai"
              width={selectedImgSrc?.current?.width}
              height={selectedImgSrc?.current?.height}
              style={{
                borderRadius: "5px",
              }}
              quality={100}
              priority
            />
            <Button
              onClick={() => {
                if (selectedImgSrc?.current?.secure_url) {
                  saveAs(
                    selectedImgSrc?.current?.secure_url,
                    `${selectedImgSrc?.current?.public_id}.jpg`
                  );
                }
              }}
              colorScheme="blue"
              rightIcon={<MdDownload />}
            >
              Download
            </Button>
          </Box>
        </CommonModal>
      )}
    </Fragment>
  );
};

export default Home;
