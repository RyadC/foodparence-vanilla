import React from "react";
import "./CheckboxSearch.css";

const CheckboxSearch = (props) => {
  const { nameProp, checkboxName, handleCheckbox } = props;
  return (
    <label className="search-detailsProduct-labelCheckbox" htmlFor={`${nameProp}-checkbox`}>
      <input className={`search-detailsProduct__${nameProp} search-detailsProduct-checkbox`} type="checkbox" name={`${nameProp}-checkbox`} id={`${nameProp}-checkbox`} 
      onChange={() => handleCheckbox(nameProp)} 
      // defaultChecked={checked} 
      />
      {checkboxName}
    </label>
  )
}

export default CheckboxSearch;