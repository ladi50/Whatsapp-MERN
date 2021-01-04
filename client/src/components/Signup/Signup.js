import React, { useRef, useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { Avatar, Button } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import { signup } from "../../axios";
import { AuthContext } from "../../hooks/AuthContext";

import "../Modal/Modal.css";

const Signup = (props) => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState();

  const image = useRef();

  const { login } = useContext(AuthContext);

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

  useEffect(() => {
    return () => {
      setFile(null);
      setImageUrl(null);
      setError(null);
      setErrMessage(null);
    };
  }, []);

  const imagePickHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setFile(e.target.files[0]);
    }
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setImageUrl(null);
    }
  };

  const changeInputHandler = (e) => {
    const { value, name } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("imageUrl", file);

    if (
      !file ||
      input.password.length === 0 ||
      input.email.length === 0 ||
      input.username.length === 0
    ) {
      return setError(true);
    }

    try {
      const res = await signup(formData);

      if (res.status === 201) {
        setIsLoading(false);

        props.onClick();

        login(
          res.data.user._id,
          res.data.user.username,
          res.data.user.imageUrl,
          res.data.token
        );

        setInput({
          username: "",
          email: "",
          password: ""
        });
        setFile(null);
        setImageUrl(null);
        setError(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
      setErrMessage(err.response.data);
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
          <h2 style={{ marginBottom: "30px" }}>Signup</h2>
          {error && (
            <p className="modal__error-message">
              {errMessage ? errMessage : "All fields are required!"}
            </p>
          )}
          <form onSubmit={signupHandler}>
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
              User Image
            </Button>
            <label className="modal__input-label">Username</label>
            <input
              className="modal__input"
              type="text"
              name="username"
              value={input.username}
              onChange={changeInputHandler}
              placeholder="Enter username"
            />
            <label className="modal__input-label">Email</label>
            <input
              className="modal__input"
              type="email"
              name="email"
              value={input.email}
              onChange={changeInputHandler}
              placeholder="Enter email"
            />
            <label className="modal__input-label">Password</label>
            <input
              className="modal__input"
              type="password"
              name="password"
              value={input.password}
              onChange={changeInputHandler}
              placeholder="Enter password"
            />
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
              Signup
            </Button>
          </form>
        </div>
      </CSSTransition>
    </div>,
    document.getElementById("modal")
  );
};

export default Signup;
