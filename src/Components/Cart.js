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
import MilesCal from "./MilesCal";

export default function Cart() {
  const [discountChange, setDiscountChange] = useState(0);
  const [qtyChange, setQtyChange] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    // console.log("totalcost change: ", totalCost);
  }, [totalCost]);

  const [lastCoupon, setLastCoupon] = useState(false);

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
        // console.log("user is not signed in to retrieve cart");
      }
    });
  }, []);

  // getting the TotalProductPrice from cartProducts in a seperate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const subtotalPrice = Number(price.reduce(reducerOfPrice, 0)).toFixed(2);
  const [totalPrice, setTotalPrice] = useState(0);

  // // console.log(cartProducts);

  // getting the qty from cartProducts in a seperate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // // console.log(totalQty);

  const GetFee = () => {
    let fee;
    if (localStorage.getItem("Delivery") == "true") {
      fee = MilesCal();
    } else {
      fee = 1;
      fee = 0;
    }
    return fee;
  };

  const fee = Number(GetFee());

  useEffect(() => {
    // console.log(fee, qtyChange);
    // console.log(
    //   "change qty: ",
    //   Number(Number(subtotalPrice) + Number(fee)).toFixed(2),
    //   Number(Number(subtotalPrice) + Number(fee)).toFixed(2)
    // );
    setTotalPrice(Number(Number(subtotalPrice) + Number(fee)).toFixed(2));
    setTotalCost(Number(Number(subtotalPrice) + Number(fee)).toFixed(2));
  }, [fee, cartProducts]);

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.priceWithAddon;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        setQtyChange(qtyChange + 1);
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .update(Product)
          .then(() => {
            // console.log("increment added");
          });
      } else {
        // console.log("user is not logged in to increment");
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
          setQtyChange(qtyChange + 1);
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.DOC_ID)
            .update(Product)
            .then(() => {
              // console.log("decrement");
            });
        } else {
          // console.log("user is not logged in to decrement");
        }
      });
    } else if (Product.qty == 1) {
      handleCartProductDelete(cartProduct);
    }
  };

  const handleCartProductDelete = (cartProduct) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setQtyChange(qtyChange + 1);
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .delete()
          .then(() => {
            // console.log("successfully deleted");
          });
      } else {
        // console.log("user is not logged in to decrement");
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
    setCheckoutLoading(true);
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
    let couponInput = couponInputRef.current.value.toUpperCase();
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
          setCheckoutLoading(false);
        } else {
          //ไปต่อ หา coupon ว่ามีที่ตรงมั้ย
          for (let i = 0; i < couponFs.length; i++) {
            if (couponFs[i].coupon == couponInput) {
              // console.log("minimum: ", couponFs[i].minimum);
              if (couponFs[i].minimum == "-") {
                setMinimum(0);
                stateTemp = true;
                setCouponSuccess(couponInput);
                setCouponState(true);
              } else {
                setMinimum(Number(couponFs[i].minimum));
                stateTemp = true;
                setCouponSuccess(couponInput);
                setCouponState(true);
              }
            }
          }
          if (stateTemp) {
          } else {
            setMinimum(0);
            setCouponState(false);
          }
        }
      });
  };

  const [totalDiscount, setTotalDiscount] = useState(0);

  const [couponType, setCouponType] = useState(false);

  const [couponCheck, setCouponCheck] = useState(null);

  useEffect(() => {
    setMessage("");
    setError("");
    // console.log("USEEFFECT SEND TO COUPON DO");
    // console.log(
    //   "subtotal: ",
    //   subtotalPrice,
    //   "minimum: ",
    //   minimum,
    //   "coupon state: ",
    //   couponState
    // );
    if (couponState && subtotalPrice > minimum) {
      //คูปองมี ใช้ได้
      setMessage("Coupon activated.");
      setLastCoupon(true);
      // console.log("Coupon activated.");
      setCouponCheck(true);
      setCouponSuccess(couponInputRef.current.value.toUpperCase());
    } else if (couponState && subtotalPrice < minimum) {
      setError("Your total is not reaching the minimum.");
      setCouponSuccess(null);
      setLastCoupon(false);
      // console.log("Your total is not reaching the minimum.");
      setTotalDiscount(0);
      setCouponType(false);
      setCheckoutLoading(false);
    } else if (couponState == false && couponCount == 1) {
      //ไม่มีในระบบ บอกไม่มีจ้า
      setError("This coupon is not exist.");
      setCouponSuccess(null);
      setLastCoupon(false);
      setTotalDiscount(0);
      // console.log("This coupon is not exist.");
      setCouponCheck(true);
    }
  }, [couponState, cartProducts]);

  var finalTotal;
  useEffect(() => {
    finalTotal = Number(totalPrice);
  }, []);

  useEffect(() => {
    // console.log("COUPON DO");
    try {
      if (couponCheck !== null) {
        let couponInput = couponInputRef.current.value.toUpperCase();
        // console.log("couponCheck: ", couponCheck);
        for (let i = 0; i < couponFs.length; i++) {
          if (couponFs[i].coupon == couponInput) {
            let discount = Number(couponFs[i].value).toFixed(2);
            if (couponFs[i].type == "fixed" && couponCheck == true) {
              setTotalDiscount(discount);
              setCouponType(true);
              // console.log(
              //   "subtotal - discount = ",
              //   Number(Number(subtotalPrice) - Number(discount))
              // );
              if (Number(Number(subtotalPrice) - Number(discount)) < 0) {
                setTotalDiscount(subtotalPrice);
                finalTotal = 0;
                // console.log("subtotal < discount => total = 0", finalTotal);
                setTotalCost(Number(finalTotal) + Number(fee));
                setDiscountChange(discountChange + 1);
              } else {
                finalTotal = Number(
                  Number(subtotalPrice) - Number(discount)
                ).toFixed(2);
                setTotalCost(Number(finalTotal) + Number(fee));
                setDiscountChange(discountChange + 1);
              }
            } else if (couponFs[i].type == "percent" && couponCheck == true) {
              // console.log("percent coupon");
              setCouponType(true);
              setTotalDiscount(
                Number(
                  Number(subtotalPrice) * (Number(discount) / 100)
                ).toFixed(2)
              );
              finalTotal = Number(
                Number(subtotalPrice) * ((100 - Number(discount)) / 100)
              ).toFixed(2);
              setTotalCost(Number(finalTotal) + Number(fee));
              setDiscountChange(discountChange + 1);
            }
          }
        }
        setCheckoutLoading(false);
        setCouponCheck(null);
      } else {
        // console.log("couponcheck to null");
        setCheckoutLoading(false);
        setCouponCheck(null);
      }
    } catch {}
  }, [couponCheck]);

  useEffect(() => {
    // console.log(discountChange);
    // console.log("change total cost: ", totalCost, finalTotal);
  }, [discountChange]);

  const handleCheckout = () => {
    // console.log(fee);
    history.push({
      pathname: "/checkout",
      state: {
        cartProducts: cartProducts,
        Coupon: couponSuccess,
        Fee: Number(fee).toFixed(2),
        Subtotal: Number(subtotalPrice).toFixed(2),
        Discount: Number(totalDiscount).toFixed(2),
        Total: Number(totalCost).toFixed(2),
        onCheck: true,
      },
    });
  };

  useEffect(() => {
    // console.log("coupon name: ", couponSuccess);
  }, [couponSuccess]);

  const handleBackHome = (e) => {
    history.push("/");
  };

  return (
    <>
      <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      {loading ? (
        cartProducts.length < 1 && (
          <>
            <div className="basket-empty">
              <h1>Basket is empty.</h1>
              <div className="arrowbtn">
                <Button
                  style={{
                    backgroundColor: "#e80532",
                    borderColor: "#e80532",
                    width: "max-content",
                  }}
                  onClick={(e) => handleBackHome()}
                >
                  Back to Menu
                </Button>
              </div>
            </div>
          </>
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
            <FontAwesomeIcon icon={faSpinner} className="spinner" size="8x" />
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
                  <div className="queryProfilebtn">
                    <Button
                      variant="danger"
                      disabled={checkoutLoading}
                      type="submit"
                    >
                      Add
                    </Button>
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
                    £{Number(subtotalPrice).toFixed(2)}
                  </span>
                </div>
                {couponType ? (
                  <div>
                    <span className="label">Discount: </span>
                    <span className="value">
                      - £{Number(totalDiscount).toFixed(2)}
                    </span>
                  </div>
                ) : null}
                {localStorage.getItem("Delivery") == "true" ? (
                  <div>
                    <span className="label">Delivery Fee: </span>
                    <span className="value"> £{Number(fee).toFixed(2)}</span>
                  </div>
                ) : null}
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
              <div
                className="arrowbtn"
                style={{ margin: "0 auto", marginBottom: "20px" }}
              >
                <Button disabled={checkoutLoading} onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-100 text-center mt-3">
        IF YOU WOULD LIKE{" "}
        <p style={{ fontWeight: "500", display: "inline" }}>MORE or LESS</p>{" "}
        SPICY PLEASE INFORM WHEN YOU PLACE ORDER <br></br>
        <br></br>
        <hr style={{ width: "50%", margin: "auto" }} />
        <br></br>"<p style={{ color: "red", display: "inline" }}>**</p>the times
        given are estimated times only, this may be subject to the number of
        order but we will endeavour to deliver on time"<br></br> <br></br>
        ESTIMATED TIME FOR COLLECTION within 30 minute
        <p style={{ color: "red", display: "inline" }}>**</p> <br></br>ESTIMATED
        TIME FOR DELIVERY within 60 minute
        <p style={{ color: "red", display: "inline" }}>**</p>
        <br></br>
        <br></br> FRIDAY & SATURDAY DELIVERY MAY TAKE{" "}
        <p style={{ color: "red", display: "inline", fontWeight: "500" }}>
          LONGER
        </p>
        , COLLECTION RECOMMENDED!! <br></br>
        <br></br>
        <p style={{ fontSize: "25px", fontWeight: "500" }}>
          MINIMUM ORDER FOR DELIVERY £10.00
        </p>
      </div>

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
                // console.log(details);
              });
            }}
            onCancel={(data, actions) => {
              // console.log("cancel=======");
            }}
          />
        </PayPalScriptProvider>
      </Modal>
    </>
  );
}
