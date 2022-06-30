import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";
import { Icon } from "react-icons-kit";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";

export default function IndividualProduct({ individualProduct, addToCart }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [optionUse, setOptionUse] = useState([]);
  const [options, setOptions] = useState();
  const [addOnUse, setAddOnUse] = useState();
  const [instruction, setInstruction] = useState("");
  const [product, setProduct] = useState({
    ID: individualProduct.ID,
    option: [],
    addOn: [],
    title: individualProduct.title,
    description: individualProduct.description,
    price: individualProduct.price,
    category: individualProduct.category,
    img: individualProduct.img,
    instruction: instruction,
  });
  // console.log(individualProduct);

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
    addToCart(product);
  };

  useEffect(() => {
    try {
      setProduct({
        ID: individualProduct.ID,
        option: optionUse,
        addOn: addOnUse,
        title: individualProduct.title,
        description: individualProduct.description,
        price: individualProduct.price,
        category: individualProduct.category,
        img: individualProduct.img,
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
    <div className="ind-menu">
      <div className="menu-img">
        <img
          style={{
            alignContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "10px",
          }}
          src={individualProduct.img}
          alt="Menu image"
        />
      </div>
      <div className="menu-text">
        <div className="title">{individualProduct.title}</div>
        <div className="desc">{individualProduct.description}</div>
        <div className="price">£ {individualProduct.price}</div>
      </div>

      <div className="btn-add" onClick={handleShow}>
        <Icon
          className="addicon"
          icon={ic_add_circle}
          style={{ color: "#e80532" }}
          size={30}
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add-on</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Option
            individualProduct={individualProduct}
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
            style={{ backgroundColor: "#e80532", borderColor: "#e80532" }}
            onClick={handleAddToCart}
          >
            ADD TO BASKET
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
