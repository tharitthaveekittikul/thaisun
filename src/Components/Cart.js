import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";

import { Button, Modal } from "react-bootstrap";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Paypal from "./Paypal";

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

  const user = GetCurrentUser();
  // console.log(user);

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

  const [checkout, setCheckOut] = useState(false);

  const totalDiscount = Number(10).toFixed(2);

  const totalCost = Number(totalPrice - totalDiscount).toFixed(2);

  const [modalShow, setModalShow] = useState(false);

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
          <div className="summary-box">
            <h5>Order Summary</h5>
            <br></br>
            <div>
              Subtotal: <span>£{totalPrice}</span>
            </div>
            <div>
              Discount: <span>£{totalDiscount}</span>
            </div>
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
