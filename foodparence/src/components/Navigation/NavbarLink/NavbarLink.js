import React from "react";
import "./NavbarLink.css"

const NavbarLink = (props) => {
  const { nameLink } = props
  return (
    <li className="nav-menu-item">
      <a className="nav-menu-item-link" href="#0">{nameLink}</a>
    </li>
  )
}

export default NavbarLink;