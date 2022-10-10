import React from "react";
import ResultNameProduct from "../ResultNameProduct/ResultNameProduct";
import ResultTitle from "../ResultatTitle/ResultTitle";
import "./ResultNameContainer.css";
import ResultListElements from "../ResultListElements/ResultListElements";


const ResultNameContainer = (props) => {
  const { resultTitle, productName, list } = props;
  console.log(resultTitle, productName, list)
  let elementsContainer = null;

  if(resultTitle === 'Produit'){
    elementsContainer = <ResultNameProduct productName={productName} />
  } else {
    elementsContainer = <ResultListElements list={list} />
  }

  return (
    <div className="resultName-section resultProduct-section-sousSection center-BP" id="resultNameSection">
      <ResultTitle resultTitle={resultTitle} />
      {/* <ResultNameProduct productName={productName} /> */}
      {elementsContainer}
      {/* <!-- H3 class="resultProduct-section-h3": Produit --> */}
      {/* <!-- p: Le produit class="resultName-section-product"--> */}
    </div>
  )
}

export default ResultNameContainer;