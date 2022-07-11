import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";
import { Icon } from "react-icons-kit";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";
import { useMediaQuery } from "react-responsive";

export default function IndividualFilteredProduct({
  individualFilteredProduct,
  addToCart,
}) {
  const indMenuQuery = useMediaQuery({ query: "(min-width: 410px)" });
  const smallQuery = useMediaQuery({ query: "(min-width: 340px)" });
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
  // console.log(options);
  // console.log(individualFilteredProduct);
  // console.log(product);
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
        {smallQuery ? (
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
        ) : (
          <img
            style={{
              alignContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "10px",
            }}
            src={individualFilteredProduct.img}
            alt="Menu image"
          />
        )}
      </div>
      <div className="menu-text">
        <div className="title">{individualFilteredProduct.title}</div>
        {indMenuQuery ? (
          <div className="desc">{individualFilteredProduct.description}</div>
        ) : null}

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

      <Modal show={show} onHide={handleClose} contentClassName="modal-product">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Title bsPrefix="modal-title">
          <img src={individualFilteredProduct.img} width={500} height={200} />
          <div className="title-product">
            <p>
              <span id="span-title">{individualFilteredProduct.title}</span>{" "}
              <span id="span-price">(£ {individualFilteredProduct.price})</span>
            </p>
            <p id="p-description">{individualFilteredProduct.description}</p>
          </div>
        </Modal.Title>
        <Modal.Body bsPrefix="modal-body">
          <Scrollbars className="scrollbar-modal">
            <Option
              individualProduct={individualFilteredProduct}
              handleOption={handleOption}
            />
            <FixAdd handleAddOn={handleAddOn} />
          </Scrollbars>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group
              className="instruction"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Special Instructions</Form.Label>
              <Form.Control
                className="text-instruction"
                type="text"
                onChange={(event) => handleInstruction(event)}
                placeholder="Eg. Food allergies, food strength etc..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer bsPrefix="modal-footer">
          <Button className="btn-basket" onClick={handleAddToCart}>
            ADD TO BASKET
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
