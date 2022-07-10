import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { fs } from "../Config/Config";
import FixAdd from "./FixAdd";
import Option from "./Option";
import { Icon } from "react-icons-kit";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";
import { useMediaQuery } from "react-responsive";

export default function IndividualProduct({ individualProduct, addToCart }) {
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
        {smallQuery ? (
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
        ) : (
          <img
            style={{
              alignContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "10px",
            }}
            src={individualProduct.img}
            alt="Menu image"
          />
        )}
      </div>
      <div className="menu-text">
        <div className="title">{individualProduct.title}</div>
        {indMenuQuery ? (
          <div className="desc">{individualProduct.description}</div>
        ) : null}

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

      <Modal show={show} onHide={handleClose} className="modal-popup">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Title>
          <img
            src={individualProduct.img}
            width={500}
            height={200}
            style={{
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
          <p
            style={{
              margin: "10px",
            }}
          >
            <span
              style={{
                fontFamily: "Merriweather",
                fontWeight: "700",
                fontSize: "26px",
              }}
            >
              {individualProduct.title}
            </span>{" "}
            <span
              style={{
                fontFamily: "Rubik",
                fontWeight: "500",
                fontSize: "26px",
                color: "#e80532",
              }}
            >
              (£ {individualProduct.price})
            </span>
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "300",
              margin: "10px",
              wordWrap: "break-word",
            }}
          >
            {individualProduct.description}
          </p>
        </Modal.Title>
        <hr />
        <Modal.Body>
          <Scrollbars autoHeight autoHeightMin={"10vh"}>
            <Option
              individualProduct={individualProduct}
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
