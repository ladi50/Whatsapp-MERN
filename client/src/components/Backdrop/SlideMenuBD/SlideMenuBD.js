import React from "react";
import ReactDOM from "react-dom";

import "./SlideMenuBD.css";

const SlideMenuBD = (props) => {
  return ReactDOM.createPortal(
    <div className="slideMenu__backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop")
  );
};

export default SlideMenuBD;
