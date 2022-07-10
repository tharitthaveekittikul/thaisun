import React, { useState, useEffect } from "react";

import { useHistory, useLocation } from "react-router-dom";

function OrderSuccess() {
  const local = useLocation();
  const history = useHistory();

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

  const fromCart = GetCurrentCart();
  if (fromCart) {
    return (
      <>
        Order No : # {fromCart.orderNo}
        {fromCart.User}
        {fromCart.Address}
        {fromCart.Town}
        {fromCart.County}
        {fromCart.Postcode}
        {fromCart.Telephone}
        Instruction : {fromCart.instructionToRes}
      </>
    );
  }
  return null;
}

export default OrderSuccess;
