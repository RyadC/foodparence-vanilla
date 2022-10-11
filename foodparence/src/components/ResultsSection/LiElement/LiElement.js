import React from "react";
import "./LiElement.css";

const LiElement = (props) => {
  const { nameElement } = props;


  return (
    <li className="resultProduct-section-list-item">{nameElement}</li>
  )
}

export default LiElement;