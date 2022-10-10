import React from "react";
import logo from "../../../assets/images/Groupe 4.png";
import "../../root.css";
import "./Navbar.css"
import NavbarLink from "../NavbarLink/NavbarLink";


const Navbar = (props) => {
  return (
    <React.Fragment>
      <header className="header">
        <div className="header-logo">
          <a className="header-logo-link" href="index.html">
            <img className="header-logo-img" src={logo} alt="Logo de foodParence" />
          </a>
        </div>
        <nav className="nav">
          <ul className="nav-menu">
            <NavbarLink nameLink={'Ressources'} />
            <NavbarLink nameLink={'Fonctionnement'} />
            <NavbarLink nameLink={'Contact'} />
          </ul>


        </nav>
      </header>



    </React.Fragment>
  )
}

export default Navbar;