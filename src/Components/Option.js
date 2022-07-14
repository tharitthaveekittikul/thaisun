import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { fs } from "../Config/Config";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@mui/material";

function Option({
  individualProduct,
  handleOption,
  individualFilteredProduct,
}) {
  const titleList = [];
  const [options, setOptions] = useState();
  const [optionUse, setOptionUse] = useState([]);

  // for individualProduct
  useEffect(() => {
    if (individualProduct) {
      fs.collection("Products")
        .doc(individualProduct.ID)
        .get()
        .then((snapshot) => {
          setOptions(snapshot.data().option);
        });
    } else {
      // for individualFilteredProduct
      fs.collection("Products")
        .doc(individualFilteredProduct.ID)
        .get()
        .then((snapshot) => {
          setOptions(snapshot.data().option);
        });
    }
  }, []);

  useEffect(() => {
    handleOption(optionUse);
    // console.log(optionUse);
  }, [optionUse]);

  useEffect(() => {
    try {
      // console.log(options);
      if (options.length == 1) {
        // console.log("1");
        setOptionUse([
          {
            title: options[0].title,
            menu: options[0].menu[0].menuName,
            price: options[0].menu[0].price,
          },
        ]);
      } else if (options.length > 1) {
        // console.log("2");
        for (let i = 0; i < options.length; i++) {
          if (i == 0) {
            setOptionUse([
              {
                title: options[0].title,
                menu: options[0].menu[0].menuName,
                price: options[0].menu[0].price,
              },
            ]);
          } else {
            setOptionUse((prevState) => [
              ...prevState,
              {
                title: options[i].title,
                menu: options[i].menu[0].menuName,
                price: options[i].menu[0].price,
              },
            ]);
          }
        }
      }
    } catch {}
  }, [options]);

  const handleChange = (e, index, price) => {
    // console.log(e.target.value);
    // console.log(index);
    // console.log(titleList[index]);
    // console.log(options);
    e.preventDefault();
    if (optionUse.length == 0) {
      // console.log("First");
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
        // console.log("Not same");
        setOptionUse([
          ...optionUse,
          {
            title: titleList[index],
            menu: e.target.value,
            price: price,
          },
        ]);
      } else {
        // console.log("Same");
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

  const pushTitle = (option) => {
    titleList.push(option);
  };

  // console.log(optionUse);
  if (options) {
    return (
      <>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group>
            {options.map((option, index) => (
              <>
                {option.title !== "" ? (
                  <>
                    <Form.Label className="option-label-title">
                      {option.title}
                    </Form.Label>
                    {pushTitle(option.title)}

                    <div key={`default-radio`}>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          defaultValue={option.menu[0].menuName}
                        >
                          {/* {console.log(optionUse[index])} */}
                          {option.menu.map((menuField, index_child) => (
                            <>
                              <FormControlLabel
                                className="radio-margin"
                                value={menuField.menuName}
                                control={
                                  <Radio
                                    style={{ color: "#e80532" }}
                                    required
                                    onChange={(event) =>
                                      handleChange(
                                        event,
                                        index,
                                        menuField.price
                                      )
                                    }
                                  />
                                }
                                label={
                                  <Typography className="option-label-menu">
                                    {menuField.menuName +
                                      " (£" +
                                      parseFloat(menuField.price).toFixed(2) +
                                      ")"}
                                  </Typography>
                                }
                              />
                            </>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </>
                ) : (
                  <></>
                )}
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
