import { Box, Grid, Paper, Typography } from "@mui/material";
import ChatList from "../../components/Chat/ChatList";
import { useEffect, useReducer, useState } from "react";
import ChatView from "../../components/Chat/ChatView";
import { useSearchParams } from "react-router-dom";
import { fetchListingChats } from "../../api/message";

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);

  const handleSelectChat = (applicationId: string) => {
    const newParams = new URLSearchParams(searchParams);
    const c = chats.find((chat) => chat.applicationId === applicationId);
    setSelectedChat(c);
    newParams.set("applicationId", c.applicationId);
    setSearchParams(newParams);
  };

  const fetchChats = async () => {
    const jobId = searchParams.get("jobId") || "";
    if (jobId) {
      try {
        const fetchedChats = await fetchListingChats(jobId);
        setChats(fetchedChats);
        return fetchedChats;
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    }
  };

  const refreshChats = async () => {
    const applicationId = searchParams.get("applicationId") || "";
    fetchChats().then((data) => {
      const c = data!!.find((chat) => chat.applicationId === applicationId);
      setSelectedChat(c);
    });
  };

  useEffect(() => {
    const data = fetchChats();
    const applicationId = searchParams.get("applicationId") || "";
    setTimeout(() => {
      if (applicationId !== "") {
        data.then((result) => {
          const c = result!!.find(
            (chat) => chat.applicationId === applicationId
          );
          setSelectedChat(c);
        });
      }
    }, 500);
  }, []);

  return (
    <Box
      sx={{
        height: "calc(100vh - 74px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={0} sx={{ height: "100%", overflow: "hidden" }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{ height: "100%", padding: 2, overflowY: "auto" }}
          >
            <Typography variant="h6">Chats</Typography>
            <ChatList chats={chats} onSelectChat={handleSelectChat} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper
            elevation={3}
            sx={{ height: "100%", padding: 2, overflowY: "auto" }}
          >
            <Typography variant="h6">
              {selectedChat ? selectedChat.applicantName : "Select a chat"}
            </Typography>
            <ChatView
              selectedChat={selectedChat}
              refreshChats={refreshChats}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;
