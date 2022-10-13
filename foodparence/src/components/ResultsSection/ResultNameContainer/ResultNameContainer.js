import React from "react";
import ResultNameProduct from "../ResultNameProduct/ResultNameProduct";
import ResultTitle from "../ResultatTitle/ResultTitle";
import "./ResultNameContainer.css";
import ResultListElements from "../ResultListElements/ResultListElements";


const ResultNameContainer = (props) => {
  const { resultTitle, productName, list } = props;
  let elements = null;

  console.log(resultTitle, productName, list)

  if(resultTitle === 'Produit'){
    elements = <ResultNameProduct productName={productName} />
  } else {
    elements = <ResultListElements list={list} />
  }

  return (
    <div className="resultName-section resultProduct-section-sousSection center-BP" id="resultNameSection">
      <ResultTitle resultTitle={resultTitle} />
      {elements} {/* product = brand || list of allergens or additifs */}
    </div>
  )
}

export default ResultNameContainer;