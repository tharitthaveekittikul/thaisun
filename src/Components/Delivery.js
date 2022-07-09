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
  const [town, setTown] = useState("");
  const [county, setCounty] = useState("");
  const [postCode, setPostCode] = useState("");

  const history = useHistory();

  const addressRef = useRef();
  const townRef = useRef();
  const countyRef = useRef();
  const postCodeRef = useRef();

  const [loadingMsg, setLoadingMsg] = useState("");

  const postCodeDeliver = [
    "LS1",
    "LS2",
    "LS3",
    "LS4",
    "LS5",
    "LS6",
    "LS7",
    "LS8",
    "LS9",
    "LS10",
    "LS11",
    "LS12",
    "LS13",
    "LS14",
    "LS15",
    "LS16",
    "LS17",
    "LS18",
    "LS19",
    "LS20",
    "LS21",
    "LS22",
    "LS23",
    "LS24",
    "LS25",
    "LS26",
    "LS27",
    "LS28",
    "LS29",
  ];

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
            setCounty(snapshot.data().County);
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
    localStorage.setItem("Delivery", false);
    localStorage.setItem("Pickup", true);
    handleClose();
    history.push("/");
  }

  function handleOrder() {
    if (town === "") {
      setError("Please select the Town/City");
      return;
    }
    if (postCode === "") {
      setError("Please select postcode");
      return;
    }
    if (
      postCode.toUpperCase() === "LS12" ||
      postCode.toUpperCase() === "LS13" ||
      postCode.toUpperCase() === "LS18" ||
      postCode.toUpperCase() === "LS28"
    ) {
      setError("");
      setLoadingMsg("Loading...");
      if (
        postCodeDeliver.toString().includes(postCode.toString().toUpperCase())
      ) {
        //   console.log("can deliver");
        auth.onAuthStateChanged((user) => {
          if (user) {
            fs.collection("users")
              .doc(user.uid)
              .update({
                Address: addressRef.current.value,
                Town: town,
                County: countyRef.current.value,
                PostCode: postCode,
              })
              .then(() => {
                setLoadingMsg("");
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
        setError(
          "Your postcode is not available for delivery please call restaurant 01133187268."
        );
        setChangePickup(true);
      }
    } else {
      setError(
        "Your postcode is not available for delivery. Please change to collection or call restaurant 01133187268."
      );
    }
  }

  function handleChangeTown(e) {
    setTown(e.target.value);
  }

  function handleChangePostCode(e) {
    setPostCode(e.target.value);
  }

  return (
    <>
      <Button onClick={handleDelivery}>Delivery</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery</Modal.Title>
        </Modal.Header>
        {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
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
              <Form.Label>Town / City</Form.Label>
              <select
                className="form-control"
                required
                onChange={(e) => {
                  handleChangeTown(e);
                }}
              >
                <option value="">Select Town</option>
                <option value="Calvery">Calvery</option>
                <option value="Bramley">Bramley</option>
                <option value="Armley">Armley</option>
                <option value="Rodley">Rodley</option>
                <option value="Horstforth">Horstforth</option>
                <option value="Stanningley">Stanningley</option>
                <option value="Pudsey">Pudsey</option>
              </select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>County</Form.Label>
              <Form.Control
                type="text"
                defaultValue={county}
                ref={countyRef}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Post Code</Form.Label>
              {/* <Form.Control
                type="text"
                defaultValue={postCode}
                ref={postCodeRef}
                required
              /> */}
              <select
                className="form-control"
                required
                onChange={(e) => {
                  handleChangePostCode(e);
                }}
              >
                <option value="">Select Postcode</option>
                {postCodeDeliver.map((post) => (
                  <option value={post}>{post}</option>
                ))}
              </select>
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
