"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const CommonModal = ({
  children,
  title = "",
  isOpen,
  onClose,
  baseWidth = "xs",
  maxWidth = "md",
  outsideAllowed = false,
  blurValue = 10,
}) => {
  return (
    <Modal
      closeOnOverlayClick={outsideAllowed}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter={`blur(${blurValue}px)`}
      />
      <ModalContent
        maxW={{
          base: baseWidth,
          md: maxWidth,
        }}
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />
        <ModalBody pb={6}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommonModal;
