import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useHistory } from "react-router-dom";

import Navbar1 from "./Navbar1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const history = useHistory();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
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

  const [loading, setLoading] = useState(false);

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            DOC_ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
          setLoading(true);
        });
      } else {
        console.log("user is not signed in to retrieve cart");
      }
    });
  }, []);

  // console.log(cartProducts);

  // getting the qty from cartProducts in a seperate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // console.log(totalQty);

  // getting the TotalProductPrice from cartProducts in a seperate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = Number(price.reduce(reducerOfPrice, 0)).toFixed(2);

  useEffect(() => {
    setTotalCost(Number(totalPrice).toFixed(2));
  }, [totalPrice]);

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.priceWithAddon;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .update(Product)
          .then(() => {
            console.log("increment added");
          });
      } else {
        console.log("user is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.priceWithAddon;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.DOC_ID)
            .update(Product)
            .then(() => {
              console.log("decrement");
            });
        } else {
          console.log("user is not logged in to decrement");
        }
      });
    } else if (Product.qty == 1) {
      handleCartProductDelete(cartProduct);
    }
  };

  const handleCartProductDelete = (cartProduct) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .delete()
          .then(() => {
            console.log("successfully deleted");
          });
      } else {
        console.log("user is not logged in to decrement");
      }
    });
  };

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

  const [modalShow, setModalShow] = useState(false);

  const couponInputRef = useRef();
  const [couponState, setCouponState] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [couponFs, setCouponFs] = useState(null);
  const [couponCount, setCouponCount] = useState(0);

  const [minimum, setMinimum] = useState("");

  useEffect(() => {
    const getCouponFromFirebase = [];
    const subscriber = fs.collection("coupon").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getCouponFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCouponFs(getCouponFromFirebase);
    });
    return () => subscriber();
  }, []);

  const [couponSuccess, setCouponSuccess] = useState(null);

  const handleCouponInput = (e) => {
    var stateTemp = false;
    setCouponCount(1);
    setError("");
    setMessage("");
    setCouponState(null);
    var alreadyUseCheck = false;
    setMinimum("");
    setTotalCost(totalPrice);
    setCouponType(false);

    e.preventDefault();
    let couponInput = couponInputRef.current.value;
    fs.collection("users")
      .doc(uid)
      .get()
      .then((userSnapshot) => {
        for (let j = 0; j < userSnapshot.data().Coupons.length; j++) {
          if (userSnapshot.data().Coupons[j] == couponInput) {
            alreadyUseCheck = true;
          }
        }
        if (alreadyUseCheck == true) {
          //already use
          setError("You already use this coupon.");
          setCouponSuccess(null);
        } else {
          //ไปต่อ หา coupon ว่ามีที่ตรงมั้ย
          for (let i = 0; i < couponFs.length; i++) {
            if (couponFs[i].coupon == couponInput) {
              console.log(couponFs[i].minimum);
              if (couponFs[i].minimum == "-") {
                setMinimum(0);
                stateTemp = true;
                console.log("- minimummmmmmmm");
                setCouponSuccess(couponInput);
                setCouponState(true);
              } else {
                setMinimum(Number(couponFs[i].minimum));
                stateTemp = true;
                console.log("have minimummmmmmmmmmmmmmmmm");
                setCouponSuccess(couponInput);
                setCouponState(true);
              }
            }
          }
          if (stateTemp) {
          } else {
            console.log("statetemp falseeeeeeeeee");
            setMinimum(0);
            setCouponState(false);
          }
        }
      });
  };

  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [couponType, setCouponType] = useState(false);

  useEffect(() => {
    console.log("coupon check");
    console.log(totalCost, minimum, couponState);
    if (couponState && totalCost > minimum) {
      //คูปองมี ใช้ได้
      setMessage("Coupon activated.");
      handleDiscount(true);
    } else if (couponState && totalCost < minimum) {
      setError("Your total is not reaching the minimum.");
      setCouponSuccess(null);
      handleDiscount(false);
    } else if (couponState == false && couponCount == 1) {
      //ไม่มีในระบบ บอกไม่มีจ้า
      setError("This coupon is not exist.");
      setCouponSuccess(null);
      handleDiscount(true);
    }
  }, [couponState]);

  const handleDiscount = (check) => {
    let couponInput = couponInputRef.current.value;
    console.log(check);
    for (let i = 0; i < couponFs.length; i++) {
      if (couponFs[i].coupon == couponInput) {
        let discount = Number(couponFs[i].value).toFixed(2);
        if (couponFs[i].type == "fixed" && check == true) {
          setTotalDiscount(discount);
          setCouponType(true);
          if (Number(totalPrice - Number(discount)) < 0) {
            setTotalCost(0);
          } else {
            setTotalCost(Number(totalPrice - Number(discount)).toFixed(2));
          }
        } else if (couponFs[i].type == "percent" && check == true) {
          setCouponType(true);
          setTotalDiscount(
            Number(totalPrice * ((100 - Number(discount)) / 100)).toFixed(2)
          );
          setTotalCost(
            Number(totalPrice * (Number(discount) / 100)).toFixed(2)
          );
        } else if (check == false) {
          setTotalDiscount(0);
        }
      }
    }
  };

  const handleCheckout = () => {
    console.log(cartProducts);
    console.log(couponSuccess);
    history.push({
      pathname: "/checkout",
      state: {
        cartProducts: cartProducts,
        Coupon: couponSuccess,
        Subtotal: Number(totalPrice).toFixed(2),
        Discount: Number(totalDiscount).toFixed(2),
        Total: Number(totalCost).toFixed(2),
        onCheck: true,
      },
    });
  };

  useEffect(() => {
    console.log(couponSuccess);
  }, [couponSuccess]);

  return (
    <>
      <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      {loading ? (
        cartProducts.length < 1 && (
          <div className="basket-empty">Basket is empty.</div>
        )
      ) : (
        <div className="basket-empty">
          <div
            style={{
              display: "flex",
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh",
            }}
          >
            <FontAwesomeIcon icon={faSpinner} className="spinner" size="10x" />
          </div>
        </div>
      )}
      {cartProducts.length > 0 && (
        <div className="wrap cf">
          <div className="heading cf">
            <h1>My Order</h1>
          </div>
          <div className="cart">
            <ul className="cartWrap">
              <CartProducts
                cartProducts={cartProducts}
                cartProductIncrease={cartProductIncrease}
                cartProductDecrease={cartProductDecrease}
              />
            </ul>
          </div>
          <div className="bottom-container">
            <div className="promoCode">
              <Form
                onSubmit={handleCouponInput}
                style={{
                  width: "85%",
                  justifyContent: "center",
                  flexDirection: "column",
                  display: "flex",
                  margin: "1px auto",
                  marginBottom: "20px",
                }}
              >
                <Form.Group id="coupon" className="mb-3"></Form.Group>
                <Form.Label>Have Voucher?</Form.Label>
                <div style={{ flexDirection: "row", display: "flex" }}>
                  <Form.Control
                    type="text"
                    ref={couponInputRef}
                    defaultValue={null}
                  />
                  <div>
                    <Button type="submit">Add</Button>
                  </div>
                </div>
                {message ? <Alert variant="success">{message}</Alert> : ""}
                {error ? <Alert variant="danger">{error}</Alert> : ""}
              </Form>
            </div>
            <div className="total-checkout">
              <div className="subtotal">
                <div>
                  <span className="label">Subtotal: </span>
                  <span className="value">
                    £{Number(totalPrice).toFixed(2)}
                  </span>
                </div>
                {couponType ? (
                  <div>
                    <span className="label">Discount: </span>
                    <span className="value">
                      £{Number(totalDiscount).toFixed(2)}
                    </span>
                  </div>
                ) : null}
                <div>
                  <span className="label">Delivery Fee: </span>
                  <span className="value">£KJ</span>
                </div>
                <div>
                  <span
                    className="label"
                    style={{ fontWeight: 500, fontSize: 28 }}
                  >
                    Total:{" "}
                  </span>
                  <span
                    className="value"
                    style={{ fontWeight: 500, fontSize: 28 }}
                  >
                    £{Number(totalCost).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="arrowbtn" style={{ margin: "0 auto" }}>
                <Button onClick={handleCheckout}>Checkout</Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      value: Number(totalCost).toFixed(2),
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );
                console.log(details);
              });
            }}
            onCancel={(data, actions) => {
              console.log("cancel=======");
            }}
          />
        </PayPalScriptProvider>
      </Modal>
    </>
  );
}
