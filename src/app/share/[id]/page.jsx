import { Box } from "@chakra-ui/react";
import NavBar from "@/components/common/NavBar";
import ShareChat from "@/components/share/ShareChat";

const ShareChatPage = () => {
  return (
    <Box position="relative">
      <NavBar />
      <ShareChat />
    </Box>
  );
};

export default ShareChatPage;
