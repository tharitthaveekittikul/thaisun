import React, { useState, useEffect } from "react";
import Navbar1 from "./Navbar1";
import { auth, fs } from "../Config/Config";

import { useHistory, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

function OrderSuccess() {
  const local = useLocation();
  const history = useHistory();

  const [isAdmin, setIsAdmin] = useState(false);
  // getting current user uid
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

  const uid = GetUserUid();

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
              setIsAdmin(snapshot.data().isAdmin);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();

  function GetCurrentCart() {
    const [fromCart, setFromCart] = useState();
    useEffect(() => {
      try {
        console.log(local.state);
        setFromCart({
          cartProducts: local.state.cartProducts,
          Coupon: local.state.Coupon,
          Subtotal: local.state.Subtotal,
          Discount: local.state.Discount,
          Total: local.state.Total,
          User: local.state.user,
          Email: local.state.email,
          Address: local.state.address,
          Town: local.state.town,
          County: local.state.county,
          Postcode: local.state.postCode,
          Telephone: local.state.Telephone,
          orderNo: local.state.orderNo,
          date: local.state.date,
          deliveryState: local.state.deliveryState,
          pickupState: local.state.pickupState,
          payment: local.state.payment,
          instructionToRes: local.state.instructionToRes,
        });
      } catch {
        history.push("/");
      }
    }, []);
    return fromCart;
  }

  const handleBackHome = (e) => {
    history.push("/");
  };

  const fromCart = GetCurrentCart();
  if (fromCart) {
    return (
      <>
        <Navbar1 user={user} totalProducts={0} isAdmin={isAdmin} />
        <div className="ordersuccess-container">
          <h1>Order is send to the restaurant.</h1>
          <h1>Please wait for confirmation in your email box.</h1>
          <div className="order-box">
            <span>Order No : # {fromCart.orderNo}</span>
            <span>{fromCart.User}</span>
            <span>{fromCart.Address}</span>
            <span>
              {fromCart.Town}, {fromCart.County}, {fromCart.Postcode}
            </span>
            <span>{fromCart.Telephone}</span>
            {fromCart.instructionToRes == "" ? null : (
              <span>Instruction : {fromCart.instructionToRes}</span>
            )}
          </div>
          <div className="arrowbtn">
            <Button
              style={{
                backgroundColor: "#e80532",
                borderColor: "#e80532",
                width: "max-content",
                marginTop: "26px",
              }}
              onClick={(e) => handleBackHome()}
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}

export default OrderSuccess;
