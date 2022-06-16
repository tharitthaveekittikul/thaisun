import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { auth, fs } from "../Config/Config";
import { useHistory } from "react-router-dom";

function Delivery() {
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");

  const history = useHistory();

  const addressRef = useRef();
  const postCodeRef = useRef();

  const postCodeDeliver = ["123", "234"];

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [changePickup, setChangePickup] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            setAddress(snapshot.data().Address);
            setPostCode(snapshot.data().PostCode);
          });
      } else {
      }
    });
  }, []);
  function handleDelivery() {
    setMessage("");
    setError("");
    if (!isLogIn) {
      history.push("/login");
    }
    handleShow();
  }

  function handlePickup() {
    handleClose();
    history.push("/");
  }

  function handleOrder() {
    if (
      postCodeDeliver.toString().includes(postCodeRef.current.value.toString())
    ) {
      //   console.log("can deliver");
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .update({
              Address: addressRef.current.value,
              PostCode: postCodeRef.current.value,
            })
            .then(() => {
              setMessage("Automatically Redirect to Menu");
              localStorage.setItem("Delivery", true);
              localStorage.setItem("Pickup", false);
              handleClose();
              history.push("/");
            });
        } else {
        }
      });
    } else {
      setError("Your address is too far (Unable to deliver).");
      setChangePickup(true);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleDelivery}>
        Delivery
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery</Modal.Title>
        </Modal.Header>
        {message ? <Alert variant="success">{message}</Alert> : ""}
        {error ? <Alert variant="danger">{error}</Alert> : ""}
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                defaultValue={address}
                ref={addressRef}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Post Code</Form.Label>
              <Form.Control
                type="text"
                defaultValue={postCode}
                ref={postCodeRef}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            I don't want to order
          </Button>
          {changePickup ? (
            <Button variant="primary" onClick={handlePickup}>
              Change to Pickup
            </Button>
          ) : (
            <></>
          )}
          <Button variant="primary" onClick={handleOrder}>
            Order Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Delivery;
