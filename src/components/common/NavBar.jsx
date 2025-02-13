"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Button,
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
import { useFirebase } from "@/hooks/firebase/useFirebase";
import ShareChatBtn from "./ShareChatBtn";

const NabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode } = useColorMode();
  const {
    isOpen: isNavbarOpen,
    onClose: toggleNavbar,
    onOpen: openNavBar,
  } = useDisclosure();
  const { firebaseMethods, accessToken } = useFirebase();
  const { createNewChat } = firebaseMethods;

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
      <Flex
        justifyContent="space-between"
        alignItems={"center"}
        py={"20px"}
        px={{
          base: "12px",
          md: "20px",
        }}
      >
        {accessToken && (
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
        )}
        <Heading
          as="h1"
          size="md"
          display={{
            base: accessToken ? "none" : "block",
            lg: "block",
          }}
        >
          ThinkHub AI
        </Heading>
        <Flex gap={3} alignItems={"center"}>
          {/* COLOR MODE BUTTON */}
          <NavBarColorModeBtn />
          {/* SETTING BUTTON */}
          <NavBarSettingBtn />
          {/* CREATE CHAT BUTTON */}
          {accessToken && (
            <Button
              display={{
                base: "block",
                md: "none",
              }}
              onClick={() => {
                createNewChat();
              }}
              disabled={pathname === "/"}
            >
              New Chat
            </Button>
          )}
          {/* USER PROFILE MENU & LOGIN BUTTON */}
          <NavBarUserProfileMenu />
        </Flex>
      </Flex>
      {isNavbarOpen && (
        <CommonDrawer
          isOpen={isNavbarOpen}
          onClose={toggleNavbar}
          title="ThinkHub AI"
          placement="left"
          overlayClose
        >
          <NavBarContent onClose={toggleNavbar} />
        </CommonDrawer>
      )}
    </Box>
  );
};

export default NabBar;
