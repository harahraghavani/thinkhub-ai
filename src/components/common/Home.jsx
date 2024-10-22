"use client";

import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../form/FromInput";
import { Box, Container } from "@chakra-ui/react";

const Home = () => {
  // react hook form
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <Container>
      <Box px={5} position="relative">
        <Box position="absolute" top="50px" left="0" width="100%" bottom="0">
          <FormInput
            name="promptInput"
            id="promptInput"
            register={register}
            errors={errors}
            rules={{}}
            placeHolderText="Message IntelliHub"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
