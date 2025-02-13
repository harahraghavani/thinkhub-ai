import Lottie from "react-lottie";
import * as ChatLoadingAnimation from "../../app/assets/ChatLoading.json";
import { Box, useBreakpointValue } from "@chakra-ui/react";

const ChatLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: ChatLoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottieSize = useBreakpointValue({ base: 150, md: 250 });

  return (
    <Lottie
      options={defaultOptions}
      height={lottieSize}
      width={lottieSize}
      isClickToPauseDisabled
      style={{
        cursor: "default",
        width: "50px",
        height: "50px",
        transform: "scale(2.5)",
      }}
    />
  );
};

export default ChatLoading;
