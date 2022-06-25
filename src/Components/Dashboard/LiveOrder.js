import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";

function LiveOrder() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";

  const [liveOrder, setLiveOrder] = useState();

  useEffect(() => {
    const getUserFormFirebase = [];
    const subscriber = fs
      .collection("liveorder")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUserFormFirebase.push({ ...doc.data(), key: doc.id });
        });
        setLiveOrder(getUserFormFirebase);
      });
    return () => subscriber();
  }, []);

  console.log(liveOrder);

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
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}></div>
      </Container>
      <Footer />
    </div>
  );
}

export default LiveOrder;
