import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import {
  Button,
  Alert,
  Container,
  Card,
  Form,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { auth, fs } from "../../Config/Config";

function LiveOrder() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";

  const [liveOrders, setLiveOrders] = useState();
  const history = useHistory();

  useEffect(() => {
    const getLiveOrderFromFirebase = [];
    const subscriber = fs
      .collection("liveorder")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getLiveOrderFromFirebase.push({ ...doc.data(), key: doc.id });
        });
        setLiveOrders(getLiveOrderFromFirebase);
      });
    return () => subscriber();
  }, []);

  function handleAccept(liveorder, key) {
    fs.collection("orderHistory").add({
      ...liveorder,
      status: "accepted",
    });
    fs.collection("liveorder")
      .doc(key)
      .delete()
      .then(() => {
        history.push({
          pathname: "/receipt",
          state: {
            orders: { ...liveorder, status: "accepted" },
          },
        });
        // window.location.reload(false);
      });
  }

  function handleDecline(liveorder, key) {
    fs.collection("orderHistory").add({
      ...liveorder,
      status: "declined",
    });
    fs.collection("liveorder")
      .doc(key)
      .delete()
      .then(() => {
        window.location.reload(false);
      });
  }

  console.log(liveOrders);

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
        {/* loop all live order */}
        {liveOrders ? (
          <>
            {liveOrders.map((liveorder) => (
              <div
                style={{
                  overflowY: "scroll",
                  height: "400px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  margin: "5px",
                }}
              >
                <Card
                  style={{
                    width: "400px",
                  }}
                >
                  <Card.Body>
                    <Card.Title>
                      <p style={{ fontWeight: "bold" }}>ORDER</p>
                      <p># {liveorder.orderNo}</p>
                    </Card.Title>
                    <Card.Text>{liveorder.date}</Card.Text>
                    {liveorder.payment.type === "cash" ? (
                      <>
                        {liveorder.pickupState ? (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              CASH Collection
                            </Card.Title>
                          </>
                        ) : (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              CASH Delivery
                            </Card.Title>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {liveorder.pickupState ? (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              PAYPAL Collection
                            </Card.Title>
                          </>
                        ) : (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              PAYPAL Delivery
                            </Card.Title>
                          </>
                        )}
                      </>
                    )}
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    {liveorder.cartProducts.map((cartProduct) => (
                      <>
                        <ListGroupItem>
                          <p>
                            {cartProduct.qty} x {cartProduct.title}
                          </p>
                          {cartProduct.option.map((option) => (
                            <>
                              <p style={{ fontWeight: "bold" }}>
                                {option.title}{" "}
                                <label style={{ fontWeight: "normal" }}>
                                  - {option.menu} (£
                                  {parseFloat(option.price).toFixed(2)})
                                </label>
                              </p>
                            </>
                          ))}
                          {cartProduct.addOn.map((addon) => (
                            <>
                              <p style={{ fontWeight: "bold" }}>
                                {addon.title}{" "}
                                <label style={{ fontWeight: "normal" }}>
                                  - {addon.menu} (£
                                  {parseFloat(addon.price).toFixed(2)})
                                </label>
                              </p>
                            </>
                          ))}
                        </ListGroupItem>
                      </>
                    ))}
                    {/* loop order this option and addon font weight bold*/}
                    {/* end loop order */}
                  </ListGroup>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "bold" }}>
                      TOTAL £{parseFloat(liveorder.Total).toFixed(2)} <br></br>
                      PHONE: {liveorder.Telephone}
                    </Card.Title>
                    <Card.Text>
                      {liveorder.user +
                        " " +
                        liveorder.address +
                        " " +
                        liveorder.postCode}
                    </Card.Text>
                  </Card.Body>
                  <Card.Body>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(liveorder, liveorder.key)}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDecline(liveorder, liveorder.key)}
                    >
                      DECLINE
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </>
        ) : null}

        {/* end loop all live order */}
      </Container>
      <Footer />
    </div>
  );
}

export default LiveOrder;
