import React from "react";
import {
  Select,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

const FormSelect = ({
  id,
  label,
  name,
  rules,
  register,
  errors,
  placeholder,
  options,
}) => {
  const { ref: inputRef, ...rest } = register(name, rules);
  return (
    <FormControl id={id} isInvalid={!!errors[name]}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select placeholder={placeholder} ref={inputRef} {...rest}>
        {options?.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <FormErrorMessage>
        {errors[name] && errors[name]?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FormSelect;
