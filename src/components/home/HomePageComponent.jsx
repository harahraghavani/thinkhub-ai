import ChatHistoryBtn from "@/components/common/ChatHistoryBtn";
import CreateNewChatBtn from "@/components/common/CreateNewChatBtn";
import Home from "@/components/common/Home";
import NavBar from "@/components/common/NavBar";
import { Box } from "@chakra-ui/react";

const HomePageComponent = () => {
  return (
    <Box position="relative">
      <NavBar />
      <Home />
      <Box
        display={{
          base: "none",
          lg: "block",
        }}
      >
        <CreateNewChatBtn />
      </Box>
      <Box
        display={{
          base: "none",
          lg: "block",
        }}
      >
        <ChatHistoryBtn />
      </Box>
    </Box>
  );
};

export default HomePageComponent;
