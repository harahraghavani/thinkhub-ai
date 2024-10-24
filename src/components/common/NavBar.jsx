"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import NavBarColorModeBtn from "./NavBarColorModeBtn";
import NavBarSettingBtn from "./NavBarSettingBtn";
import NavBarUserProfileMenu from "./NavBarUserProfileMenu";
import { RxHamburgerMenu } from "react-icons/rx";
import CommonDrawer from "./CommonDrawer";
import NavBarContent from "./NavBarContent";

const NabBar = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const {
    isOpen: isNavbarOpen,
    onClose: toggleNavbar,
    onOpen: openNavBar,
  } = useDisclosure();

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
        <Box display={{ base: "block", lg: "none" }}>
          <IconButton
            aria-label="Create New Chat"
            icon={<RxHamburgerMenu />}
            variant="solid"
            rounded={"xl"}
            size={"md"}
            onClick={openNavBar}
          />
        </Box>
        <Heading
          as="h1"
          size="md"
          display={{
            base: "none",
            lg: "block",
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
      {isNavbarOpen && (
        <CommonDrawer
          isOpen={isNavbarOpen}
          onClose={toggleNavbar}
          title="IntelliHub AI"
          placement="left"
        >
          <NavBarContent onClose={toggleNavbar} />
        </CommonDrawer>
      )}
    </Box>
  );
};

export default NabBar;
