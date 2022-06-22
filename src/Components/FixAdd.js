import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { auth, fs } from "../Config/Config";

function FixAdd() {
  const [fixedAddOns, setFixedAddOns] = useState();
  useEffect(() => {
    fs.collection("fixedAddOn")
      .doc("option")
      .get()
      .then((snapshot) => {
        setFixedAddOns(snapshot.data().addOn);
      });
  }, []);
  // console.log(fixedAddOns);
  if (fixedAddOns) {
    return (
      <>
        {fixedAddOns.map((fixedAddOn) => (
          <>
            <label>{fixedAddOn.title}</label>
            {fixedAddOn.menu.map((menuField, index_child) => (
              <div key={`default-checkbox`}>
                <Form.Check
                  type="checkbox"
                  label={
                    menuField.menuName +
                    " (£" +
                    parseFloat(menuField.price).toFixed(2) +
                    ")"
                  }
                />
              </div>
            ))}
          </>
        ))}
      </>
    );
  }
  return <></>;
}

export default FixAdd;
