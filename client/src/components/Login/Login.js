import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import { loginUser } from "../../axios";
import { AuthContext } from "../../hooks/AuthContext";

const Login = (props) => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState();

  const { login } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      setError(null);
      setErrMessage(null);
    };
  }, []);

  const changeInputHandler = (e) => {
    const { value, name } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrMessage(null);
    setError(null);

    if (input.password.length === 0 || input.email.length === 0) {
      return setError(true);
    }

    try {
      const res = await loginUser({
        email: input.email,
        password: input.password
      });

      if (res.status === 200) {
        setIsLoading(false);

        props.onClick();

        login(
          res.data.user._id,
          res.data.user.username,
          res.data.user.imageUrl,
          res.data.token
        );

        setInput({
          email: "",
          password: ""
        });
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
          <h2 style={{ marginBottom: "30px" }}>Login</h2>
          {error && (
            <p className="modal__error-message">
              {errMessage ? errMessage : "All fields are required!"}
            </p>
          )}
          <form onSubmit={loginHandler}>
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
              Login
            </Button>
          </form>
        </div>
      </CSSTransition>
    </div>,
    document.getElementById("modal")
  );
};

export default Login;
