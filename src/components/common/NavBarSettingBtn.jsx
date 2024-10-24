"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoMdSettings } from "react-icons/io";
import CommonDrawer from "./CommonDrawer";
import ChangeModelContent from "./ChangeModelContent";

const NavBarSettingBtn = () => {
  const { accessToken } = useFirebase();

  const {
    isOpen: openSettings,
    onClose: closeSettings,
    onOpen: toggleSettings,
  } = useDisclosure();

  return (
    accessToken && (
      <>
        <IconButton
          aria-label="settings"
          icon={<IoMdSettings size={30} />}
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          _focusVisible={{
            bg: "transparent",
            outline: "none",
          }}
          bg="transparent"
          onClick={toggleSettings}
        />
        {openSettings && (
          <CommonDrawer
            isOpen={openSettings}
            onClose={closeSettings}
            title="Change Settings"
          >
            <ChangeModelContent
              open={openSettings}
              closeSettings={closeSettings}
            />
          </CommonDrawer>
        )}
      </>
    )
  );
};

export default NavBarSettingBtn;
