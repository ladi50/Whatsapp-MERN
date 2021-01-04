import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";

import { AuthContext } from "../../../hooks/AuthContext";
import { deleteAccount } from "../../../axios";

import "./SlideMenu.css";

const SlideMenu = (props) => {
  const { logout, token, userId } = useContext(AuthContext);

  const deleteAccountHandler = async () => {
    try {
      const res = await deleteAccount(userId, token);

      if (res.status === 200) {
        logout();
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <CSSTransition
        in={props.show}
        classNames="slideMenu"
        timeout={200}
        unmountOnExit
        mountOnEnter
      >
        <div className="slideMenu-div">
          <Button
            onClick={deleteAccountHandler}
            fullWidth
            style={{
              backgroundColor: "#8A8787",
              color: "whitesmoke",
              borderRadius: "0"
            }}
          >
            <h3>Delete Account</h3>
          </Button>
          <Button
            onClick={() => {
              logout();
              window.location.reload();
            }}
            fullWidth
            style={{
              backgroundColor: "red",
              color: "whitesmoke",
              borderRadius: "0"
            }}
          >
            <h3>Logout</h3>
          </Button>
        </div>
      </CSSTransition>
    </React.Fragment>
  );
};

export default SlideMenu;
