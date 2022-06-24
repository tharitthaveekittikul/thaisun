import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fs } from "../Config/Config";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function Option({ individualProduct, handleOption }) {
  const titleList = [];
  const [options, setOptions] = useState();
  const [optionUse, setOptionUse] = useState([]);

  useEffect(() => {
    fs.collection("Products")
      .doc(individualProduct.ID)
      .get()
      .then((snapshot) => {
        setOptions(snapshot.data().option);
      });
  }, []);

  useEffect(() => {
    handleOption(optionUse);
    // console.log(optionUse);
  }, [optionUse]);

  const handleChange = (e, index, price) => {
    // console.log(e.target.value);
    // console.log(index);
    // console.log(titleList[index]);
    // console.log(options);

    if (optionUse.length == 0) {
      console.log("First");
      const values = {
        title: titleList[index],
        menu: e.target.value,
        price: price,
      };
      setOptionUse([values]);
    }
    if (optionUse.length > 0) {
      //   console.log(optionUse[index].title);
      //   console.log(titleList[index]);
      const titles = [];
      for (let i = 0; i < optionUse.length; i++) {
        titles.push(optionUse[i].title);
      }
      //   console.log(titles);

      if (!titles.includes(titleList[index])) {
        console.log("Not same");
        setOptionUse([
          ...optionUse,
          {
            title: titleList[index],
            menu: e.target.value,
            price: price,
          },
        ]);
      } else {
        console.log("Same");
        const same = optionUse;
        const same_title = options[index].title;
        for (let i = 0; i < same.length; i++) {
          if (same[i].title == same_title) {
            same[i] = {
              title: titleList[index],
              menu: e.target.value,
              price: price,
            };
          }
        }
        setOptionUse(same);
        // console.log(optionUse);
      }
    }
  };

  // console.log(optionUse);
  if (options) {
    return (
      <>
        <Form>
          <Form.Group>
            {options.map((option, index) => (
              <>
                <Form.Label>{option.title}</Form.Label>
                {titleList.push(option.title)}

                <div key={`default-radio`}>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      // defaultValue={option.menu[0].menuName}
                    >
                      {/* {console.log(optionUse[index])} */}
                      {option.menu.map((menuField, index_child) => (
                        <FormControlLabel
                          value={menuField.menuName}
                          control={
                            <Radio
                              required
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
                    </RadioGroup>
                  </FormControl>
                </div>
              </>
            ))}
          </Form.Group>
        </Form>
      </>
    );
  }
  return <></>;
}

export default Option;
