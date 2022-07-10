import React from "react";
import { Route, Redirect } from "react-router-dom";
import Content from "./Content";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

function Dashboard() {
  //   const isLogIn = JSON.parse(localStorage.getItem("isLogIn")).status === "True";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  //   console.log(isLogIn);
  //   console.log(isAdmin);

  return (
    <Route
      render={(props) => {
        if (!isLogIn) {
          return <Redirect to="/login" />;
        }
        if (!isAdmin) {
          return <Redirect to="/" />;
        }
        return (
          <div className="wrapper">
            {/* Dashboard
            <Link to="/addproducts">Add Product</Link>
            <Link to="/addadmin"></Link> */}
            <Header />
            <Menu />
            <Content />
            <Footer />
          </div>
        );
      }}
    />
  );
}

export default Dashboard;
