import React from "react";
import { Box } from "@chakra-ui/react";
import Lottie from "lottie-react";
import aiIconLoader from "../../../public/assets/AIIcon.json";

const GradientLoader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box width="40%">
        <Lottie animationData={aiIconLoader} loop />
      </Box>
    </Box>
  );
};

export default GradientLoader;
