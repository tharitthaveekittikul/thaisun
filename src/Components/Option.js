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
  const [optionUse, setOptionUse] = useState([
    {
      title: "",
      menu: "",
    },
  ]);

  useEffect(() => {
    fs.collection("Products")
      .doc(individualProduct.ID)
      .get()
      .then((snapshot) => {
        setOptions(snapshot.data().option);
      });
  }, []);

  const handleCheck = useCallback((index, menuName) => {
    console.log(optionUse[index]);
    console.log(menuName);
    try {
      return optionUse[index].menu === menuName;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    handleOption(optionUse);
    console.log(optionUse);
  }, [optionUse]);

  const handleChange = (e, index) => {
    // console.log(e.target.value);
    // console.log(index);
    // console.log(titleList[index]);

    if (optionUse.length == 0) {
      console.log("First");
      const values = {};
      setOptionUse([
        {
          title: titleList[index],
          menu: e.target.value,
        },
      ]);
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
        console.log("No same");
        setOptionUse([
          ...optionUse,
          {
            title: titleList[index],
            menu: e.target.value,
          },
        ]);
      } else {
        console.log("Same");
        const same = optionUse;

        setOptionUse([
          {
            title: titleList[index],
            menu: e.target.value,
          },
        ]);
      }
    }
  };

  //   console.log(optionUse);
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
                      onChange={(event) => handleChange(event, index)}
                    >
                      {/* {console.log(optionUse[index])} */}
                      {option.menu.map((menuField, index_child) => (
                        <FormControlLabel
                          value={menuField.menuName}
                          control={<Radio />}
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
