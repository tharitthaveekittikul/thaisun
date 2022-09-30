import React, { useState, useEffect, useRef } from "react";

import { auth, fs } from "../Config/Config";

import { useHistory, useLocation } from "react-router-dom";
import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { format } from "date-fns";
import Navbar1 from "./Navbar1";
import { faHomeUser } from "@fortawesome/free-solid-svg-icons";

function Checkout() {
  const local = useLocation();
  const history = useHistory();
  const textInstructionRef = useRef();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [house, setHouse] = useState("");
  const [address, setAddress] = useState("");
  const [town, setTown] = useState("");
  const [county, setCounty] = useState("");
  const [postCode, setPostCode] = useState("");
  const [tel, setTel] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [couponType, setCouponType] = useState(false);

  const [pickupState, setPickupState] = useState(
    localStorage.getItem("Pickup") === "true"
  );
  const [buttonDisable, setButtonDisable] = useState(true);

  const addressRef = useRef();

  const houseRef = useRef();

  const countyRef = useRef();

  const postCodeRef = useRef();

  const [deliveryChange, setDeliveryChange] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            setFirstName(snapshot.data().FirstName);
            setLastName(snapshot.data().LastName);
            setEmail(snapshot.data().Email);
            setHouse(snapshot.data().House);
            setAddress(snapshot.data().Address);
            setTown(snapshot.data().Town);
            setCounty(snapshot.data().County);
            setPostCode(snapshot.data().PostCode);
            setTel(snapshot.data().Telephone);
            Coupons = snapshot.data().Coupons;
            setButtonDisable(false);
          });
      } else {
        history.push("/login");
      }
    });
  }, []);

  const [townTemp, setTownTemp] = useState(town);
  const [postCodeTemp, setPostCodeTemp] = useState(postCode);

  let Coupons = [];

  function GetCouponsUser() {
    const [coupon, setCoupon] = useState([]);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setCoupon(snapshot.data().Coupons);
            });
        } else {
          setCoupon([]);
        }
      });
    }, []);
    return coupon;
  }

  Coupons = GetCouponsUser();
  const [fromCart, setFromCart] = useState(null);

  let fee = 2;
  useEffect(() => {
    try {
      // setFee(local.state.Fee);
      fee = local.state.Fee;
    } catch {}
  }, []);

  function checkLS(post) {
    let code = post;
    const searchTerm = "LS";
    const indexLS = code.indexOf(searchTerm);
    code = code.slice(indexLS, indexLS + 4); //LS12 ex: L is index 0 so 2 is index 4 (+4)
    // console.log(code);
    return code;
  }

  const miles = 3; //default 3 miles
  useEffect(() => {
    if (localStorage.getItem("Delivery") == "true") {
      // setFee(2);
      let fee_temp = 2;
      if (town === "Calvery") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(4 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Bramley") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(16 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(16 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(16 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Armley") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
          // setFee(20);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(6 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Rodley") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        }
        //  else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(3 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Horstforth") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(6 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(4 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(3 - miles); // miles < 3 so distance around 3 default
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Stanningley") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(3 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(4 - miles);
          fee = Number(distance + fee_temp);
        }
      } else if (town === "Pudsey") {
        // setFee(2);
        if (checkLS(postCode).toUpperCase() === "LS12") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        } else if (checkLS(postCode).toUpperCase() === "LS13") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        }
        // else if (checkLS(postCode).toUpperCase() === "LS18") {
        //   let distance = Number(3 - miles);
        //   fee = Number(distance + fee_temp);
        // }
        else if (checkLS(postCode).toUpperCase() === "LS28") {
          let distance = Number(3 - miles);
          fee = Number(distance + fee_temp);
        }
      }
      try {
        setFromCart({
          ...fromCart,
          Fee: fee,
          Total: Number(
            Number(local.state.Subtotal) -
              Number(local.state.Discount).toFixed(2) +
              Number(fee)
          ).toFixed(2),
        });
      } catch {
        history.push("/");
      }
    }
  }, [town, postCode, buttonDisable, deliveryChange]);

  useEffect(() => {
    try {
      setFromCart({
        cartProducts: local.state.cartProducts,
        Coupon: local.state.Coupon,
        Subtotal: local.state.Subtotal,
        Fee: local.state.Fee,
        Discount: local.state.Discount,
        // Total: local.state.Total,
        Total: Number(
          Number(local.state.Subtotal) -
            Number(local.state.Discount).toFixed(2) +
            Number(local.state.Fee)
        ).toFixed(2),
      });
    } catch {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    try {
      // console.log(Coupons);
      // console.log(fromCart);
      // console.log(String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")));

      if (local.state.Coupon == undefined || local.state.Coupon == null) {
        // console.log("not use coupon", Coupons);
      } else {
        Coupons.push(local.state.Coupon);
        setCouponType(true);
        // console.log("push coupon", local.state.Coupon);
      }
    } catch {
      history.push("/");
    }
  }, [Coupons]);

  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FirstName);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  useEffect(() => {
    setTownTemp(town);
    setPostCodeTemp(postCode);
  }, [buttonDisable]);

  const handleModalPaypal = () => {
    if (town === "") {
      setModalShow(false);
      return setError("Please select town");
    } else if (postCode === "") {
      setModalShow(false);
      return setError("Please select postcode");
    }
    setModalShow(true);
  };

  function handleChangeState(event) {
    if (event.target.value == "pickup") {
      // console.log("pickup");
      setPickupState(true);
      localStorage.setItem("Delivery", false);
      localStorage.setItem("Pickup", true);
      setTownTemp(town);
      setPostCodeTemp(postCode);
      setFromCart({
        ...fromCart,
        Fee: 0,
        Total: Number(
          Number(local.state.Subtotal) - Number(local.state.Discount).toFixed(2)
        ).toFixed(2),
      });
    } else if (event.target.value == "delivery") {
      setDeliveryChange(!deliveryChange);
      // console.log("delivery");
      setPickupState(false);
      // console.log(fee);
      setTownTemp(town);
      setPostCodeTemp(postCode);
      localStorage.setItem("Delivery", true);
      localStorage.setItem("Pickup", false);
      setFromCart({
        ...fromCart,
        Fee: fee,
        Total: Number(
          Number(local.state.Subtotal) -
            Number(local.state.Discount).toFixed(2) +
            Number(fee)
        ).toFixed(2),
      });
    }
  }

  function handleChangeTown(e) {
    setDeliveryChange(!deliveryChange);
    // console.log(fee);
    setTown(e.target.value);
    fs.collection("users").doc(uid).update({
      Town: e.target.value,
    });
  }

  function handleChangePostCode(e) {
    // fee = Number(MilesCal_new(town, e.target.value));
    // console.log(fee);
    setDeliveryChange(!deliveryChange);
    setPostCode(e.target.value);
    fs.collection("users").doc(uid).update({
      PostCode: e.target.value,
    });
  }

  useEffect(() => {
    // console.log(fromCart);
  }, [fromCart]);

  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  }

  const user = GetCurrentUser();
  const uid = GetUserUid();

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .get()
          .then((getSnap) => {
            const qty = getSnap.docs.length;
            setTotalProducts(qty);
          });
      }
    });
  }, []);

  const handleSubmit = (type, detailp) => {
    if (town === "") {
      setError("Please select town");
      return setButtonDisable(false);
    } else if (postCode === "") {
      setError("Please select postcode");
      return setButtonDisable(false);
    }

    if (houseRef.current.value === "") {
      setError("House number shouldn't be empty");
      return setButtonDisable(false);
    }
    let total = 0;
    let pOrder;
    let houseTemp;
    let addressTemp;
    let townTemp;
    let countyTemp;
    let postCodeTemp;
    if (type == "paypal") {
      pOrder = { type: "paypal", detail: detailp };
    }
    if (type == "cash") {
      pOrder = { type: "cash" };
    }
    const delState = localStorage.getItem("Delivery") === "true";
    if (delState == true) {
      houseTemp = houseRef.current.value;
      addressTemp = addressRef.current.value;
      // townTemp = townRef.current.value;
      townTemp = town;
      countyTemp = countyRef.current.value;
      // postCodeTemp = postCodeRef.current.value;
      postCodeTemp = postCode;
      // console.log("delivery=================");
    } else {
      houseTemp = house;
      addressTemp = address;
      townTemp = town;
      countyTemp = county;
      postCodeTemp = postCode;
    }

    setMessage("");
    setError("");
    // console.log("coupons : " + Coupons);

    fs.collection("orderHistory")
      .get()
      .then((order) => {
        // console.log("order History " + order.docs.length);
        total = total + order.docs.length;
        fs.collection("liveorder")
          .get()
          .then((live) => {
            // console.log("liveorder " + live.docs.length);
            total = total + live.docs.length;
            let totalOrder = Number(total) + 1;
            fs.collection("liveorder")
              .add({
                ...fromCart,
                instructionToRes: textInstructionRef.current.value,
                user: firstName + " " + lastName,
                email: email,
                house: houseTemp,
                address: addressTemp,
                town: townTemp,
                county: countyTemp,
                postCode: postCodeTemp,
                Telephone: tel,
                pickupState: pickupState,
                deliveryState: !pickupState,
                date: String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")),
                payment: pOrder,
                orderNo: totalOrder,
              })
              .then(() => {
                fs.collection("users")
                  .doc(uid)
                  .update({
                    Coupons: Coupons,
                  })
                  .then(() => {
                    fs.collection("Cart " + uid)
                      .get()
                      .then((querySnapshot) => {
                        window.scrollTo(0, 0);
                        setMessage(
                          "Order completed... Please wait for order confirmation."
                        );
                        querySnapshot.forEach((doc) => {
                          fs.collection("Cart " + uid)
                            .doc(doc.id)
                            .delete()
                            .then(() => {});
                        });
                        setTimeout(() => {
                          // console.log("order send to restaurant");
                          history.push({
                            pathname: "/ordersuccess",
                            state: {
                              ...fromCart,
                              instructionToRes:
                                textInstructionRef.current.value,
                              user: firstName + " " + lastName,
                              email: email,
                              house: houseTemp,
                              address: addressTemp,
                              town: townTemp,
                              county: countyTemp,
                              postCode: postCodeTemp,
                              Telephone: tel,
                              pickupState: pickupState,
                              deliveryState: !pickupState,
                              date: String(
                                format(new Date(), "LLLL dd, yyyy kk:mm:ss")
                              ),
                              payment: pOrder,
                              orderNo: totalOrder,
                            },
                          });
                        }, 3000);
                      });
                  });
              });
          });
      });

    // console.log(total);
  };

  if (townTemp !== "" || postCodeTemp !== "") {
    return (
      <>
        <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
        {message ? <Alert variant="success">{message}</Alert> : ""}
        {error ? <Alert variant="danger">{error}</Alert> : ""}
        {fromCart ? (
          <div className="checkout-container">
            <div className="checkout-form">
              <h1>Checkout</h1>
              <Form onSubmit={(e) => e.preventDefault()}>
                <FormControl>
                  <FormLabel style={{ color: "#6b6b6b" }}>
                    Pick Up or Delivery{" "}
                    <span style={{ color: "#e80532", fontWeight: "500" }}>
                      *
                    </span>
                  </FormLabel>
                  {pickupState ? (
                    <>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        defaultValue="pickup"
                        onChange={handleChangeState}
                      >
                        <FormControlLabel
                          value="pickup"
                          control={<Radio style={{ color: "#e80532" }} />}
                          label="Pick Up"
                        />
                        <FormControlLabel
                          value="delivery"
                          control={<Radio style={{ color: "#e80532" }} />}
                          label="Delivery"
                        />
                      </RadioGroup>
                    </>
                  ) : (
                    <>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        defaultValue="delivery"
                        onChange={handleChangeState}
                      >
                        <FormControlLabel
                          value="pickup"
                          control={<Radio style={{ color: "#e80532" }} />}
                          label="Pick Up"
                        />
                        <FormControlLabel
                          value="delivery"
                          control={<Radio style={{ color: "#e80532" }} />}
                          label="Delivery"
                        />
                      </RadioGroup>
                    </>
                  )}
                </FormControl>
                {pickupState ? (
                  <div></div>
                ) : (
                  <div>
                    <FormLabel>
                      House Number/ Flat Number / House Name{" "}
                      <span style={{ color: "#e80532", fontWeight: "500" }}>
                        *
                      </span>
                    </FormLabel>
                    <Form.Control
                      type="text"
                      ref={houseRef}
                      defaultValue={house}
                      required
                      style={{ marginBottom: "20px" }}
                    />
                    <FormLabel>
                      Address{" "}
                      <span style={{ color: "#e80532", fontWeight: "500" }}>
                        *
                      </span>
                    </FormLabel>
                    <Form.Control
                      type="text"
                      ref={addressRef}
                      defaultValue={address}
                      required
                      style={{ marginBottom: "20px" }}
                    />
                    <FormLabel>
                      Town / City{" "}
                      <span style={{ color: "#e80532", fontWeight: "500" }}>
                        *
                      </span>
                    </FormLabel>
                    <select
                      className="form-control"
                      required
                      onChange={(e) => {
                        handleChangeTown(e);
                      }}
                      defaultValue={townTemp}
                      style={{ marginBottom: "10px" }}
                    >
                      <option value="" disabled={true}>
                        Select Town
                      </option>
                      <option value="Calvery">Calvery</option>
                      <option value="Bramley">Bramley</option>
                      <option value="Armley">Armley</option>
                      <option value="Rodley">Rodley</option>
                      <option value="Horstforth">Horstforth</option>
                      <option value="Stanningley">Stanningley</option>
                      <option value="Pudsey">Pudsey</option>
                    </select>
                    {/* <FormLabel>
                      County{" "}
                      <span style={{ color: "#e80532", fontWeight: "500" }}>
                        *
                      </span>
                    </FormLabel>
                    <Form.Control
                      type="text"
                      ref={countyRef}
                      defaultValue={county}
                      required
                      style={{ marginBottom: "20px" }}
                    /> */}
                    <FormLabel>
                      Post Code{" "}
                      <span style={{ color: "#e80532", fontWeight: "500" }}>
                        *
                      </span>
                    </FormLabel>
                    <Form.Control
                      type="text"
                      ref={postCodeRef}
                      defaultValue={postCode}
                      onChange={(e) => handleChangePostCode(e)}
                      required
                      style={{ marginBottom: "20px" }}
                    />
                    {/* <select
                      className="form-control"
                      required
                      onChange={(e) => {
                        handleChangePostCode(e);
                      }}
                      defaultValue={postCodeTemp}
                      style={{ marginBottom: "10px" }}
                    >
                      <option value="" disabled={true}>
                        Select Postcode
                      </option>
                      <option value="LS12">LS12</option>
                      <option value="LS13">LS13</option>
                      <option value="LS18">LS18</option>
                      <option value="LS28">LS28</option>
                    </select> */}
                  </div>
                )}

                <FormLabel>Instructions to the driver</FormLabel>
                <Form.Control
                  type="text"
                  ref={textInstructionRef}
                  placeholder="Pickup time, allergy."
                  style={{ marginBottom: "20px" }}
                />
              </Form>
            </div>
            <div className="checkout-table">
              <div className="c-cart-summary-box">
                <h5>Your Basket</h5>
                <table>
                  <tbody>
                    {fromCart.cartProducts.map((pro) => (
                      <tr>
                        <td className="c-text">
                          <p
                            style={{
                              paddingTop: "10px",
                              paddingBottom: "0",
                              margin: "0",
                              fontFamily: "Merriweather, serif",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "black",
                            }}
                          >
                            {pro.title} x {pro.qty}
                          </p>
                          {pro.option.map((option) => (
                            <p
                              style={{
                                padding: "0",
                                margin: "0",
                                textIndent: "15px",
                                color: "rgb(130, 130, 130)",
                                fontSize: "14px",
                              }}
                            >
                              {option.menu}
                            </p>
                          ))}
                          {pro.addOn.map((addOn) => (
                            <p
                              style={{
                                padding: "0",
                                margin: "0",
                                textIndent: "15px",
                                color: "rgb(130, 130, 130)",
                                fontSize: "14px",
                              }}
                            >
                              {addOn.menu}
                            </p>
                          ))}
                        </td>
                        <td className="c-price">
                          <span>
                            £{Number(pro.TotalProductPrice).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="c-text">
                        <span>Subtotal</span>
                      </td>
                      <td className="c-price">
                        <span>£{Number(fromCart.Subtotal).toFixed(2)}</span>
                      </td>
                    </tr>
                    {couponType ? (
                      <tr>
                        <td className="c-text">
                          <span>Discount</span>
                        </td>
                        <td className="c-price">
                          <span>-£{Number(fromCart.Discount).toFixed(2)}</span>
                        </td>
                      </tr>
                    ) : null}
                    {fromCart.Fee == 0 ||
                    fromCart.Fee == "0.00" ||
                    fromCart == "0" ? null : (
                      <tr>
                        <td className="c-text">
                          <span>Delivery Fee</span>
                        </td>
                        <td className="c-price">
                          <span>£{Number(fromCart.Fee).toFixed(2)}</span>
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td className="c-text">
                        <span style={{ fontWeight: 700 }}>Total</span>
                      </td>
                      <td className="c-price">
                        <span style={{ fontWeight: 700 }}>
                          {/* £
                          {Number(
                            Number(fromCart.Subtotal) -
                              Number(fromCart.Discount).toFixed(2) +
                              Number(fromCart.Fee)
                          ).toFixed(2)} */}
                          £{Number(fromCart.Total).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="c-payment">
                  <div className="c-paypal">
                    <Button
                      variant="danger"
                      disabled={buttonDisable}
                      onClick={() => handleModalPaypal()}
                    >
                      Pay with PayPal/Credit Card
                    </Button>
                  </div>
                  <div className="c-cash">
                    <Button
                      variant="danger"
                      disabled={buttonDisable}
                      onClick={() => [
                        setButtonDisable(true),
                        handleSubmit("cash", null),
                      ]}
                    >
                      Pay with Cash
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <PayPalScriptProvider
            options={{
              "client-id":
                "Aenfsl6L2c58FzVNtQJZvXe2YkFTa7SqOyvDsVkv1lM5vFprAwk7kIE93_X7Lv7t54uRbjwmWE43MoyE&currency=GBP",
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                setButtonDisable(true);
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: Number(fromCart.Total).toFixed(2),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                return actions.order.capture().then(function (details) {
                  alert(
                    "Transaction completed by " + details.payer.name.given_name
                  );
                  // console.log(details);
                  if (details.status == "COMPLETED") {
                    handleSubmit("paypal", details);
                  } else {
                    setError("Payment failed...");
                    setButtonDisable(false);
                    setTimeout(() => {
                      setError("");
                    }, 3000);
                  }
                });
              }}
              onCancel={(data, actions) => {
                setError("Payment cancel...");
                setButtonDisable(false);
                setTimeout(() => {
                  setError("");
                }, 3000);
              }}
              onShippingChange={(data, actions) => {
                setButtonDisable(false);
                return actions.resolve();
              }}
              onError={(err) => {
                setError("Payment error...");
                setButtonDisable(false);
                // For example, redirect to a specific error page
                // console.log(err);
              }}
            />
          </PayPalScriptProvider>
        </Modal>
      </>
    );
  }
  return null;
}

export default Checkout;
