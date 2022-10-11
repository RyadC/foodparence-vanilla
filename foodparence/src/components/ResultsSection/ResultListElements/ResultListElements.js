import React from "react";
import LiElement from "../LiElement/LiElement";
import "./ResultListElements.css";

const ResultListElements = (props) => {
  const { list } = props;

  let listOfLi = [];
  let id = 1;

  for(let element of list){
    console.log(element)
    listOfLi.push(<LiElement nameElement={element} key={id}/>)
    id++;
  }

  console.log(listOfLi)
  return (
    <p className="resultName-section-product">{listOfLi}</p>
  )
}

export default ResultListElements;