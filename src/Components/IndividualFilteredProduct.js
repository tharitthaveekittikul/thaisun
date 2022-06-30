import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";

export default function IndividualFilteredProduct({
  individualFilteredProduct,
  addToCart,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [optionUse, setOptionUse] = useState([]);
  const [options, setOptions] = useState();
  const [addOnUse, setAddOnUse] = useState();
  const [instruction, setInstruction] = useState("");
  const [product, setProduct] = useState({
    ID: individualFilteredProduct.ID,
    option: [],
    addOn: [],
    title: individualFilteredProduct.title,
    description: individualFilteredProduct.description,
    price: individualFilteredProduct.price,
    category: individualFilteredProduct.category,
    img: individualFilteredProduct.img,
    instruction: instruction,
  });

  console.log(individualFilteredProduct);

  useEffect(() => {
    fs.collection("Products")
      .doc(individualFilteredProduct.ID)
      .get()
      .then((snapshot) => {
        setOptions(snapshot.data().option);
      });
  }, []);

  console.log(individualFilteredProduct);

  const handleAddToCart = () => {
    handleClose();
    addToCart(product);
  };

  useEffect(() => {
    try {
      setProduct({
        ID: individualFilteredProduct.ID,
        option: optionUse,
        addOn: addOnUse,
        title: individualFilteredProduct.title,
        description: individualFilteredProduct.description,
        price: individualFilteredProduct.price,
        category: individualFilteredProduct.category,
        img: individualFilteredProduct.img,
        instruction: instruction,
      });
    } catch {}
  }, [optionUse, addOnUse, instruction]);

  const handleOption = (data) => {
    setOptionUse(data); // options
  };

  const handleAddOn = (data) => {
    setAddOnUse(data); //addOnUse
  };

  const handleInstruction = (event) => {
    event.persist();
    setInstruction(event.target.value);
  };

  return (
    <div className="product">
      <div className="product-img">
        <img src={individualFilteredProduct.img} alt="product-img" />
      </div>
      <div className="product-text title">
        {individualFilteredProduct.title}
      </div>
      <div className="product-text description">
        {individualFilteredProduct.description}
      </div>
      <div className="product-text price">
        £ {individualFilteredProduct.price}
      </div>

      <Button onClick={handleShow}>ADD TO CART</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add-on</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Option
            individualFilteredProduct={individualFilteredProduct}
            handleOption={handleOption}
          />
          <FixAdd handleAddOn={handleAddOn} />
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Special Instructions</Form.Label>
              <Form.Control
                type="text"
                onChange={(event) => handleInstruction(event)}
                placeholder="Eg. Food allergies, food strength etc..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-danger btn-md cart-btn"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
