import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Container, Alert } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import { useHistory, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";

function Order() {
  const location = useLocation();
  const history = useHistory();

  const [orders, setOrders] = useState();
  useEffect(() => {
    try {
      setOrders(location.state.orders);
    } catch {
      history.push("/orderhistory");
    }
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  function handlePrint() {
    if (orders) {
      //use localStorage send data
      console.log(orders);
      localStorage.setItem("orders", JSON.stringify(orders));
      let newWindow = window.open(
        "/receipt",
        "Popup",
        "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=300, height=500"
      );
      newWindow.print();
      window.addEventListener(
        "beforeunload",
        function (e) {
          this.localStorage.removeItem("orders");
        },
        false
      );

      //   history.push({
      //     pathname: "/receipt",
      //     state: {
      //       orders: orders,
      //     },
      //   });
    }
  }

  return (
    <>
      <Header />
      <Menu />
      <Container
        className="d-flex justify-content-center"
        style={{ minHeight: "100vh", marginTop: "20px" }}
      >
        <div className="w-100" style={{ maxWidth: "1000px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Order Details</h2>
              <div className="text-center mb-3">
                <Button variant="secondary" style={{ marginBottom: "20px" }}>
                  Completed
                </Button>
                <Button
                  variant="success"
                  onClick={handlePrint}
                  style={{ marginBottom: "20px" }}
                >
                  PRINT
                </Button>
                <p>Date: </p>
                <p>Name: </p>
                <p>Address: </p>
                <p>Town: </p>
                <p>County: </p>
                <p>Postcode: </p>
                <p>Phone Number: </p>
                <p>Email: </p>
                <p>Payment: </p>

                <p>Cost: </p>
                <p>Shipping: </p>
                <p>Total: </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Order;
