"use client";

import { Box, Button, Flex } from "@chakra-ui/react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FaGoogle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { TS_PARTICLES_OPTIONS } from "@/constant/appConstant";
import GlassmorphismButton from "@/components/common/GlassmorphismButton";

const AuthenticationPage = () => {
  const [init, setInit] = useState(false);

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
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={0}
      >
        {init && (
          <Particles
            id="tsparticles"
            particlesLoaded={() => {}}
            options={TS_PARTICLES_OPTIONS}
          />
        )}
      </Box>
      <GlassmorphismButton leftIcon={<FaGoogle />}>
        Continue with Google
      </GlassmorphismButton>
    </Flex>
  );
};

export default AuthenticationPage;
