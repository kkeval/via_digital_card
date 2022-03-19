import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Router from "next/router";

export default function Subscription() {
  const [data, setdata] = useState({});
  const [spinner, setspinner] = useState(false);
  const { data: session } = useSession();
  const [isLoading, setisLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setisLoading(true);
    async function fetchMyAPI() {
      const res = await fetch("/api/razorpay/subscriptionstatus");
      const data1 = await res.json();
      if (data1.status !== "active" && data1.status !== "cancelled") {
        return Router.reload();
      } else {
        setdata(data1);
      }
      console.log(data);
    }
    fetchMyAPI().then(() => {
      setisLoading(false);
    });

    return () => {
      console.log("cleanup");
    };
  }, []);

  function Toast(title, message, status) {
    return toast({
      title: title || "",
      description: message,
      status: status,
      position: "top",
      duration: 2000,
      // isClosable: true,
    });
  }

  async function handleClick() {
    setspinner(true);
    const res = await fetch("/api/razorpay/cancelsubscription");
    const data = await res.json();
    if (res.status === 200) {
      setspinner(false);

      Toast("Successfully Cancelled your Subscription", "", "success");
      return Router.push("/pricing");
    }
    if (res.status === 400) {
      setspinner(false);
      Toast("Something went wrong", "", "error");
    }
    if (res.status === 500) {
      setspinner(false);
      Toast("Something went wrong", "", "error");
    }
    setdata(data);
  }
  const textColor = useColorModeValue("black", "white");
  const bg = useColorModeValue("white", "black.100");

  // const history = useRouter();
  const logo = useColorModeValue(
    "https://file-upload-via-digital.s3.ap-south-1.amazonaws.com/assets/Logo.png",
    "https://file-upload-via-digital.s3.ap-south-1.amazonaws.com/assets/Logo+Dark.png"
  );

  return (
    <>
      <Container
        bg={bg}
        pr={["10px", "10px", "100px"]}
        pl={["10px", "10px", "100px"]}
        maxW="100%"
      >
        <Flex
          pt={["0px", "0px", "0px"]}
          as={Center}
          textColor={textColor}
          justifyContent="center"
          alignItems="center"
          h={["80px", "80px", "120px"]}
          w="full"
          flexDirection="row"
        >
          <Box cursor="pointer">
            {/* <NextLink href="/" passHref> */}
            <Image src={logo} w={["80%", "80%", "100%"]} alt="" />
            {/* </NextLink> */}
          </Box>
          <Spacer />
          <Box cursor="pointer" display={["none", "none", "flex"]}>
            {/* <HStack p="0px 20px 0px 20px" h="40px"> */}
            {/* </HStack> */}
            {/* <NextLink href="/create" passHref> */}
            <Button
              leftIcon={<AddIcon />}
              mr={4}
              variant={"outline"}
              borderColor="greenBrand.100"
              color={textColor}
            >
              Create New Card
            </Button>
            <NextLink href="/cards" passHref>
              <Text
                p="0px 10px 0px 10px"
                h="40px"
                fontWeight="bold"
                as={Center}
              >
                My Cards
              </Text>
            </NextLink>
            {/* </NextLink> */}

            <HStack p="0px 20px 0px 20px" h="40px">
              {/* <Avatar boxSize="35px" /> */}

              <Text onClick={signOut} cursor="pointer" fontWeight="bold">
                Sign Out
              </Text>
            </HStack>
          </Box>
          <Box display={["block", "block", "none"]}>
            {session ? (
              <Menu isLazy={true} computePositionOnMount={true}>
                <MenuButton as={Avatar} boxSize="40px" cursor="pointer" />
                {/* <Avatar boxSize="40px" as={MenuButton} /> */}

                <MenuList color={textColor} w="20px">
                  <MenuItem>
                    <NextLink href="/create" passHref>
                      <Button
                        ml={4}
                        variant={"outline"}
                        borderColor="greenBrand.100"
                      >
                        Create New Card +
                      </Button>
                    </NextLink>
                  </MenuItem>

                  <MenuItem cursor="pointer" as={Center}>
                    <NextLink href="/cards" passHref>
                      <Text>My Cards</Text>
                    </NextLink>
                  </MenuItem>
                  <MenuItem cursor="pointer" onClick={signOut} as={Center}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Flex
                p="5px"
                m={{ base: "10px 0px", lg: "0px 20px" }}
                alignItems={"center"}
              >
                <NextLink href="/auth/signin" passHref>
                  <Button>Sign In</Button>
                </NextLink>
              </Flex>
            )}
          </Box>
        </Flex>
      </Container>

      <Box as={Center} pt="20px" w="100%">
        {isLoading ? (
          <VStack w="95%" mt="10px" maxW={"1205px"} spacing="15px">
            <Box
              role="group"
              borderRadius={"30px"}
              w="80%"
              boxShadow="8px 8px 35px 0px #0000001A"

              // bgColor={bg}
            >
              <VStack
                as={Flex}
                justifyContent="space-evenly"
                h="300px"
                p="20px"
                align="start"
                flexDirection="column"
              >
                <Skeleton h="40px" w="30%" />
                <HStack w="full">
                  <VStack w="20%" alignItems="flex-start">
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                  </VStack>
                  <VStack pl="10px" w="20%" alignItems="flex-start">
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                    <Skeleton h="20px" w="full" />
                  </VStack>
                </HStack>
                <HStack w="full" spacing="40px" mt="20px" mb="30px" h="30px">
                  <Skeleton h="full" w="25%" />
                </HStack>
              </VStack>
            </Box>
          </VStack>
        ) : data && data.status === "active" ? (
          <VStack w="95%" mt="10px" maxW={"1205px"} spacing="15px">
            <Box
              role="group"
              borderRadius={"30px"}
              w="80%"
              boxShadow="8px 8px 35px 0px #0000001A"

              // bgColor={bg}
            >
              <VStack
                as={Flex}
                justifyContent="space-evenly"
                h="350px"
                p="20px"
                align="start"
                flexDirection="column"
              >
                <Text
                  fontWeight="extrabold"
                  fontSize={[".8rem", "1.5rem", "2rem"]}
                >
                  Subscription
                </Text>
                <HStack>
                  <VStack alignItems="flex-start">
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>Plan</Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Account email
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Current Status
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Subscription Start
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Renewal Date
                    </Text>
                  </VStack>
                  <VStack pl="10px" alignItems="flex-start">
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      : Premium
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {`:  ${session.user.email}`}
                    </Text>
                    <Text
                      fontWeight="bold"
                      textColor="green"
                      fontSize={[".8rem", ".8rem", "1.1rem"]}
                    >
                      {data.status
                        ? data.status === "active"
                          ? ":  Active"
                          : ": Inactive"
                        : ": Loading"}
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {`:  ${new Date(
                        data.current_start * 1000
                      ).toDateString()}`}
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {`:  ${new Date(data.current_end * 1000).toDateString()}`}
                    </Text>
                  </VStack>
                </HStack>

                <HStack
                  spacing="40px"
                  mt="20px"
                  mb={["10px", "10px", "30px"]}
                  h={["20px", "20px", "40px"]}
                >
                  <Button
                    isLoading={spinner}
                    onClick={handleClick}
                    _hover={{
                      bg: "red",
                    }}
                    _active={{
                      bg: "red",
                    }}
                    fontSize={[".8rem", ".8rem", "1.1rem"]}
                    h="40px"
                    bg="red.400"
                  >
                    Cancel My Subscription
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        ) : (
          <VStack w="95%" mt="10px" maxW={"1205px"} spacing="15px">
            <Box
              role="group"
              borderRadius={"30px"}
              w="80%"
              boxShadow="8px 8px 35px 0px #0000001A"
            >
              <VStack
                as={Flex}
                justifyContent="space-evenly"
                h="350px"
                p="20px"
                align="start"
                flexDirection="column"
              >
                <Text
                  fontWeight="extrabold"
                  fontSize={[".8rem", "1.5rem", "2rem"]}
                >
                  Subscription
                </Text>
                <HStack>
                  <VStack alignItems="flex-start">
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>Plan</Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Account email
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Current Status
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      Subscription Start
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {data.status === "active" ? "Renewal Date" : ""}
                      {data.status === "cancelled" ? "Ended At" : ""}
                      {/* Renewal Date */}
                    </Text>
                  </VStack>
                  <VStack pl="10px" alignItems="flex-start">
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      : Premium
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {session && `: ${session.user.email}`}
                    </Text>
                    <Text
                      fontWeight="bold"
                      textColor={data.status === "active" ? "green" : "red"}
                      fontSize={[".8rem", ".8rem", "1.1rem"]}
                    >
                      {data.status
                        ? data.status === "active"
                          ? ":  Active"
                          : ":  Cancelled"
                        : ": Loading"}
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {`:  ${new Date(
                        data.current_start * 1000
                      ).toDateString()}`}
                    </Text>
                    <Text fontSize={[".8rem", ".8rem", "1.1rem"]}>
                      {data.status === "active"
                        ? `:  ${new Date(
                            data.current_end * 1000
                          ).toDateString()}`
                        : data.status === "cancelled"
                        ? `:  ${new Date(data.ended_at * 1000).toDateString()}`
                        : ""}
                    </Text>
                  </VStack>
                </HStack>

                <HStack
                  spacing="40px"
                  mt="20px"
                  mb={["10px", "10px", "30px"]}
                  h={["20px", "20px", "40px"]}
                >
                  <Button
                    fontSize={[".8rem", ".8rem", "1.1rem"]}
                    onClick={() => Router.push("/pricing")}
                  >
                    Buy Premium
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        )}
      </Box>
    </>
  );
}