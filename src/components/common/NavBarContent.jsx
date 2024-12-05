import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { FaHistory } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const NavBarContent = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { userData, firebaseMethods } = useFirebase();
  const { logoutUser, createNewChat } = firebaseMethods;

  return (
    <Flex
      direction="column"
      py={3}
      justifyContent="space-between"
      height="100%"
    >
      <Flex direction="column" gap={4}>
        {/* <Button
          leftIcon={<IoMdAdd />}
          onClick={() => {
            createNewChat();
            onClose();
          }}
          disabled={pathname === "/"}
        >
          New Chat
        </Button> */}
        {pathname !== "/chat/history" && (
          <Button
            leftIcon={<FaHistory />}
            onClick={() => {
              router.push("/chat/history");
            }}
          >
            Chat History
          </Button>
        )}
      </Flex>
      {userData && (
        <Flex alignItems="center" gap={4} justifyContent="center">
          <Avatar
            name={userData?.displayName}
            src={userData?.providerData?.[0]?.photoURL}
          />
          <Button
            onClick={async () => {
              await logoutUser();
              onClose();
            }}
            variant="outline"
          >
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default NavBarContent;
