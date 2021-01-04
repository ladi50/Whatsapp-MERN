import React, { useContext } from "react";
import { Avatar } from "@material-ui/core";

import { getMessagesByRoom } from "../../../axios";
import { AuthContext } from "../../../hooks/AuthContext";

import "./SideBarChat.css";

const SideBarChat = ({
  room,
  setRoomDetails,
  setMessages,
  messages,
  setShow,
  setIsLoading
}) => {
  const { token } = useContext(AuthContext);

  const roomMessages = messages.filter((m) => m.roomId === room._id);
  
  const getRoomHandler = async () => {
    setIsLoading(true);

    try {
      const res = await getMessagesByRoom(room._id, token);

      if (res.data) {
        setIsLoading(false);

        setRoomDetails(room);
        setMessages(res.data);
        setShow();
      }
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  };

  return (
    <div className="sidebarChat" onClick={getRoomHandler}>
      <Avatar src={room.imageUrl} />
      <div className="sidebarChat__info">
        <h2>{room.name}</h2>
        <p>
          {roomMessages.length > 0 &&
          roomMessages[roomMessages.length - 1].message.length > 10
            ? roomMessages[roomMessages.length - 1].message.substr(0, 15) +
              "..."
            : roomMessages.length > 0 &&
              roomMessages[roomMessages.length - 1].message}
        </p>
      </div>
    </div>
  );
};

export default SideBarChat;
