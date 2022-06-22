import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import Products from "./Products";
import { auth, fs } from "../Config/Config";
import IndividualFilteredProduct from "./IndividualFilteredProduct";
import CartProducts from "./CartProducts";
import { Button, Table } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { ic_delete } from "react-icons-kit/md/ic_delete";
import { minus } from "react-icons-kit/feather/minus";
import Delivery from "./Delivery";
import Pickup from "./Pickup";
import { useHistory } from "react-router-dom";

export default function Home(props) {
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
  const history = useHistory();
  const handleCheckout = () => {
    history.push("/checkout");
  };

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
  // console.log(user);

  // state of products
  const [products, setProducts] = useState([]);

  // getting products function
  const getProducts = async () => {
    const products = await fs.collection("Products").get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

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

  // globl variable
  let Product;

  // add to cart
  const addToCart = (product) => {
    if (uid !== null) {
      // console.log(product);
      Product = product;
      Product["qty"] = 1;
      Product["TotalProductPrice"] = Product.qty * Product.price;
      fs.collection("Cart " + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log("successfully added to cart");
        });
    } else {
      props.history.push("/login");
    }
  };

  // categories list rendering using span tag
  const [spans] = useState([
    { id: "ElectronicDevices", text: "Electronic Devices" },
    { id: "MobileAccessories", text: "Mobile Accessories" },
    { id: "TVAndHomeAppliances", text: "TV & Home Appliances" },
    { id: "SportsAndOutdoors", text: "Sports & outdoors" },
    { id: "HealthAndBeauty", text: "Health & Beauty" },
    { id: "HomeAndLifestyle", text: "Home & Lifestyle" },
    { id: "MensFashion", text: `Men's Fashion` },
    { id: "WatchesBagsAndJewellery", text: `Watches, bags & Jewellery` },
    { id: "Groceries", text: "Groceries" },
  ]);

  // active class state
  const [active, setActive] = useState("");

  // category state
  const [category, setCategory] = useState("");

  // handle change ... it will set category and active states
  const handleChange = (individualSpan) => {
    setActive(individualSpan.id);
    setCategory(individualSpan.text);
    filterFunction(individualSpan.text);
  };

  // filtered products state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // filter function
  const filterFunction = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.category === text);
      setFilteredProducts(filter);
    } else {
      console.log("no products to filter");
    }
  };

  // return to all products
  const returntoAllProducts = () => {
    setActive("");
    setCategory("");
    setFilteredProducts([]);
  };

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

  const totalPrice = price.reduce(reducerOfPrice, 0);

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    console.log(cartProduct);
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
    console.log(cartProduct);
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

  const handleClickIncrease = useCallback((e) => cartProductIncrease(e));
  const handleClickDecrease = useCallback((e) => cartProductDecrease(e));
  const handleClickDelete = useCallback((e) => handleCartProductDelete(e));

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <h6>Filter by category</h6>
          {spans.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleChange(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}
        </div>
        {filteredProducts.length > 0 && (
          <div className="my-products">
            <h1 className="text-center">{category}</h1>
            <a href="javascript:void(0)" onClick={returntoAllProducts}>
              Return to All Products
            </a>
            <div className="products-box">
              {filteredProducts.map((individualFilteredProduct) => (
                <IndividualFilteredProduct
                  key={individualFilteredProduct.ID}
                  individualFilteredProduct={individualFilteredProduct}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
        {filteredProducts.length < 1 && (
          <>
            {products.length > 0 && (
              <div className="my-products">
                <h1 className="text-center">All Products</h1>
                <div className="products-box">
                  <Products products={products} addToCart={addToCart} />
                </div>
              </div>
            )}
            {products.length < 1 && (
              <div className="my-products please-wait">Please wait...</div>
            )}
          </>
        )}
        <div>
          <div className="method-home-container">
            <div className="method-home">
              <Delivery />
            </div>
            <div className="method-home">
              <Pickup />
            </div>
          </div>
          <div className="cart-summary-box">
            {localStorage.getItem("Pickup") ? (
              <h6>Pickup</h6>
            ) : (
              <h6>Delivery</h6>
            )}
            <h5>Your Basket</h5>
            <table>
              <tbody>
                {cartProducts.map((cartProduct) => {
                  return (
                    <tr>
                      <td>
                        <div
                          className="action-btns minus"
                          onClick={(e) => handleClickDecrease(cartProduct)}
                        >
                          <Icon icon={minus} size={20} />
                        </div>
                      </td>
                      <td>{cartProduct.qty}</td>
                      <td>
                        <div
                          className="action-btns plus"
                          onClick={(e) => handleClickIncrease(cartProduct)}
                        >
                          <Icon icon={plus} size={20} />
                        </div>
                      </td>
                      {console.log(cartProduct)}
                      <td>
                        <p
                          style={{
                            fontWeight: "bold",
                            paddingTop: "10px",
                            paddingBottom: "0",
                            margin: "0",
                          }}
                        >
                          {cartProduct.title}
                        </p>
                        {cartProduct.option.map((option) => (
                          <p
                            style={{
                              padding: "0",
                              margin: "0",
                              textIndent: "10px",
                            }}
                          >
                            {option.menu}
                          </p>
                        ))}
                        {cartProduct.addOn.map((addOn) => (
                          <p
                            style={{
                              padding: "0",
                              margin: "0",
                              textIndent: "10px",
                            }}
                          >
                            {addOn.menu}
                          </p>
                        ))}
                      </td>
                      <td>£{cartProduct.price * cartProduct.qty}</td>
                      <td>
                        <div
                          className="action-btns plus"
                          onClick={(e) => handleClickDelete(cartProduct)}
                        >
                          <Icon icon={ic_delete} size={20} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br></br>
            <div style={{ justifyContent: "flex-end" }}>
              Total Cost: <span>£{totalPrice}</span>
            </div>
            <div style={{ justifyContent: "center", marginTop: "20px" }}>
              {" "}
              <div
                className="btn btn-danger btn-md cart-btn"
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                }}
                onClick={handleCheckout}
              >
                CHECKOUT
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
