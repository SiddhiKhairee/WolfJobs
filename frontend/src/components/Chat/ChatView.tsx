import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { sendMessage } from "../../api/message";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";

const ChatView = ({ selectedChat, refreshChats }: any) => {
  const currentUserId = localStorage.getItem("userId") || "";
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const applicantId = selectedChat.applicantId;
      await sendMessage(
        message,
        currentUserId,
        applicantId,
        selectedChat.applicationId
      );
      refreshChats();
    } catch (error) {
      console.error("Error sending chat:", error);
      toast.error("Error sending chat");
    }
    setMessage("");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshChats(); // Polling fetch
    }, 3000);

    return () => {
      clearInterval(intervalId); // Cleanup on component unmount
    };
  }, [selectedChat]);

  return (
    <Box
      sx={{ mt: 2, display: "flex", flexDirection: "column", height: "90vh" }}
    >
      {selectedChat && (
        <>
          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 10 }}>
            <List>
              {selectedChat.messages.map((message: any) => (
                <ListItem key={message._id}>
                  <ListItemText
                    primary={message.message}
                    secondary={
                      <>
                        <p>
                          {message.fromUser === currentUserId
                            ? "You"
                            : selectedChat.applicantName}
                        </p>
                        <small style={{ float: "right" }}>
                          Sent at{" "}
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </small>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              backgroundColor: "background.paper",
              position: "absolute",
              bottom: 0,
              left: "34%",
              right: 0,
              p: 1,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", width: "100%" }}
            >
              <TextField
                fullWidth
                label="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mr: 1 }}
              />
              <IconButton color="primary" type="submit" aria-label="send message">
                <SendIcon />
              </IconButton>
            </form>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatView;
