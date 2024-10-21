"use client";

import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../form/FromInput";
import { Container } from "@chakra-ui/react";

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
      <FormInput
        name="promptInput"
        id="promptInput"
        register={register}
        errors={errors}
        rules={{}}
        placeHolderText="Message IntelliHub"
      />
    </Container>
  );
};

export default Home;
