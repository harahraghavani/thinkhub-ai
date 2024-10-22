"use client";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputRightElement,
  Box,
  IconButton,
  InputGroup,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

const FormInput = ({
  id,
  label,
  name,
  rules,
  register,
  type = "text",
  errors,
  placeHolderText = "",
  onChangeCallBack,
  sendOnClick,
  isLoading,
  btnDisabled,
}) => {
  const textareaRef = useRef(null);
  const [content, setContent] = useState("");

  const { colorMode } = useColorMode();
  const { ref: inputRef, onChange, ...rest } = register(name, rules);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (onChangeCallBack) {
      onChangeCallBack(e);
    }
    onChange(e);
  };

  // Auto-grow Textarea height based on input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [content]);

  return (
    <FormControl id={id} isInvalid={!!errors[name]} width={"100%"}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Textarea
          ref={(e) => {
            textareaRef.current = e;
            inputRef(e);
          }}
          value={content}
          width="100%"
          minW={"100%"}
          type={type}
          resize={"none"}
          height="45px"
          minHeight={"45px"}
          maxHeight={"100px"}
          autoFocus={true}
          onChange={handleChange}
          autoComplete="off"
          isInvalid={!!errors[name]}
          _active={!!errors[name] ? { borderColor: "red.400" } : ""}
          placeholder={placeHolderText}
          boxShadow="inner"
          padding={"10px 55px 10px 15px"}
          border={
            colorMode === "light"
              ? "1px solid rgba(0, 0, 0, 0.5)"
              : "1px solid rgba(255,255,255, 0.5)"
          }
          _placeholder={{
            color:
              colorMode === "light"
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(255,255,255, 0.7)",
          }}
          sx={{
            "&:hover": {
              boxShadow: "none",
              border:
                colorMode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.4)"
                  : "1px solid rgba(255,255,255, 0.4)",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "none",
              border:
                colorMode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.4)"
                  : "1px solid rgba(255,255,255, 0.4)",
            },
            "&::-webkit-scrollbar": {
              width: "4px",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "7px",
              borderRadius: "7px",
              margin: "7px 0 7px 0",
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                colorMode === "light"
                  ? "rgba(0, 0, 0, 0.3)"
                  : "rgba(255, 255, 255, 0.3)",
              borderRadius: "24px",
            },
            border:
              colorMode === "light"
                ? "1px solid rgba(0, 0, 0, 0.5)"
                : "1px solid rgba(255, 255, 255, 0.5)",
            _hover: {
              border:
                colorMode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.4)",
            },
            _focus: {
              outline: "none",
              boxShadow: "none",
              border:
                colorMode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.4)",
            },
          }}
          rounded={"xl"}
          {...rest}
        />
        <InputRightElement width="4.5rem" height={"100%"}>
          <IconButton
            h="100%"
            size="lg"
            onClick={() => {
              sendOnClick();
              setContent("");
            }}
            icon={<FiSend />}
            bgColor={"transparent"}
            _hover={{ bgColor: "transparent" }}
            isLoading={isLoading}
            cursor={"pointer"}
            isDisabled={btnDisabled}
            _focusVisible={{ outline: "none" }}
          />
        </InputRightElement>
      </InputGroup>
      <Box maxW={"330px"}>
        <FormErrorMessage>
          {errors[name] && errors[name]?.message}
        </FormErrorMessage>
      </Box>
    </FormControl>
  );
};

export default FormInput;
