import React, { useState, useEffect } from "react";
import { Card, Button, Container } from "react-bootstrap";
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
    // console.log(orders);
  }, [orders]);

  function handlePrint() {
    if (orders) {
      //use localStorage send data
      // console.log(orders);
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
                        style={{ marginBottom: "20px", marginRight: "10px" }}
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
                      <div className="orderdetails">
                        <div className="leftside-orderdetails">
                          <p>Date: </p>
                          <p>Name: </p>
                          <p>House: </p>
                          <p>Address: </p>
                          <p>Town: </p>
                          <p>County: </p>
                          <p>Postcode: </p>
                          <p>Phone Number: </p>
                          <p>Email: </p>
                          <p>Payment: </p>

                          <p>Subtotal: </p>
                          <p>Discount: </p>
                          <p>Delivery Fee: </p>
                          <p>Total: </p>
                        </div>
                        <div className="rightside-orderdetails">
                          <p>{orders.date}</p>
                          <p>{orders.user}</p>
                          {orders.house ? <p>{orders.house}</p> : <p>-----</p>}
                          <p>{orders.address}</p>
                          <p>{orders.town}</p>
                          <p>{orders.county}</p>
                          <p>{orders.postCode}</p>
                          <p>{orders.Telephone}</p>
                          <p>{orders.email}</p>
                          <p>{orders.payment.type}</p>

                          <p>£{parseFloat(orders.Subtotal).toFixed(2)}</p>
                          <p>- £{parseFloat(orders.Discount).toFixed(2)}</p>
                          <p>£{parseFloat(orders.Fee).toFixed(2)}</p>
                          <p>£{parseFloat(orders.Total).toFixed(2)}</p>
                        </div>
                      </div>
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
