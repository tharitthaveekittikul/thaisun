import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/thaisunlogo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../Config/Config";
import { useHistory } from "react-router-dom";

function Navbar({ user, isAdmin, totalProducts }) {
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
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="thaisun-logo" />
          </Link>
        </div>
      </div>
      <div className="rightside">
        {/* <div>
          <Link className="navlink" to="signup">
            SIGN UP
          </Link>
        </div>
        <div>
          <Link className="navlink" to="login">
            LOGIN
          </Link>
        </div> */}
        {!user ? (
          <>
            <div>
              <Link className="navlink" to="/signup">
                SIGN UP
              </Link>
            </div>
            <div>
              <Link className="navlink" to="/login">
                LOGIN
              </Link>
            </div>
          </>
        ) : (
          <>
            {isAdmin ? (
              <div>
                <Link className="navlink" to="/dashboard">
                  Dashboard
                </Link>
              </div>
            ) : (
              <></>
            )}

            <div>
              <Link className="navlink" to="/profile">
                {user}
              </Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="/cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className="cart-indicator">{totalProducts}</span>
            </div>
            <div className="btn btn-danger btn-md" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
