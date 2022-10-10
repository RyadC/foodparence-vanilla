import React from "react";
import "./ResultListElements.css";

const ResultListElements = (props) => {
  const { list } = props;

  return (
    <p className="resultName-section-product">{list}</p>
  )
}

export default ResultListElements;