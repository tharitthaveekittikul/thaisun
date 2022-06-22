import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { auth, fs } from "../Config/Config";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";

function FixAdd({ handleAddOn }) {
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

  const [addOnUse, setAddOnUse] = useState([]);
  const titleList = [];

  useEffect(() => {
    handleAddOn(addOnUse);
    // console.log(addOnUse);
  }, [addOnUse]);

  const handleChange = (e, index, price) => {
    console.log(e.target.checked);

    if (!e.target.checked) {
      const same = addOnUse;
      console.log(e.target.value);
      for (let i = 0; i < same.length; i++) {
        if (same[i].menu == e.target.value) {
          console.log(same[i].menu);
          same.splice(i, 1);
          setAddOnUse(same);
          // console.log(addOnUse);
          return;
        }
      }
    } else if (e.target.checked) {
      if (addOnUse.length == 0) {
        setAddOnUse([
          {
            title: titleList[index],
            menu: e.target.value,
            price: price,
          },
        ]);
        // console.log(addOnUse);
      } else {
        setAddOnUse([
          ...addOnUse,
          {
            title: titleList[index],
            menu: e.target.value,
            price: price,
          },
        ]);
        // console.log(addOnUse);
      }
    }
  };

  if (fixedAddOns) {
    return (
      <>
        <Form>
          <FormGroup>
            {fixedAddOns.map((fixedAddOn, index) => (
              <>
                {titleList.push(fixedAddOn.title)}
                <Form.Label>{fixedAddOn.title}</Form.Label>
                {fixedAddOn.menu.map((menuField, index_child) => (
                  <FormControlLabel
                    value={menuField.menuName}
                    control={
                      <Checkbox
                        onChange={(event) =>
                          handleChange(event, index, menuField.price)
                        }
                      />
                    }
                    label={
                      menuField.menuName +
                      " (£" +
                      parseFloat(menuField.price).toFixed(2) +
                      ")"
                    }
                  />
                ))}
              </>
            ))}
          </FormGroup>
        </Form>
      </>
    );
  }
  return <></>;
}

export default FixAdd;
