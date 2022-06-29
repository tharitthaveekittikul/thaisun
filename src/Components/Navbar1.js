import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Images/thaisunlogo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../Config/Config";
import { useHistory } from "react-router-dom";
import { Nav, Navbar, NavLink, NavbarBrand } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

function Navbar1({ user, isAdmin, totalProducts }) {
  const changeHam = useMediaQuery({ query: "(max-width: 992px)" });
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
        className="shadow p-3 mb-5 bg-white rounded"
      >
        <Navbar.Toggle
          aria-controls="navbarScroll"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav>
            {changeHam ? (
              <>
                <NavLink
                  style={{ color: "black", fontSize: "18px" }}
                  eventKey="1"
                  as={Link}
                  to="/"
                >
                  Home
                </NavLink>
              </>
            ) : (
              <>
                <NavbarBrand
                  style={{ width: "120px", height: "auto" }}
                  eventKey="1"
                  as={Link}
                  to="/"
                >
                  <img src={logo} alt="thaisun-logo" />
                  {"      Thaisun"}
                </NavbarBrand>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            {!user ? (
              <>
                <NavLink
                  style={{ color: "black", fontSize: "18px" }}
                  eventKey="1"
                  as={Link}
                  to="/signup"
                >
                  Sign Up
                </NavLink>
                <NavLink
                  style={{ color: "black", fontSize: "18px" }}
                  eventKey="2"
                  as={Link}
                  to="/login"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <NavLink
                    style={{ color: "black", fontSize: "18px" }}
                    eventKey="1"
                    as={Link}
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                ) : null}
                {changeHam ? (
                  <NavLink
                    style={{ color: "black", fontSize: "18px" }}
                    eventKey="2"
                    as={Link}
                    to="/order"
                  >
                    My Order
                  </NavLink>
                ) : (
                  <NavLink
                    style={{
                      position: "relative",
                      marginLeft: "2px",
                      marginRight: "4px",
                    }}
                    eventKey="2"
                    as={Link}
                    to="/order"
                  >
                    <Icon icon={shoppingCart} size={20} />

                    <span className="cart-indicator1">{totalProducts}</span>
                  </NavLink>
                )}

                <NavLink
                  style={{ color: "black", fontSize: "18px" }}
                  eventKey="3"
                  as={Link}
                  to="/profile"
                >
                  Profile
                </NavLink>
                <NavLink
                  style={{ color: "red", fontSize: "18px" }}
                  eventKey="4"
                  onClick={handleLogout}
                >
                  Logout
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navbar1;
