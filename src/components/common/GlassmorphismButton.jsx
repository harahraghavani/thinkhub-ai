"use client";
import { Button } from "@chakra-ui/react";

const GlassmorphismButton = ({
  children,
  leftIcon = null,
  size = "md",
  loadingText = "Authenticating...",
  borderRadius = "full",
  onClickCallBack,
}) => {
  return (
    <Button
      size={size}
      leftIcon={leftIcon}
      color="white"
      variant="outline"
      loadingText={loadingText}
      backgroundColor="rgba(255, 255, 255, 0.2)"
      backdropFilter="blur(100px)"
      border="1px solid rgba(255, 255, 255, 0.3)"
      _hover={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(20px)",
      }}
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.2)"
      borderRadius={borderRadius}
      zIndex={999}
      onClick={onClickCallBack?.()}
    >
      {children}
    </Button>
  );
};

export default GlassmorphismButton;
