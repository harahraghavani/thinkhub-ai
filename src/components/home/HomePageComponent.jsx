"use client";
import ChatHistoryBtn from "@/components/common/ChatHistoryBtn";
import CreateNewChatBtn from "@/components/common/CreateNewChatBtn";
import Home from "@/components/common/Home";
import NavBar from "@/components/common/NavBar";
import { Box, useColorMode } from "@chakra-ui/react";
import ShareChatBtn from "../common/ShareChatBtn";

const HomePageComponent = () => {
  const { colorMode } = useColorMode();
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Fixed NavBar */}
      <Box position="sticky" top={0} zIndex={999}>
        <NavBar />
      </Box>
      {/* Scrollable Content Area */}
      <Box
        flex="1"
        overflow="auto"
        position="relative"
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background:
              colorMode === "light"
                ? "rgba(0,0,0,0.2)"
                : "rgba(255,255,255,0.2)",
            borderRadius: "7px",
            "&:hover": {
              background:
                colorMode === "light"
                  ? "rgba(0,0,0,0.3)"
                  : "rgba(255,255,255,0.3)",
            },
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            backgroundColor: "transparent",
            border: "none",
          },
          scrollbarWidth: "thin",
          scrollbarColor:
            colorMode === "light"
              ? "rgba(0,0,0,0.25) transparent"
              : "rgba(255,255,255,0.25) transparent",
        }}
      >
        <Home />

        {/* Floating Buttons */}
        <Box
          display={{
            base: "none",
            lg: "block",
          }}
          position="fixed"
          right={4}
          left={0}
          top={0}
          zIndex={10}
        >
          <CreateNewChatBtn />
        </Box>
        <Box
          display={{
            base: "none",
            lg: "block",
          }}
          position="fixed"
          right={4}
          left={0}
          top={0}
          zIndex={10}
        >
          <ChatHistoryBtn />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePageComponent;
