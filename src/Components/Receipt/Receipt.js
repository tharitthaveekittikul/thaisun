import React, { useState, useEffect } from "react";
import "./Receipt.css";
import logo from "../../Images/thaisunlogo.png";
import { auth, fs } from "../../Config/Config";
import { Redirect, useLocation } from "react-router-dom";

function Receipt() {
  function handlePrint() {
    window.print();
  }
  // const [totalProducts, setTotalProducts] = useState("");
  // const [orders, setOrders] = useState();
  const [totalPrice, setTotalPrice] = useState(parseFloat(0));
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const location = useLocation();

  // const orders = location.state.orders;

  const orders = JSON.parse(localStorage.getItem("orders"));
  // useEffect(() => {
  //   const getCartFormFirebase = [];
  //   let price = parseFloat(0);
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       const subscriber = fs
  //         .collection("Cart " + user.uid)
  //         .onSnapshot((snapshot) => {
  //           const qty = snapshot.docs.length;
  //           setTotalProducts(qty);
  //           snapshot.forEach((doc) => {
  //             getCartFormFirebase.push({ ...doc.data(), key: doc.id });
  //           });
  //           for (let i = 0; i < getCartFormFirebase.length; i++) {
  //             price =
  //               parseFloat(getCartFormFirebase[i].TotalProductPrice) + price;
  //           }
  //           setTotalPrice(price);
  //           setCarts(getCartFormFirebase);
  //         });

  //       return () => subscriber();
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const getOrderFromFirebase = [];

  //   const subscriber = fs.collection("orderHistory").onSnapshot((snapshot) => {
  //     const qty = snapshot.docs.length;
  //     setTotalProducts(qty);
  //     snapshot.forEach((doc) => {
  //       getOrderFromFirebase.push({ ...doc.data(), key: doc.id });
  //     });

  //     setOrders(getOrderFromFirebase);
  //   });

  //   return () => subscriber();
  // }, []);
  window.addEventListener(
    "beforeunload",
    function (e) {
      this.localStorage.removeItem("orders");
    },
    false
  );

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }

  if (orders) {
    {
      console.log(orders);
    }
    return (
      <>
        <div className="receipt">
          <div className="ticket">
            <img src={logo} alt="Logo" width={187} height={133} />
            <p className="centered">
              Thai Sun Restaurants
              <br />
              {orders.payment.type === "cash" ? (
                <>
                  {orders.pickupState ? (
                    <p>CASH COLLECTION</p>
                  ) : (
                    <p>CASH DELIVERY</p>
                  )}
                </>
              ) : (
                <>
                  {orders.pickupState ? (
                    <p>PAYPAL COLLECTION</p>
                  ) : (
                    <>PAYPAL DELIVERY</>
                  )}
                </>
              )}
            </p>
            <table>
              <thead>
                <tr>
                  <th className="quantity">Q.</th>
                  <th className="description">Description</th>
                  <th className="price">£</th>
                </tr>
              </thead>
              <tbody>
                {orders.cartProducts.map((cart) => (
                  <tr key={cart.key}>
                    <td className="quantity">{cart.qty}</td>
                    <td className="description">
                      {cart.title}
                      {cart.option.map((option) => (
                        <p style={{ paddingLeft: "1.1em", margin: "0" }}>
                          {option.menu}
                        </p>
                      ))}
                      {cart.addOn.map((addon) => (
                        <p style={{ paddingLeft: "1.1em", margin: "0" }}>
                          {addon.menu}
                        </p>
                      ))}
                      <p>{cart.instruction}</p>
                    </td>
                    <td className="price">
                      {parseFloat(cart.TotalProductPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {orders.instructionToRes ? (
                  <tr>
                    <td className="quantity" />
                    <td className="description" style={{ tabSize: "4" }}>
                      Instructions: {orders.instructionToRes}
                    </td>
                  </tr>
                ) : null}
                {orders.Coupon ? (
                  <>
                    <tr>
                      <td className="quantity" />
                      <td className="description" style={{ tabSize: "4" }}>
                        Subtotal
                      </td>
                      <td className="price">
                        £{parseFloat(orders.Subtotal).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="quantity" />
                      <td className="description" style={{ tabSize: "4" }}>
                        Discount
                      </td>
                      <td className="price">
                        £{parseFloat(orders.Discount).toFixed(2)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <></>
                )}

                {orders.deliveryState ? (
                  <tr>
                    <td className="quantity" />
                    <td className="description" style={{ tabSize: "4" }}>
                      Delivery
                    </td>
                    <td className="price">£ FEE</td>
                  </tr>
                ) : (
                  <></>
                )}

                <tr>
                  <td className="quantity" />
                  <td className="description" style={{ tabSize: "4" }}>
                    TOTAL
                  </td>
                  <td className="price">
                    £{parseFloat(orders.Total).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ paddingLeft: "0.8em" }}>
              <br />
              {orders.user}
              <br />
              {orders.address}
              <br />
              {orders.postCode}
              <br />
              PHONE: {orders.Telephone}
              <br />
            </p>
            <p className="centered" style={{ paddingLeft: "0.2em" }}>
              Thanks for your purchase!
              <br />
            </p>
          </div>
        </div>
      </>
    );
  }

  return <>null</>;
}

export default Receipt;
