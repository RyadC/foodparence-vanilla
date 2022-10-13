import React from "react";
import "./NavbarLink.css"

const NavbarLink = (props) => {
  const { nameLink, onRouteChange } = props
  return (
    <li className="nav-menu-item">
      <a className="nav-menu-item-link" href="#0" onClick={() => {onRouteChange(nameLink)}}>{nameLink}</a>
    </li>
  )
}

export default NavbarLink;