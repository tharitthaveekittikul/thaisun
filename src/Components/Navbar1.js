import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Images/thaisunlogo_circle.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../Config/Config";
import { useHistory } from "react-router-dom";
import { Nav, Navbar, NavLink, NavbarBrand } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { user_circle } from "react-icons-kit/ikons/user_circle";
import { logout } from "react-icons-kit/ikons/logout";
import { dashboard } from "react-icons-kit/fa/dashboard";

function Navbar1({ user, isAdmin, totalProducts }) {
  const changeHam = useMediaQuery({ query: "(max-width: 991px)" });
  const history = useHistory();
  async function handleLogout() {
    await auth.signOut().then(() => {
      localStorage.setItem("isLogIn", "False");
      localStorage.clear();

      history.push("/");
    });
  }
  if (isAdmin && localStorage.getItem("isLogIn")) {
    localStorage.setItem("isAdmin", isAdmin);
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="white"
        className="shadow bg-white"
      >
        <Navbar.Toggle
          aria-controls="navbarScroll"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
        />

        {changeHam ? (
          <Nav className="m-auto">
            <NavLink
              className="navbar-logo-font1"
              style={{ color: "black" }}
              eventKey="1"
              as={Link}
              to="/"
            >
              Thaisun
            </NavLink>
          </Nav>
        ) : (
          <Nav>
            <NavbarBrand eventKey="1" as={Link} to="/">
              <img src={logo} width="60px" alt="thaisun-logo" />
              <span className="navbar-logo-font"> Thaisun</span>
            </NavbarBrand>
          </Nav>
        )}
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ml-auto">
            {!user ? (
              <>
                <NavLink eventKey="1" as={Link} to="/signup">
                  <span className="navbar-font">Sign Up</span>
                </NavLink>
                <NavLink eventKey="2" as={Link} to="/login">
                  <span className="navbar-font">Login</span>
                </NavLink>
              </>
            ) : (
              <>
                {changeHam ? (
                  <>
                    {isAdmin ? (
                      <NavLink
                        className="navbar-font-ham"
                        eventKey="1"
                        as={Link}
                        to="/dashboard"
                      >
                        <Icon
                          className="navbar-icon"
                          icon={dashboard}
                          size={26}
                        />
                        <span>Dashboard</span>
                      </NavLink>
                    ) : null}
                    <NavLink
                      className="navbar-font-ham"
                      style={{
                        position: "relative",
                      }}
                      eventKey="2"
                      as={Link}
                      to="/order"
                    >
                      <Icon
                        className="navbar-icon"
                        icon={shoppingCart}
                        size={26}
                      />
                      <span>Your Basket</span>
                    </NavLink>
                    <NavLink
                      className="navbar-font-ham"
                      eventKey="3"
                      as={Link}
                      to="/profile"
                    >
                      <Icon
                        className="navbar-icon"
                        icon={user_circle}
                        size={26}
                      />
                      <span>{user}</span>
                    </NavLink>
                    <NavLink
                      className="navbar-font-ham"
                      eventKey="4"
                      onClick={handleLogout}
                    >
                      <Icon
                        className="navbar-icon"
                        icon={logout}
                        size={26}
                        style={{ color: "#e80532" }}
                      />
                      <span>Logout</span>
                    </NavLink>
                  </>
                ) : (
                  <>
                    {isAdmin ? (
                      <NavLink
                        className="navbar-font"
                        eventKey="1"
                        as={Link}
                        to="/dashboard"
                      >
                        <Icon
                          className="navbar-icon"
                          icon={dashboard}
                          size={26}
                        />
                      </NavLink>
                    ) : null}
                    <NavLink
                      className="navbar-font"
                      style={{
                        position: "relative",
                      }}
                      eventKey="2"
                      as={Link}
                      to="/order"
                    >
                      <Icon
                        className="navbar-icon"
                        icon={shoppingCart}
                        size={26}
                      />
                      {totalProducts == 0 ? null : (
                        <span className="cart-indicator1">{totalProducts}</span>
                      )}
                    </NavLink>
                    <NavLink
                      className="navbar-font"
                      eventKey="3"
                      as={Link}
                      to="/profile"
                    >
                      <Icon
                        className="navbar-icon"
                        icon={user_circle}
                        size={26}
                      />
                    </NavLink>
                    <NavLink
                      className="navbar-font"
                      eventKey="4"
                      onClick={handleLogout}
                    >
                      <Icon
                        className="navbar-icon"
                        icon={logout}
                        size={26}
                        style={{ color: "#e80532" }}
                      />
                    </NavLink>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navbar1;
