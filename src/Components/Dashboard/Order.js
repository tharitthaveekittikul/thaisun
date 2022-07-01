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

  if (orders) {
    return (
      <div className="wrapper">
        <Header />
        <Menu />
        <div className="content-wrapper">
          <div
            style={{
              paddingTop: "50px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#f4f6f9",
            }}
          >
            <Container
              className="d-flex justify-content-center"
              style={{ minHeight: "100vh", marginTop: "20px" }}
            >
              <div className="w-100" style={{ maxWidth: "1000px" }}>
                <Card>
                  <Card.Body>
                    <h2 className="text-center mb-4">Order Details</h2>
                    <h4 className="text-center mb-4"># {orders.orderNo}</h4>
                    {orders.status ? (
                      <>
                        {orders.status === "accepted" ? (
                          <h3 className="text-center mb-4">
                            Status : Accepted
                          </h3>
                        ) : (
                          <>
                            <h3 className="text-center mb-4">
                              Status : Declined
                            </h3>
                            <h6 className="text-center mb-4">
                              Reason : {orders.reason}
                            </h6>
                          </>
                        )}{" "}
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="text-center mb-3">
                      <Button
                        variant="secondary"
                        style={{ marginBottom: "20px" }}
                      >
                        Completed
                      </Button>
                      <Button
                        variant="success"
                        onClick={handlePrint}
                        style={{ marginBottom: "20px" }}
                      >
                        PRINT
                      </Button>
                      <p>Date: {orders.date}</p>
                      <p>Name: {orders.user}</p>
                      <p>Address: {orders.address}</p>
                      <p>Town: {orders.town}</p>
                      <p>County: {orders.county}</p>
                      <p>Postcode: {orders.postCode}</p>
                      <p>Phone Number: {orders.Telephone}</p>
                      <p>Email: {orders.email}</p>
                      <p>Payment: {orders.payment.type}</p>

                      <p>Cost: £{parseFloat(orders.Subtotal).toFixed(2)}</p>
                      <p>Shipping: </p>
                      <p>Total: £{parseFloat(orders.Total).toFixed(2)}</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
  return null;
}

export default Order;
