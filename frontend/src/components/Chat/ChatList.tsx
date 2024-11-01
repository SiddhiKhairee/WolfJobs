import { List, ListItemText, Divider, ListItem } from "@mui/material";

const ChatList = ({
  chats,
  onSelectChat,
}: {
  chats: any[];
  onSelectChat: Function;
}) => {
  return (
    <List>
      {chats.map((chat) => (
        <ListItem
          onClick={() => onSelectChat(chat.applicationId)}
          key={chat.applicationId}
        >
          <ListItemText
            primary={chat.applicantName}
            secondary={
              <small>
                {chat.lastMessage !== null ? chat.lastMessage.message : ""} • {chat.lastMessage !== null ? new Date(chat.lastMessage.createdAt).toLocaleTimeString() : ""}
              </small>
            }
          />
        </ListItem>
      ))}
      <Divider />
    </List>
  );
};

export default ChatList;
