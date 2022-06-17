import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
