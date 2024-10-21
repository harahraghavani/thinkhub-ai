"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import { IoMdSettings } from "react-icons/io";

const NavBarSettingBtn = () => {
  const { accessToken } = useFirebase();
  return (
    accessToken && (
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
      />
    )
  );
};

export default NavBarSettingBtn;
