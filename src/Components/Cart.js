import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Paypal from "./Paypal";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";

export default function Cart() {
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

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
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
  }, totalPrice);

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.ID)
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
      Product.TotalProductPrice = Product.qty * Product.price;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.ID)
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
          .doc(cartProduct.ID)
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
  const [alreadyUseCheck, setAlreadyUseCheck] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [couponFs, setCouponFs] = useState(null);
  const [couponCount, setCouponCount] = useState(0);

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

  const handleCouponInput = (e) => {
    setCouponCount(1);
    setError("");
    setMessage("");
    setCouponState(false);
    setAlreadyUseCheck(false);

    e.preventDefault();
    let couponInput = couponInputRef.current.value;
    fs.collection("users")
      .doc(uid)
      .get()
      .then((userSnapshot) => {
        for (let j = 0; j < userSnapshot.data().Coupons.length; j++) {
          if (userSnapshot.data().Coupons[j] == couponInput) {
            setAlreadyUseCheck(true);
          }
        }
        if (alreadyUseCheck == true) {
          //already use
          setError("You already use this coupon.");
        } else {
          //ไปต่อ หา coupon ว่ามีที่ตรงมั้ย
          for (let i = 0; i < couponFs.length; i++) {
            if (couponFs[i].coupon == couponInput) {
              setCouponState(true);
            }
          }
        }
      });
  };

  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (couponState) {
      //คูปองมี ใช้ได้
      setMessage("Coupon activated.");
      handleDiscount();
    } else if (couponState == false && couponCount == 1) {
      //ไม่มีในระบบ บอกไม่มีจ้า
      setError("This coupon is not exist.");
      setTotalDiscount(0);
    }
  }, [couponState]);

  const handleDiscount = () => {
    let couponInput = couponInputRef.current.value;
    for (let i = 0; i < couponFs.length; i++) {
      if (couponFs[i].coupon == couponInput) {
        let discount = Number(couponFs[i].value).toFixed(2);
        console.log(discount);
        setTotalDiscount(discount);
        if (Number(totalPrice - Number(discount)) < 0) {
          setTotalCost(0);
        } else {
          setTotalCost(Number(totalPrice - Number(discount)).toFixed(2));
        }
      }
    }
  };

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">My Order</h1>
          <div className="products-box cart">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <Form onSubmit={handleCouponInput}>
            <Form.Group id="coupon" className="mb-3"></Form.Group>
            <Form.Label>Have Coupon?</Form.Label>
            <Form.Control
              type="text"
              ref={couponInputRef}
              defaultValue={null}
            />
            <Button className="w-100" type="submit">
              Add
            </Button>
            {message ? <Alert variant="success">{message}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
          </Form>
          <div className="summary-box">
            <h5>Order Summary</h5>
            <br></br>
            <div>
              Subtotal: <span>£{totalPrice}</span>
            </div>
            {couponState ? (
              <div>
                Discount: <span>-£{totalDiscount}</span>
              </div>
            ) : null}
            <div style={{ fontWeight: "bold" }}>
              Total: <span>£{totalCost}</span>
            </div>
            <br></br>
            <div style={{ justifyContent: "center" }}>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Choose Payment
              </Button>
            </div>
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div>
          <div style={{ justifyContent: "center", display: "flex" }}>
            Basket is empty.
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
