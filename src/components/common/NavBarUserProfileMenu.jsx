"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";

const NavBarUserProfileMenu = () => {
  const { userData, firebaseMethods } = useFirebase();
  const { logoutUser } = firebaseMethods;

  return userData ? (
    <Menu>
      <MenuButton
        as={Button}
        bg={"transparent"}
        _active={{
          bg: "transparent",
        }}
        _hover={{
          bg: "transparent",
        }}
        p={0}
      >
        <Avatar
          name={userData?.displayName}
          src={userData?.providerData?.[0]?.photoURL}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={async () => await logoutUser()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Link href={"/login"}>
      <Button variant="outline" colorScheme="green">
        Login
      </Button>
    </Link>
  );
};

export default NavBarUserProfileMenu;
