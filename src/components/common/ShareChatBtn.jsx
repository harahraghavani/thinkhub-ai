"use client";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { FaShare } from "react-icons/fa";
import CommonModal from "./CommonModal";
import { IoIosLink } from "react-icons/io";

const ShareChatBtn = ({ isAbsolute = true, isRightIcon = true }) => {
  const params = useParams();
  const { accessToken, isChatGenerating } = useFirebase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleCopyLink = () => {
    const baseUrl = window?.location?.origin;
    const routeName = "share";
    const id = params?.id;

    const publicUrl = `${baseUrl}/${routeName}/${id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
    onClose();
  };

  const isBtnDisabled = () => {
    if (params?.id) {
      return false;
    }
    if (isChatGenerating?.current) {
      return true;
    }

    return true;
  };

  return (
    <>
      {accessToken && (
        <Box position={isAbsolute ? "absolute" : "block"} top={100} right={5}>
          <Button
            rightIcon={isRightIcon ? <FaShare /> : null}
            disabled={isBtnDisabled()}
            onClick={() => {
              onOpen();
            }}
          >
            Share
          </Button>
        </Box>
      )}
      {isOpen && (
        <CommonModal
          isOpen={isOpen}
          onClose={onClose}
          title="Share public link to chat"
        >
          <Box display="flex" justifyContent="center">
            <Button
              leftIcon={<IoIosLink />}
              rounded={"full"}
              colorScheme="blue"
              onClick={handleCopyLink}
            >
              Generate Public Link
            </Button>
          </Box>
        </CommonModal>
      )}
    </>
  );
};

export default ShareChatBtn;
