import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faHistory,
  faRectangleAd,
  faUser,
  faUserPlus,
  faGaugeSimpleHigh,
  faBowlRice,
  faCartPlus,
  faBarChart,
  faTicket,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
function Menu() {
  const history = useHistory();
  const [user, setUser] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            setUser(snapshot.data().FirstName + " " + snapshot.data().LastName);
          });
      } else {
        history.push("/login");
      }
    });
  }, []);

  // get live order length
  // const [totalOrders, setOrders] = useState();
  // useEffect(() => {
  //   fs.collection("liveorder").onSnapshot((snapshot) => {
  //     const qty = snapshot.docs.length;
  //     setOrders(qty);
  //   });
  // }, []);

  function GetTotalOrdersFromFirebase() {
    const getTotalOrdersFromFirebase = [];
    const [totalOrders, setTotalOrders] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("liveorder").get();
      snapshot.docs.map((doc) => {
        getTotalOrdersFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      const qty = getTotalOrdersFromFirebase.length;
      setTotalOrders(qty);
    }, []);
    return totalOrders;
  }

  const totalOrders = GetTotalOrdersFromFirebase();

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/dashboard" className="brand-link">
        <img
          src="dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </Link>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <Link to="/profile" className="d-block">
              {user}
            </Link>
          </div>
        </div>
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-header">ORDER</li>
            <li className="nav-item">
              <Link to="/orderhistory" className="nav-link">
                <FontAwesomeIcon icon={faHistory} className="fas nav-icon" />
                <p>Order History</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/liveorder" className="nav-link">
                <FontAwesomeIcon
                  icon={faGaugeSimpleHigh}
                  className="fas nav-icon"
                />
                <p>
                  Live Order
                  <span className="badge badge-info right">{totalOrders}</span>
                </p>
              </Link>
            </li>
            <li className="nav-header">Manage</li>
            <li className="nav-item">
              <Link to="/customer" className="nav-link">
                <FontAwesomeIcon icon={faUser} className="fas nav-icon" />
                <p>Customer</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/manageadmin" className="nav-link">
                <FontAwesomeIcon icon={faUserPlus} className="fas nav-icon" />
                <p>Manage Admin</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/manageproducts" className="nav-link">
                <FontAwesomeIcon icon={faBowlRice} className="fas nav-icon" />
                <p>Manage Products</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/addproducts" className="nav-link">
                <FontAwesomeIcon icon={faCartPlus} className="fas nav-icon" />
                <p>Add Products</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/managecategory" className="nav-link">
                <FontAwesomeIcon icon={faBarChart} className="fas nav-icon" />
                <p>Manage Category</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fixedaddon" className="nav-link">
                <i className="fas fa-circle nav-icon" />
                <p>Fixed Add-on</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/managecoupon" className="nav-link">
                <FontAwesomeIcon icon={faTicket} className="fas nav-icon" />
                <p>Manage Voucher</p>
              </Link>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
}

export default Menu;
