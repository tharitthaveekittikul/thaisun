import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";

export default function IndividualProduct({ individualProduct, addToCart }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [product, setProduct] = useState({
    ID: individualProduct.ID,
    option: [],
    title: individualProduct.title,
    description: individualProduct.description,
    price: individualProduct.price,
    category: individualProduct.category,
    img: individualProduct.img,
  });
  const [optionUse, setOptionUse] = useState([]);
  const [options, setOptions] = useState();
  useEffect(() => {
    fs.collection("Products")
      .doc(individualProduct.ID)
      .get()
      .then((snapshot) => {
        setOptions(snapshot.data().option);
      });
  }, []);
  // console.log(options);
  // console.log(individualProduct);
  // console.log(product);
  const handleAddToCart = () => {
    handleClose();
    addToCart(individualProduct);
  };

  const handleOption = (data) => {
    setOptionUse(data);
  };

  return (
    <div className="product">
      <div className="product-img">
        <img src={individualProduct.img} alt="product-img" />
      </div>
      <div className="product-text title">{individualProduct.title}</div>
      <div className="product-text description">
        {individualProduct.description}
      </div>
      <div className="product-text price">£ {individualProduct.price}</div>

      <Button onClick={handleShow}>ADD TO CART</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add-on</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Option
            individualProduct={individualProduct}
            handleOption={handleOption}
          />
          <FixAdd />
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
