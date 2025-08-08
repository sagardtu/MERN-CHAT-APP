import React, { useEffect } from "react";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";

import ChatLoading from "./ChatLoading";

import GroupChatModal from "./GroupChatModal";

import { getSender, getSenderFull } from "../../config/ChatLogic";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                display="flex"
                onClick={() => setSelectedChat(chat)}
                alignItems="center"
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius="lg"
                key={chat._id}
              >
                {!chat.isGroupChat ? (
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={getSender(loggedUser, chat.users)}
                    src={
                      getSenderFull(loggedUser, chat.users).pic !==
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                        ? getSenderFull(loggedUser, chat.users).pic
                        : ""
                    }
                  />
                ) : (
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={chat.chatName}
                  />
                )}

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  height="100%"
                  ml={2}
                >
                  <Box>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>

                    <Text fontSize="xs" display="flex" overflowX="hidden">
                      {chat.latestMessage ? (
                        <>
                          <Text as="b">
                            {chat.latestMessage.sender._id === loggedUser._id
                              ? "You"
                              : chat.latestMessage.sender.name}
                          </Text>
                          <Text>{`: ${chat.latestMessage.content}`}</Text>
                        </>
                      ) : (
                        "Click on user to start chatting"
                      )}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
