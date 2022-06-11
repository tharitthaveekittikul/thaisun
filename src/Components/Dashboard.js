import React from "react";
import { Route, Redirect } from "react-router-dom";

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
        return <div>Dashboard</div>;
      }}
    />
  );
}

export default Dashboard;
