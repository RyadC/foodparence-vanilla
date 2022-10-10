import React from "react";
import "./BarCodeSearch.css";

const BarCodeSearch = (props) => {
  const { onInputChange } = props;

  return (
    <div className="search-codeBarre">
    {/* <!-- <p className="search-codeBarre__consigne">
      Veuillez entrer le code-barre du produit recherché:
    </p> --> */}

    <label className="search-codeBarre__label" htmlFor="searchProduct">
      Code-barre
      <input className="search-codeBarre__input" type="text" name="search" id="searchProduct" autoComplete="off" autoFocus onChange={onInputChange}/>
    </label>
    <button href="#id-resultProductSection" className="form-submit" type="submit" value="Rechercher" id="submit" >
      <svg xmlns="http://www.w3.org/2000/svg" width="39.777" height="39.787" viewBox="0 0 39.777 39.787">
        <path id="Icon_ionic-ios-search" data-name="Icon ionic-ios-search" d="M43.811,41.4,32.748,30.234a15.766,15.766,0,1,0-2.393,2.424l10.99,11.094a1.7,1.7,0,0,0,2.4.062A1.714,1.714,0,0,0,43.811,41.4ZM20.359,32.793a12.449,12.449,0,1,1,8.8-3.646A12.372,12.372,0,0,1,20.359,32.793Z" transform="translate(-4.5 -4.493)" />
      </svg>
    </button>
  </div>
  )
}

export default BarCodeSearch;