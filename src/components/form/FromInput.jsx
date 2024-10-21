"use client";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
  const [isTextarea, setIsTextarea] = useState(false);

  const { colorMode } = useColorMode();
  const { ref: inputRef, onChange, ...rest } = register(name, rules);

  const handleChange = (e) => {
    if (onChangeCallBack) {
      onChangeCallBack(e);
    }
    if (e.target.value.includes("\n")) {
      setIsTextarea(true);
    }
    onChange(e);
  };

  // Auto-grow Textarea height based on input content
  useEffect(() => {
    if (textareaRef.current) {
      console.log(textareaRef.current.scrollHeight);
      textareaRef.current.style.height = "auto"; // Reset height before resizing
      textareaRef.current.style.minHeight = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textareaRef]);

  return (
    <FormControl id={id} isInvalid={!!errors[name]} width={"100%"}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        {/* {isTextarea ? ( */}
        <Textarea
          ref={(e) => {
            textareaRef.current = e;
            inputRef(e);
          }}
          width="100%"
          minW={"100%"}
          type={type}
          resize={"none"}
          height="40px"
          minHeight={"40px"}
          autoGrow={2}
          onChange={handleChange}
          autoComplete="off"
          isInvalid={!!errors[name]}
          _active={!!errors[name] ? { borderColor: "red.400" } : ""}
          placeholder={placeHolderText}
          boxShadow="inner"
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
            paddingInlineEnd: "55px",
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
          }}
          rounded={"full"}
          {...rest}
        />
        {/* ) : ( */}
        {/* <Input
          width="100%"
          minW={"100%"}
          type={type}
          ref={inputRef}
          onChange={handleChange}
          autoComplete="off"
          isInvalid={!!errors[name]}
          _active={!!errors[name] ? { borderColor: "red.400" } : ""}
          placeholder={placeHolderText}
          boxShadow="inner"
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
            paddingInlineEnd: "55px",
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
          }}
          rounded={"full"}
          {...rest}
        /> */}
        {/* )} */}
        <InputRightElement width="4.5rem">
          <IconButton
            h="1.75rem"
            size="lg"
            onClick={sendOnClick}
            icon={<FiSend />}
            bgColor={"transparent"}
            _hover={{ bgColor: "transparent" }}
            isLoading={isLoading}
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
