import React from "react";
import ReactDOM from "react-dom";

import "./BDMobile.css";

const BDMobile = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop-mobile" onClick={props.onClick}></div>,
    document.getElementById("backdrop")
  );
};

export default BDMobile;
