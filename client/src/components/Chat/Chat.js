import React, { useContext, useState } from "react";

import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Menu,
  Mic,
  MoreVert,
  SearchOutlined
} from "@material-ui/icons";

import Welcome from "../Welcome/Welcome";
import { postMessage } from "../../axios";
import { AuthContext } from "../../hooks/AuthContext";

import "./Chat.css";
import useStyles from "./styles";

const Chat = ({ messages, room, setShowSideBar }) => {
  const [input, setInput] = useState("");

  const { isLoggedIn, token, userId, username } = useContext(AuthContext);

  const classes = useStyles();

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const resData = await postMessage(
        input,
        room._id,
        userId,
        username,
        token
      );

      if (resData.status === 201) {
        setInput("");
      }
    } catch (err) {
      console.log("Could not send your message!", err);
    }
  };

  return (
    <React.Fragment>
      {!isLoggedIn ? (
        <Welcome />
      ) : (
        userId && (
          <div className="chat">
            <div className="chat__header">
              <IconButton
                className={classes.menuButton}
                onClick={() => setShowSideBar(true)}
              >
                <Menu />
              </IconButton>
              {
                <React.Fragment>
                  {room.imageUrl && <Avatar src={room.imageUrl} />}

                  <div className="chat__headerInfo">
                    <h3>{room.name}</h3>
                    <p>
                      {messages &&
                        messages.length > 0 &&
                        "Last seen at " +
                          new Date(
                            messages[messages.length - 1].timeStamp
                          ).toLocaleString()}
                    </p>
                  </div>

                  <div className="chat__headerRight">
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                    <IconButton>
                      <AttachFile />
                    </IconButton>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </div>
                </React.Fragment>
              }
            </div>

            <div className="chat__body">
              {messages.map((message) => {
                return (
                  <p
                    key={message._id}
                    className={`chat__message ${
                      message.userId === userId && "chat__receiver"
                    }`}
                  >
                    <span
                      className={`chat__name ${
                        message.userId === userId
                          ? "chat__greenReceiverName"
                          : "chat__grayReceiverName"
                      }`}
                    >
                      {message.name}
                    </span>
                    {message.message}
                    <span
                      className={`chat__timestamp ${
                        message.userId === userId && "chat__time-left"
                      }`}
                    >
                      {new Date(message.timeStamp)
                        .toLocaleTimeString()
                        .slice(0, -3)}
                    </span>
                  </p>
                );
              })}
            </div>

            {Object.keys(room).length > 0 && (
              <div className="chat__footer">
                <InsertEmoticon />

                <form onSubmit={sendMessage}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    type="text"
                  />
                  <button type="submit">Send a message</button>
                </form>

                <Mic />
              </div>
            )}
          </div>
        )
      )}
    </React.Fragment>
  );
};

export default Chat;
