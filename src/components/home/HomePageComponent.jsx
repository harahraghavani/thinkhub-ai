import ChatHistoryBtn from "@/components/common/ChatHistoryBtn";
import CreateNewChatBtn from "@/components/common/CreateNewChatBtn";
import Home from "@/components/common/Home";
import NavBar from "@/components/common/NavBar";
import { Box } from "@chakra-ui/react";
import ShareChatBtn from "../common/ShareChatBtn";

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
      <Box
        display={{
          base: "none",
          lg: "block",
        }}
      >
        <ShareChatBtn />
      </Box>
    </Box>
  );
};

export default HomePageComponent;
