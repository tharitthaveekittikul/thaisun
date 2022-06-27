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
  Modal,
} from "react-bootstrap";
import { auth, fs } from "../../Config/Config";

function LiveOrder() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";

  const [liveOrders, setLiveOrders] = useState();
  const history = useHistory();

  const [showSure, setShowSure] = useState(false);
  const handleCloseSure = () => setShowSure(false);
  const handleShowSure = () => {
    console.log(orderTemp);
    setShowSure(true);
  };

  const [showReason, setShowReason] = useState(false);
  const handleCloseReason = () => setShowReason(false);
  const [orderTemp, setOrderTemp] = useState();

  const [reason, setReason] = useState("");
  const [etc, setETC] = useState("");

  function handleChangeReason(e) {
    console.log(e.target.value);
    setReason(e.target.value);
  }

  function handleETCReason(e) {
    setETC(e.target.value);
  }
  const handleShowReason = (liveorder, key) => {
    setOrderTemp([liveorder, key]);
    setShowReason(true);
  };

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
    let orders = { ...liveorder, status: "accepted" };
    fs.collection("orderHistory").add(orders);
    fs.collection("liveorder")
      .doc(key)
      .delete()
      .then(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
        let newWindow = window.open(
          "/receipt",
          "Popup",
          "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=300, height=500"
        );
        window.location.reload(false);
        newWindow.print();
        window.addEventListener(
          "beforeunload",
          function (e) {
            this.localStorage.removeItem("orders");
          },
          false
        );

        // history.push({
        //   pathname: "/receipt",
        //   state: {
        //     orders: { ...liveorder, status: "accepted" },
        //   },
        // });
        // window.location.reload(false);
      });
  }

  function handleDecline() {
    if (reason === "etc.") {
      fs.collection("orderHistory").add({
        ...orderTemp[0],
        status: "declined",
        reason: etc,
      });
    } else {
      fs.collection("orderHistory").add({
        ...orderTemp[0],
        status: "declined",
        reason: reason,
      });
    }

    fs.collection("liveorder")
      .doc(orderTemp[1])
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
                      onClick={() => {
                        handleShowReason(liveorder, liveorder.key);
                        // handleDecline(liveorder, liveorder.key);
                      }}
                    >
                      DECLINE
                    </Button>
                  </Card.Body>
                </Card>
                <Modal show={showReason} onHide={handleCloseReason}>
                  <Modal.Header closeButton>
                    <Modal.Title>Why declined the order?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <select
                      className="form-control"
                      required={true}
                      onChange={(e) => {
                        handleChangeReason(e);
                      }}
                    >
                      <option value="">Select Reason</option>
                      <option value="Too many orders cannot be delivered but you can be picked up at the restaurant.">
                        Too many orders cannot be delivered but you can be
                        picked up at the restaurant.
                      </option>
                      <option value="Driver is not available.">
                        Driver is not available.
                      </option>
                      <option value="Kitchen is closed.">
                        Kitchen is closed.
                      </option>
                      <option value="etc.">etc.</option>
                    </select>

                    {reason === "etc." ? (
                      <Form onSubmit={(event) => event.preventDefault()}>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label>Reason Details</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(event) => handleETCReason(event)}
                            required={true}
                            // placeholder="Eg. Food allergies, food strength etc..."
                          />
                        </Form.Group>
                      </Form>
                    ) : null}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReason}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleShowSure}
                      type="submit"
                    >
                      Send
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={showSure} onHide={handleCloseSure}>
                  <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSure}>
                      Dismiss
                    </Button>
                    <Button variant="primary" onClick={handleDecline}>
                      Cancel the order
                    </Button>
                  </Modal.Footer>
                </Modal>
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
