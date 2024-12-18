"use client";

import { useFirebase } from "@/hooks/firebase/useFirebase";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const NavBarUserProfileMenu = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { userData, firebaseMethods } = useFirebase();
  const { logoutUser } = firebaseMethods;

  return userData ? (
    <Box
      display={{
        base: "none",
        md: "block",
      }}
    >
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
    </Box>
  ) : (
    <Link href={isHomePage ? `/login` : `/login?chatId=${id}`}>
      <Button variant="outline" colorScheme="green">
        Login
      </Button>
    </Link>
  );
};

export default NavBarUserProfileMenu;
