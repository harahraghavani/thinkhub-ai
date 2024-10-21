"use client";

import { useRouter } from "next/navigation";
import { Box, Flex, Heading, useColorMode } from "@chakra-ui/react";
import NavBarColorModeBtn from "./NavBarColorModeBtn";
import NavBarSettingBtn from "./NavBarSettingBtn";
import NavBarUserProfileMenu from "./NavBarUserProfileMenu";

const NabBar = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  return (
    <Box
      w="100%"
      transition={"all 0.3s ease"}
      zIndex={999}
      boxShadow={
        colorMode === "light"
          ? "0 0 10px rgba(0, 0, 0, 0.2)"
          : "0 0 10px rgba(255, 255, 255, 0.2)"
      }
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} p={"20px"}>
        <Heading
          as="h4"
          size="md"
          cursor="pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          IntelliHub AI
        </Heading>
        <Flex gap={4} alignItems={"center"}>
          {/* COLOR MODE BUTTON */}
          <NavBarColorModeBtn />
          {/* SETTING BUTTON */}
          <NavBarSettingBtn />
          {/* USER PROFILE MENU & LOGIN BUTTON */}
          <NavBarUserProfileMenu />
        </Flex>
      </Flex>
    </Box>
  );
};

export default NabBar;
