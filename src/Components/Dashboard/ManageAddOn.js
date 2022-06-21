import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";

function ManageAddOn() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  if (!isAdmin) {
    console.log(isAdmin);
    return <Redirect to="/" />;
  }
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div
        style={{
          maxWidth: "1250px",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        {message ? <Alert variant="success">{message}</Alert> : ""}
        {error ? <Alert variant="danger">{error}</Alert> : ""}
      </div>
      <Footer />
    </div>
  );
}

export default ManageAddOn;
