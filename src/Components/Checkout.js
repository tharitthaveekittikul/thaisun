import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

  const handleSubmit = () => {
    setMessage("");
    setError("");
    console.log("coupons : " + Coupons);
    fs.collection("liveorder").add({
      ...fromCart,
      instructionToRes: textInstructionRef.current.value,
      user: firstName + " " + lastName,
      email: email,
      address: address,
      postCode: postCode,
      Telephone: tel,
    });
    fs.collection("users").doc(uid).update({
      Coupons: Coupons,
    });
    fs.collection("Cart " + uid)
      .get()
      .then((querySnapshot) => {
        setMessage("Order completed... Please Wait.");
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
      <Navbar user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      <h1 style={{ textAlign: "center" }}>Checkout</h1>
      {message ? <Alert variant="success">{message}</Alert> : ""}
      {error ? <Alert variant="danger">{error}</Alert> : ""}
      <div>
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
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Choose Payment
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
              "Ae_AV83W1SSK0CvJI9xvcXwN1axVGhThI4_-I54A3JwbEfhTbTz3StFW_7zuEbXMeYSd40DF67dXPBQQ&currency=GBP",
          }}
        >
          <PayPalButtons
            createOrder={(data, actions) => {
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
                  handleSubmit();
                } else {
                  setError("Payment failed...");
                  setTimeout(() => {
                    setError("");
                  }, 3000);
                }
              });
            }}
            onCancel={(data, actions) => {
              setError("Payment cancel...");
              setTimeout(() => {
                setError("");
              }, 3000);
            }}
          />
        </PayPalScriptProvider>
      </Modal>
    </>
  );
}

export default Checkout;
