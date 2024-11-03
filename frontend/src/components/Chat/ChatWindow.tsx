import React, { useEffect, useState } from "react";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Box,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatWindowProps {
  isOpen: boolean;
  chats: any[];
  onClose: () => void;
  sendMessage: Function;
  refreshChats: Function;
  application: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  chats,
  onClose,
  sendMessage,
  refreshChats,
  application,
}) => {
  const [message, setMessage] = useState<string>("");
  const currentUser = localStorage.getItem("userId");
  const sortedChats = chats.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (application && application._id && isOpen) {
        refreshChats(application._id);
      }
    }, 3000);
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chat</DialogTitle>
      <DialogContent>
        <List sx={{ mb: 10 }}>
          {sortedChats.map((chat, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    chat.fromUser === currentUser
                      ? "You"
                      : application.applicantid === chat.fromUser
                      ? "Applicant"
                      : "Employer"
                  }
                  secondary={
                    <React.Fragment>
                      <span>
                        <b>{chat.message}</b>
                      </span>
                      <small style={{ float: "right" }}>
                        {new Date(chat.createdAt).toLocaleString()}
                      </small>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider orientation="horizontal" />
            </React.Fragment>
          ))}
        </List>
        <Box
          sx={{
            backgroundColor: "background.paper",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
          }}
        >
          <form
            style={{ display: "flex", width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim() && message !== "") {
                sendMessage(message);
                setMessage("");
              }
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={1}
              label="Send a message..."
              variant="outlined"
              margin="normal"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton color="primary" type="submit" aria-label="send message">
              <SendIcon />
            </IconButton>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWindow;
