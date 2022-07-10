import React from "react";
import "./Receipt.css";
import logo from "../../Images/thaisunlogo.png";
import { Redirect } from "react-router-dom";

function Receipt() {
  const isLogIn = localStorage.getItem("isLogIn") === "True";

  const orders = JSON.parse(localStorage.getItem("orders"));

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
            <img
              src={logo}
              alt="Logo"
              width={187}
              height={133}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
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
            <table className="receipt-table">
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
                <tr>
                  <td className="quantity" />
                  <td className="description" style={{ tabSize: "4" }}>
                    Subtotal
                  </td>
                  <td className="price">
                    £{parseFloat(orders.Subtotal).toFixed(2)}
                  </td>
                </tr>
                {orders.Coupon ? (
                  <>
                    <tr>
                      <td className="quantity" />
                      <td className="description" style={{ tabSize: "4" }}>
                        Discount
                      </td>
                      <td className="price">
                        - £{parseFloat(orders.Discount).toFixed(2)}
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
                    <td className="price">
                      £{parseFloat(orders.Fee).toFixed(2)}
                    </td>
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
              {orders.address +
                " " +
                orders.town +
                " " +
                orders.county +
                " " +
                orders.postCode}
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
