"use client";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  useColorMode,
} from "@chakra-ui/react";

const CommonDrawer = ({
  children,
  title = "",
  isOpen,
  onClose,
  placement = "right",
  overlayClose = false,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Drawer
      isOpen={isOpen}
      placement={placement}
      onClose={onClose}
      closeOnOverlayClick={overlayClose}
    >
      <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <DrawerContent>
        <DrawerCloseButton _focus={{ boxShadow: "none" }} />
        <DrawerHeader>{title}</DrawerHeader>
        <Divider
          borderColor={
            colorMode === "light" ? "blackAlpha.700" : "whiteAlpha.700"
          }
          variant="dashed"
        />
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CommonDrawer;
