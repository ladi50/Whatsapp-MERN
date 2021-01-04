import React, { useRef, useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { Avatar, Button } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";

import "./Modal.css";
import Spinner from "../Spinner/Spinner";
import Backdrop from "../Backdrop/Backdrop";
import { createRoom } from "../../axios";
import { AuthContext } from "../../hooks/AuthContext";

const Modal = (props) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const image = useRef();

  const { token, userId } = useContext(AuthContext);

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    if (fileReader.error) {
      throw new Error("Could not upload your picture! Please try again.");
    }

    fileReader.onloadend = () => {
      setImageUrl(fileReader.result);
    };
  }, [file]);

  const imagePickHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setFile(e.target.files[0]);
    }
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setImageUrl(null);
    }
  };

  const addRoomHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", input);
    formData.append("imageUrl", file);
    formData.append("userId", userId.toString());

    if (input.length === 0 || !file) {
      return setError(true);
    }

    try {
      const res = await createRoom(formData, token);
      if (res.data) {
        setIsLoading(false);

        await props.setRooms((prevState) => {
          return [res.data, ...prevState];
        });

        props.onClick();

        setInput("");
        setFile(null);
        setImageUrl(null);
        setError(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
    }
  };

  return ReactDOM.createPortal(
    <div>
      {props.show && <Backdrop onClick={() => props.onClick()} />}
      <CSSTransition
        classNames="modalAnimation"
        in={props.show}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className="modal">
          {isLoading && <Spinner />}
          {error && (
            <p className="modal__error-message">
              Room image and name are required!
            </p>
          )}
          <form onSubmit={addRoomHandler}>
            <Avatar
              className="modal__avatar"
              style={{ width: "70px", height: "70px" }}
              src={imageUrl}
            />
            <input
              type="file"
              name="imageUrl"
              ref={image}
              onChange={imagePickHandler}
              hidden
              accept=".png, .jpeg, .jpg"
            />
            <Button
              onClick={() => image.current.click()}
              style={{
                display: "block",
                margin: "0 auto",
                textTransform: "none",
                marginTop: "15px",
                backgroundColor: "#6F6C6C",
                color: "white"
              }}
            >
              Room Image
            </Button>
            <label className="modal__input-label">Room Name</label>
            <input
              className="modal__input"
              type="text"
              name="roomName"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter room name"
            ></input>
            <Button
              type="submit"
              style={{
                display: "block",
                margin: "0 auto",
                textTransform: "none",
                marginTop: "30px",
                backgroundColor: "rgb(30, 29, 29 )",
                color: "white",
                width: "40%",
                height: "45px"
              }}
            >
              Add Room
            </Button>
          </form>
        </div>
      </CSSTransition>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
