import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";
import { Icon } from "react-icons-kit";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";

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

  // console.log(individualFilteredProduct);

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
    <div className="ind-menu">
      <div className="menu-img">
        <img
          style={{
            alignContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "10px",
          }}
          src={individualFilteredProduct.img}
          alt="Menu image"
        />
      </div>
      <div className="menu-text">
        <div className="title">{individualFilteredProduct.title}</div>
        <div className="desc">{individualFilteredProduct.description}</div>
        <div className="price">£ {individualFilteredProduct.price}</div>
      </div>

      <div className="btn-add" onClick={handleShow}>
        <Icon
          className="addicon"
          icon={ic_add_circle}
          style={{ color: "#e80532" }}
          size={30}
        />
      </div>

      <Modal show={show} onHide={handleClose} className="modal-popup">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Title>
          <img
            src={individualFilteredProduct.img}
            width={500}
            height={200}
            style={{
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
          <p style={{ margin: "10px", fontWeight: "700", fontSize: "24px" }}>
            {individualFilteredProduct.title} (£{" "}
            {individualFilteredProduct.price})
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "300",
              margin: "10px",
              wordWrap: "break-word",
            }}
          >
            {individualFilteredProduct.description}
          </p>
        </Modal.Title>
        <hr />
        <Modal.Body>
          <Scrollbars autoHeight autoHeightMin={"10vh"}>
            <Option
              individualProduct={individualFilteredProduct}
              handleOption={handleOption}
            />
            <FixAdd handleAddOn={handleAddOn} />
          </Scrollbars>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label style={{ marginTop: "10px" }}>
                Special Instructions
              </Form.Label>
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
