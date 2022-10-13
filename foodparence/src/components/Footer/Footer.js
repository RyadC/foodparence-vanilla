import React from "react";
import "./Footer.css"

const Footer = (props) => {


  return(
    <footer className="footer">
    <div className="marque">
      <span className="marque-text">FoodParence</span>
      <span className="marque-copyright">&copy;</span>
    </div>

    <div className="agence">
      <div className="agence-box">
        <span className="agence-text">Neiyad Agency</span>
        <span className="agence-copyright">&copy;</span>
      </div>
    </div>
  </footer>
  )

}

export default Footer;