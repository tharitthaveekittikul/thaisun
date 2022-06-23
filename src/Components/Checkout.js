import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { useHistory, useLocation } from "react-router-dom";
import { Button, Modal, Form, Alert } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Checkout() {
  const local = useLocation();
  const history = useHistory();
  //   cartProducts: cartProducts,
  //         Coupon: couponSuccess,
  //         Subtotal: Number(totalPrice).toFixed(2),
  //         Discount: Number(totalDiscount).toFixed(2),
  //         Total: Number(totalCost).toFixed(2),
  try {
    const [fromCart, setFromCart] = useState({
      cartProducts: local.state.cartProducts,
      Coupon: local.state.Coupon,
      Subtotal: local.state.Subtotal,
      Discount: local.state.Discount,
      Total: local.state.Total,
    });
    console.log(fromCart);
  } catch {
    history.push("/order");
  }
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

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      Checkout
    </>
  );
}

export default Checkout;
