import React from "react";
import "./ResultNameProduct.css";

const ResultNameProduct = (props) => {
  const { productName } = props;

  return (
    <p className="resultName-section-product">{productName}</p>
  )
}

export default ResultNameProduct;