import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { format } from "date-fns";
import Navbar1 from "./Navbar1";

function Checkout() {
  const local = useLocation();
  const history = useHistory();
  const textInstructionRef = useRef();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [tel, setTel] = useState("");
  const [getCouponsFromFirebase, setGetCouponsFromFirebase] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [couponType, setCouponType] = useState(false);

  const [pickupState, setPickupState] = useState(
    localStorage.getItem("Pickup") === "true"
  );
  const [buttonDisable, setButtonDisable] = useState(true);

  const postCodeRef = useRef();
  const addressRef = useRef();

  //   cartProducts: cartProducts,
  //         Coupon: couponSuccess,
  //         Subtotal: Number(totalPrice).toFixed(2),
  //         Discount: Number(totalDiscount).toFixed(2),
  //         Total: Number(totalCost).toFixed(2),
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            // console.log(user);
            // console.log(user.uid);
            setFirstName(snapshot.data().FirstName);
            setLastName(snapshot.data().LastName);
            setEmail(snapshot.data().Email);
            setAddress(snapshot.data().Address);
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

  function GetCurrentCart() {
    const [fromCart, setFromCart] = useState();
    useEffect(() => {
      try {
        setFromCart({
          cartProducts: local.state.cartProducts,
          Coupon: local.state.Coupon,
          Subtotal: local.state.Subtotal,
          Discount: local.state.Discount,
          Total: local.state.Total,
        });
      } catch {
        history.push("/profile");
      }
    }, []);
    return fromCart;
  }

  const fromCart = {
    cartProducts: local.state.cartProducts,
    Coupon: local.state.Coupon,
    Subtotal: local.state.Subtotal,
    Discount: local.state.Discount,
    Total: local.state.Total,
  };

  // useEffect(() => {
  //   setGetCouponsFromFirebase((prevState) => [
  //     ...prevState,
  //     local.state.Coupon,
  //   ]);
  // }, []); // getCouponsFromFirebase = [] -> edit this
  useEffect(() => {
    console.log(Coupons);
    console.log(fromCart);
    console.log(String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")));

    if (local.state.Coupon == null) {
      console.log("not use coupon", Coupons);
    } else {
      Coupons.push(local.state.Coupon);
      setCouponType(true);
      console.log("push coupon", local.state.Coupon);
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

  // function GetUserCoupons() {
  //   const [getCouponsFromFirebase, setGetCouponsFromFirebase] = useState([]);

  //   useEffect(() => {
  //     auth.onAuthStateChanged((user) => {
  //       if (user) {
  //         fs.collection("users")
  //           .doc(user.uid)
  //           .get()
  //           .then((snapshot) => {
  //             setGetCouponsFromFirebase(snapshot.data().Coupons);
  //           });
  //       } else {
  //         setGetCouponsFromFirebase([]);
  //       }
  //     });
  //   }, []);
  //   return getCouponsFromFirebase;
  // }

  // const getCategoryFromFirebase = GetUserCoupons;

  function handleChangeState(event) {
    if (event.target.value == "pickup") {
      console.log("pickup");
      setPickupState(true);
      localStorage.setItem("Delivery", false);
      localStorage.setItem("Pickup", true);
    } else if (event.target.value == "delivery") {
      console.log("delivery");
      setPickupState(false);
      localStorage.setItem("Delivery", true);
      localStorage.setItem("Pickup", false);
    }
  }

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
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  // function GetTotalOrders() {
  //   const [totalOrders, setOrders] = useState(0);
  //   fs.collection("orderHistory").onSnapshot((snapshot) => {
  //     setOrders(snapshot.docs.length);
  //   });
  //   fs.collection("liveorder").onSnapshot((snapshot) => {
  //     setOrders(totalOrders + snapshot.docs.length);
  //   });

  //   return totalOrders;
  // }

  // const totalOrders = GetTotalOrders();

  const handleSubmit = (type, detailp) => {
    let total = 0;
    let pOrder;
    let addressTemp;
    let postCodeTemp;
    if (type == "paypal") {
      pOrder = { type: "paypal", detail: detailp };
    }
    if (type == "cash") {
      pOrder = { type: "cash" };
    }
    const delState = localStorage.getItem("Delivery") === "true";
    if (delState == true) {
      addressTemp = addressRef.current.value;
      postCodeTemp = postCodeRef.current.value;
    } else {
      addressTemp = address;
      postCodeTemp = postCode;
    }

    setMessage("");
    setError("");
    console.log("coupons : " + Coupons);

    fs.collection("orderHistory")
      .get()
      .then((order) => {
        console.log("order History " + order.docs.length);
        total = total + order.docs.length;
        fs.collection("liveorder")
          .get()
          .then((live) => {
            console.log("liveorder " + live.docs.length);
            total = total + live.docs.length;
            let totalOrder = Number(total) + 1;
            fs.collection("liveorder").add({
              ...fromCart,
              instructionToRes: textInstructionRef.current.value,
              user: firstName + " " + lastName,
              email: email,
              address: addressTemp,
              postCode: postCodeTemp,
              Telephone: tel,
              pickupState: pickupState,
              deliveryState: !pickupState,
              date: String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")),
              payment: pOrder,
              orderNo: totalOrder,
            });
            fs.collection("users").doc(uid).update({
              Coupons: Coupons,
            });
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
                  console.log("order send to restaurant");
                  history.push("/");
                }, 3000);
              });
          });
      });

    console.log(total);

    // fs.collection("Cart " + uid).onSnapshot((snapshot) => {
    //   snapshot.docs.map((docID) => {
    //     fs.collection("Cart " + uid)
    //       .doc(docID.id)
    //       .delete()
    //       .then(() => {
    //         // history.push("/"); อาจไปหน้า wait for accept????
    //         setTimeout(() => {
    //           console.log("order send to restaurant");
    //           history.push("/");
    //         }, 2000);
    //       });
    //   });
    // });
  };

  return (
    <>
      <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      <h1 style={{ textAlign: "center" }}>Checkout</h1>
      {message ? <Alert variant="success">{message}</Alert> : ""}
      {error ? <Alert variant="danger">{error}</Alert> : ""}
      <div style={{ marginTop: "20px" }}>
        <FormControl>
          <FormLabel>Pick Up or Delivery</FormLabel>
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
                  control={<Radio />}
                  label="Pick Up"
                />
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
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
                  control={<Radio />}
                  label="Pick Up"
                />
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label="Delivery"
                />
              </RadioGroup>
            </>
          )}
        </FormControl>
        {pickupState ? null : (
          <div>
            <FormLabel>Address</FormLabel>
            <Form.Control
              type="text"
              ref={addressRef}
              defaultValue={address}
              required
            />
            <FormLabel>Post Code</FormLabel>
            <Form.Control
              type="text"
              ref={postCodeRef}
              defaultValue={postCode}
              required
            />
          </div>
        )}
      </div>
      <div className="checkout-table">
        <div className="subtotal cf">
          <ul>
            {fromCart.cartProducts.map((pro) => (
              <li className="totalRow">
                <span className="label">{pro.title}</span>
                <span className="value">
                  £{Number(pro.TotalProductPrice).toFixed(2)}
                </span>
              </li>
            ))}
            <li className="totalRow">
              <span className="label">Subtotal</span>
              <span className="value">
                £{Number(fromCart.Subtotal).toFixed(2)}
              </span>
            </li>
            {couponType ? (
              <li className="totalRow">
                <span className="label">Discount</span>
                <span className="value">
                  £{Number(fromCart.Discount).toFixed(2)}
                </span>
              </li>
            ) : null}
            <li className="totalRow">
              <span className="label">Shipping</span>
              <span className="value">£KJ</span>
            </li>
            <li className="totalRow final">
              <span className="label">Total</span>
              <span className="value">
                £{Number(fromCart.Total).toFixed(2)}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Instructions to the restaurant</Form.Label>
          <Form.Control
            type="text"
            ref={textInstructionRef}
            placeholder="Eg. If you arrive, please ring the bell."
          />
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        disabled={buttonDisable}
        onClick={() => setModalShow(true)}
      >
        Pay with PayPal/Credit Card
      </Button>
      <Button
        variant="primary"
        disabled={buttonDisable}
        onClick={() => [handleSubmit("cash", null), setButtonDisable(true)]}
      >
        Pay with Cash
      </Button>

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
                console.log(details);
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
              console.log(err);
            }}
          />
        </PayPalScriptProvider>
      </Modal>
    </>
  );
}

export default Checkout;
