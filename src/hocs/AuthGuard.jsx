import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Box, Flex } from "@chakra-ui/react";

const AuthGuard = ({ children, fallback }) => {
  const {
    states: { user, isUser },
  } = useFirebase();

  return (
    <Box>
      {isUser && !user ? (
        <Flex justifyContent="center" alignItems="center" h="100vh" w="100%">
          {fallback}
        </Flex>
      ) : (
        children
      )}
    </Box>
  );
};

export default AuthGuard;
