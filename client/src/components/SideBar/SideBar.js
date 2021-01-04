import React, { useContext, useEffect, useState } from "react";
import { IconButton, Avatar, Button } from "@material-ui/core";
import {
  DonutLarge,
  Chat,
  MoreVert,
  SearchOutlined,
  Add
} from "@material-ui/icons";
import { CSSTransition } from "react-transition-group";

import SideBarChat from "./SideBarChat/SideBarChat";
import Modal from "../Modal/Modal";
import SlideMenu from "./SlideMenu/SlideMenu";
import SlideMenuBD from "../Backdrop/SlideMenuBD/SlideMenuBD";
import BDMobile from "../Backdrop/BDMobile/BDMobile";
import Spinner from "../Spinner/Spinner";
import { getRooms } from "../../axios";
import { AuthContext } from "../../hooks/AuthContext";

import "./SideBar.css";

const SideBar = ({
  setRoomDetails,
  setMessages,
  messages,
  setShowSideBar,
  showSideBar
}) => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSlideMenu, setShowSlideMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedRooms, setSearchedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { token, userId, userImage } = useContext(AuthContext);

  useEffect(() => {
    if (rooms.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [rooms.length]);

  useEffect(() => {
    if (token) {
      getRooms(token, userId).then((res) => {
        setRooms(res.data);
      });
    }
  }, [setRooms, token, userId]);

  useEffect(() => {
    if (rooms && searchText.length > 0) {
      const searchedRooms = rooms.filter((r) =>
        r.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchedRooms(searchedRooms);
    } else if (rooms && searchText.length === 0) {
      setSearchedRooms(rooms);
    }
  }, [rooms, searchText]);

  return (
    <div>
      <Modal
        show={showModal}
        onClick={() => setShowModal(false)}
        setRooms={setRooms}
      />
      {showSlideMenu && <SlideMenuBD onClick={() => setShowSlideMenu(false)} />}

      {showSideBar && <BDMobile mobile onClick={() => setShowSideBar(false)} />}

      <CSSTransition
        in={window.screen.width < 680 ? showSideBar : true}
        timeout={300}
        classNames="sidebar__mobile"
        mountOnEnter
        unmountOnExit
      >
        <div className="sidebar">
          <div className="sidebar__header">
            <IconButton
              onClick={() => setShowSlideMenu((prevState) => !prevState)}
              style={{ padding: "8px", zIndex: showSlideMenu && 1 }}
            >
              <Avatar src={userImage} />
            </IconButton>
            <div className="sidebar__headerRight">
              <IconButton>
                <DonutLarge />
              </IconButton>
              <IconButton>
                <Chat />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </div>

            <SlideMenu show={showSlideMenu} />
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                  <SearchOutlined />
                  <input
                    type="text"
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                    placeholder="Search a chat"
                  />
                </div>
              </div>

              <div className="sidebar__addRoom">
                <Button fullWidth onClick={() => setShowModal(true)}>
                  <Add fontSize="small" />
                  <h3 className="sidebar__addRoomHeader">Add Room</h3>
                </Button>
              </div>

              <div className="sidebar__chats">
                {searchedRooms &&
                  searchedRooms.map((room) => {
                    return (
                      <SideBarChat
                        key={room._id}
                        room={room}
                        setRoomDetails={setRoomDetails}
                        setMessages={setMessages}
                        messages={messages}
                        setShow={() => setShowSideBar(false)}
                        setIsLoading={setIsLoading}
                      />
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

export default SideBar;
