import Lottie from "react-lottie";
import * as NoListData from "../../app/assets/NoData.json";
import * as NoListDataWhite from "../../app/assets/NoDataWhite.json";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";

const NoDataFound = ({ message }) => {
  const { colorMode } = useColorMode();

  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: colorMode === "light" ? NoListData : NoListDataWhite,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottieSize = useBreakpointValue({ base: 150, md: 250 });

  return (
    <Box m={8}>
      <Card border="1px solid">
        <CardBody>
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Lottie
              options={defaultOptions}
              height={lottieSize}
              width={lottieSize}
              isClickToPauseDisabled={true}
            />
            <Heading
              size={{
                base: "xs",
                sm: "sm",
              }}
              mt={3}
              textTransform="uppercase"
              fontWeight="bold"
            >
              {message}
            </Heading>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default NoDataFound;
