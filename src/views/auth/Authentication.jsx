"use client";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FaGoogle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { Velustro } from "uvcanvas";

const AuthenticationPage = () => {
  const [init, setInit] = useState(false);
  const { firebaseMethods, states } = useFirebase();

  // destructuring the states
  const { signUpWithGoogle } = firebaseMethods;
  const { isLoading } = states;

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <Flex
      h="100vh"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bg="black"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={0}
      >
        {/* {init && (
          <Particles
            id="tsparticles"
            particlesLoaded={() => {}}
            options={TS_PARTICLES_OPTIONS}
          />
        )} */}
        <Velustro />
      </Box>

      {/* Glassmorphism Card */}
      <Box
        backgroundColor="rgba(255, 255, 255, 0.25)"
        backdropFilter="blur(15px)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="22px"
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
        padding={{
          base: "30px 10px",
          md: "40px",
        }}
        maxWidth={{ base: "450px", md: "450px" }}
        width={{
          base: "90%",
          md: "100%",
        }}
        zIndex={1}
      >
        <VStack spacing={6}>
          <Text
            fontSize={{
              base: "2xl",
              md: "3xl",
            }}
            fontWeight="bold"
            color="white"
            textAlign="center"
            textShadow="0 2px 10px rgba(0,0,0,0.5)"
          >
            Welcome to IntelliHub AI
          </Text>
          <Text fontSize="md" color="white" textAlign="center">
            Creativity with advanced AI solutions. <br />
            Sign in with Google to begin your journey
          </Text>
          <Button
            size="lg"
            width="full"
            leftIcon={<FaGoogle />}
            color="white"
            variant="outline"
            onClick={signUpWithGoogle}
            isLoading={isLoading}
            isDisabled={isLoading}
            loadingText="Authenticating..."
            backgroundColor="rgba(255, 255, 255, 0.12)"
            backdropFilter="blur(7px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 4px 40px rgba(0, 0, 0, 0.2)",
            }}
            _active={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
            borderRadius="full"
            height="50px"
            fontSize="md"
            transition="all 0.3s ease"
            textShadow="0 2px 10px rgba(0,0,0,0.3)"
          >
            Continue with Google
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AuthenticationPage;
