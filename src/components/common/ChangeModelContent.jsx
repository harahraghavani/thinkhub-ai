"use client";
import { ALL_MODELS_ARRAY } from "@/constant/appConstant";
import { useChangeModel } from "@/hooks/changeModel/useChangeModel";
import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ChangeModelContent = ({ open, closeSettings }) => {
  // hooks
  const toast = useToast();

  const { selectedAIModel, changeSelectedAIModel } = useChangeModel();
  const [localSelectedModel, setLocalSelectedModel] = useState(selectedAIModel);

  const handleSave = () => {
    changeSelectedAIModel(localSelectedModel);
    closeSettings();
    toast({
      title: `Model changed to ${localSelectedModel}`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  // Sync local state with global state only when the drawer is initially opened
  useEffect(() => {
    if (open) {
      setLocalSelectedModel(selectedAIModel);
    }
  }, [open, selectedAIModel]);

  return (
    <Flex direction="column" gap={5} py={3}>
      <Box>
        <Heading size="sm" as={"h6"}>
          Chooose Model
        </Heading>
      </Box>
      <Box>
        <RadioGroup value={localSelectedModel} onChange={setLocalSelectedModel}>
          <Stack direction="column">
            {ALL_MODELS_ARRAY.map((model) => {
              return (
                <Radio key={model} value={model}>
                  {model}
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>
      </Box>
      <Flex justifyContent="flex-end">
        <Button colorScheme="blue" onClick={handleSave}>
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChangeModelContent;
