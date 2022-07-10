import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { fs } from "../Config/Config";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Typography } from "@mui/material";

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

  const pushTitle = (addon) => {
    titleList.push(addon);
  };

  if (fixedAddOns) {
    return (
      <>
        <Form>
          <FormGroup>
            {fixedAddOns.map((fixedAddOn, index) => (
              <>
                {pushTitle(fixedAddOn.title)}
                <Form.Label
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    font: "Rubik",
                  }}
                >
                  {fixedAddOn.title}
                </Form.Label>
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
                      <Typography
                        style={{
                          fontSize: "14px",
                          font: "Rubik",
                          fontWeight: "400",
                        }}
                      >
                        {menuField.menuName +
                          " (£" +
                          parseFloat(menuField.price).toFixed(2) +
                          ")"}
                      </Typography>
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
