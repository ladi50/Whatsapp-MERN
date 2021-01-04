import { useEffect, useState, lazy, Suspense } from "react";
import Pusher from "pusher-js";

import Spinner from "./components/Spinner/Spinner";
import { AuthContext } from "./hooks/AuthContext";
import { useAuth } from "./hooks/auth-hook";

import "./App.css";

const Chat = lazy(() => import("./components/Chat/Chat"));
const SideBar = lazy(() => import("./components/SideBar/SideBar"));

const App = () => {
  const [messages, setMessages] = useState([]);
  const [roomDetails, setRoomDetails] = useState({});
  const [showSideBar, setShowSideBar] = useState(false);

  const { token, login, logout, userId, username, userImage } = useAuth();

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      setMessages((prevData) => {
        return [...prevData, data];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (token && messages.length > 0) {
      const divChat = document.querySelector("div.chat__body");
      if (divChat) {
        divChat.scrollTop = divChat.scrollHeight;
      }
    }
  }, [messages, token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        logout: logout,
        login: login,
        username: username,
        userImage: userImage
      }}
    >
      <Suspense fallback={<Spinner />}>
        <div className="app">
          <div className="app__body">
            {token && (
              <SideBar
                setRoomDetails={setRoomDetails}
                setMessages={setMessages}
                messages={messages}
                showSideBar={showSideBar}
                setShowSideBar={setShowSideBar}
              />
            )}
            <Chat
              messages={messages}
              room={roomDetails}
              setShowSideBar={setShowSideBar}
            />
          </div>
        </div>
      </Suspense>
    </AuthContext.Provider>
  );
};

export default App;
