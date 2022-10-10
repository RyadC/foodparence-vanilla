import React from "react";
import "./ResultTitle.css";

const ResultTitle = (props) => {
  const { resultTitle } = props;
  return (
    <h3 className="resultProduct-section-h3">{resultTitle}</h3>
  )
};

export default ResultTitle;