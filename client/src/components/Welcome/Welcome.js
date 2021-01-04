import { Button } from "@material-ui/core";
import React, { useState } from "react";

import Signup from "../Signup/Signup";
import Login from "../Login/Login";

import "./Welcome.css";

const Welcome = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="welcome__div">
      <Signup show={showSignup} onClick={() => setShowSignup(false)} />
      <Login show={showLogin} onClick={() => setShowLogin(false)} />
      <img
        src="data:image/png;base64,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"
        alt="whatsapp_icon"
        width="100vw"
        height="100vh"
      />
      <h2>Welcome to Whatsapp Clone</h2>
      <div>
        <Button
          onClick={() => setShowSignup(true)}
          style={{
            width: "100px",
            margin: "0 5px",
            fontWeight: "600",
            textTransform: "none",
            fontSize: "large"
          }}
        >
          Signup
        </Button>
        <Button
          onClick={() => setShowLogin(true)}
          style={{
            width: "100px",
            margin: "0 5px",
            fontWeight: "600",
            textTransform: "none",
            fontSize: "large"
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
