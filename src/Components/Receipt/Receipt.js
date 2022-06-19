import React, { useState, useEffect } from "react";
import "./Receipt.css";
import logo from "../../Images/thaisunlogo.png";
import { auth, fs } from "../../Config/Config";

function Receipt() {
  function handlePrint() {
    window.print();
  }
  const [totalProducts, setTotalProducts] = useState("");
  const [carts, setCarts] = useState();
  const [totalPrice, setTotalPrice] = useState(parseFloat(0));

  useEffect(() => {
    const getCartFormFirebase = [];
    let price = parseFloat(0);
    auth.onAuthStateChanged((user) => {
      if (user) {
        const subscriber = fs
          .collection("Cart " + user.uid)
          .onSnapshot((snapshot) => {
            const qty = snapshot.docs.length;
            setTotalProducts(qty);
            snapshot.forEach((doc) => {
              getCartFormFirebase.push({ ...doc.data(), key: doc.id });
            });
            for (let i = 0; i < getCartFormFirebase.length; i++) {
              price =
                parseFloat(getCartFormFirebase[i].TotalProductPrice) + price;
            }
            setTotalPrice(price);
            setCarts(getCartFormFirebase);
          });

        return () => subscriber();
      }
    });
  }, []);

  if (carts) {
    return (
      <>
        <div className="receipt">
          <div className="ticket">
            <img src={logo} alt="Logo" />
            <p className="centered">
              Thai Sun Restaurants
              <br />
              Address line 1
              <br />
              Address line 2
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
                {totalProducts > 0 ? (
                  carts.map((cart) => (
                    <>
                      <tr key={cart.key}>
                        <td className="quantity">{cart.qty}</td>
                        <td className="description">
                          {cart.title}
                          <p style={{ paddingLeft: "1.1em" }}>
                            {cart.description}
                          </p>
                        </td>
                        <td className="price">
                          {parseFloat(cart.TotalProductPrice).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <div></div>
                )}
                <tr>
                  <td className="quantity" />
                  <td className="description" style={{ tabSize: "4" }}>
                    TOTAL
                  </td>
                  <td className="price">£{totalPrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <p className="centered">
              Thanks for your purchase!
              <br />
            </p>
          </div>
          <button id="btnPrint" className="hidden-print" onClick={handlePrint}>
            Print
          </button>
        </div>
      </>
    );
  }

  return <>null</>;
}

export default Receipt;
