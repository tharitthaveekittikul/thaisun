import React, { useState, useEffect, useCallback, useRef } from "react";
import Products from "./Products";
import { auth, fs } from "../Config/Config";
import IndividualFilteredProduct from "./IndividualFilteredProduct";
import { Button, Modal } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { ic_delete } from "react-icons-kit/md/ic_delete";
import { minus } from "react-icons-kit/feather/minus";
import { useHistory } from "react-router-dom";
import Navbar1 from "./Navbar1";
import { useMediaQuery } from "react-responsive";
import { Scrollbars } from "react-custom-scrollbars-2";
import { shoppingBag } from "react-icons-kit/fa/shoppingBag";
import { Fab } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MilesCal from "./MilesCal";

export default function Home(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const yourBasketQuery = useMediaQuery({ query: "(min-width: 860px)" });
  const yourBasketColor = createTheme({
    palette: {
      primary: {
        main: "#e80532",
      },
    },
  });

  const ScrollRef = useRef(null);
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
    if (localStorage.getItem("isLogIn") !== null) {
      history.push("/order");
    } else {
      props.history.push("/login");
    }
  };

  const uid = GetUserUid();

  const [town, setTown] = useState("");
  const [postCode, setPostCode] = useState("");

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
              setTown(snapshot.data().Town);
              setPostCode(snapshot.data().PostCode);
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

  // globl variable
  let Product;

  // add to cart
  const addToCart = (product) => {
    if (uid !== null && localStorage.getItem("isLogIn") !== null) {
      let totalProductPrice = 0;
      if (product.option) {
        if (product.option.length > 0) {
          for (let i = 0; i < product.option.length; i++) {
            totalProductPrice += Number(product.option[i].price);
            console.log(product.option[i].menu, product.option[i].price);
          }
        }
      }
      if (product.addOn) {
        if (product.addOn.length > 0) {
          for (let j = 0; j < product.addOn.length; j++) {
            totalProductPrice += Number(product.addOn[j].price);
            console.log(product.addOn[j].menu, product.addOn[j].price);
          }
        }
      }
      console.log("==============");
      Product = product;
      Product["qty"] = 1;
      Product["priceWithAddon"] = Product.price + totalProductPrice;
      Product["TotalProductPrice"] =
        Product.qty * (Product.price + totalProductPrice);
      fs.collection("Cart " + uid)
        .add(Product)
        .then(() => {
          console.log("successfully added to cart");
        });
    } else {
      props.history.push("/login");
    }
  };

  function GetCategoryFromFirebase() {
    const getCategoryFromFirebase = [];
    const [categoryFs, setCategoryFs] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("category").get();
      snapshot.docs.map((doc) => {
        getCategoryFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCategoryFs(getCategoryFromFirebase);
    }, []);
    return categoryFs;
  }

  const categoryFs = GetCategoryFromFirebase();

  useEffect(() => {
    setSpan(categoryFs);
  }, [categoryFs]);
  const [spans, setSpan] = useState([]);

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
    if (products.length >= 1) {
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
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            DOC_ID: doc.id,
            ...doc.data(),
          }));
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
          // console.log(newCartProduct);
          setCartProducts(newCartProduct);
        });
      } else {
        //ไม่ได้ login
        setCartProducts([]);
        setTotalPrice(0);
      }
    });
  }, []);

  const fee = MilesCal();

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

  const subtotalPrice = price.reduce(reducerOfPrice, 0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    //เซ็นเงินเริ่มต้น delivery=>+fee, pickup=>no
    if (
      localStorage.getItem("Delivery") === null ||
      localStorage.getItem("Pickup") === null
    ) {
      localStorage.setItem("Pickup", true);
      localStorage.setItem("Delivery", false);
    }
    if (localStorage.getItem("Delivery") == "true") {
      setTotalPrice(Number(subtotalPrice) + Number(fee));
      console.log("dapodmdd");
    }
    if (localStorage.getItem("Pickup") == "true") {
      setTotalPrice(subtotalPrice);
      console.log("dapodmdd false");
    }
  }, []);

  useEffect(() => {
    //ทำทุกครั้งที่แก้ไขตะกร้า
    if (localStorage.getItem("Delivery") == "true") {
      setTotalPrice(Number(subtotalPrice) + Number(fee));
    } else {
      setTotalPrice(subtotalPrice);
    }
  }, [cartProducts]);

  useEffect(() => {
    //fee เปลี่ยน total เปลี่ยนตามด้วย เวลา push จาก back to menu
    if (localStorage.getItem("Delivery") == "true") {
      setTotalPrice(Number(subtotalPrice) + Number(fee));
    } else {
      setTotalPrice(subtotalPrice);
    }
  }, [fee]);

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.priceWithAddon;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .update(Product)
          .then(() => {
            console.log("increment added");
          });
      } else {
        console.log("user is not logged in to increment");
        props.history.push("/login");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    console.log(cartProduct);
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.priceWithAddon;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.DOC_ID)
            .update(Product)
            .then(() => {
              console.log("decrement");
            });
        } else {
          console.log("user is not logged in to decrement");
          props.history.push("/login");
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
          .doc(cartProduct.DOC_ID)
          .delete()
          .then(() => {
            console.log("successfully deleted");
          });
      } else {
        console.log("user is not logged in to decrement");
        props.history.push("/login");
      }
    });
  };

  const handleClickIncrease = useCallback((e) => cartProductIncrease(e));
  const handleClickDecrease = useCallback((e) => cartProductDecrease(e));
  const handleClickDelete = useCallback((e) => handleCartProductDelete(e));

  const [hideScroll, setHideScroll] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHideScroll(true);
    }, 5000);
  }, []);

  return (
    <>
      <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      {!yourBasketQuery ? (
        <>
          <Fab
            sx={{
              position: "fixed",
              bottom: (theme) => theme.spacing(1.5),
              right: (theme) => theme.spacing(1.5),
              backgroundColor: "#fff",
              height: 47,
              width: 47,
            }}
            className="yourbasket-floatbtn"
            onClick={handleShow}
          >
            <Icon className="basket-icon" icon={shoppingBag} size={30} />
          </Fab>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>YOUR BASKET</Modal.Title>
              <Icon className="your-basket1" icon={shoppingBag} size={20} />
            </Modal.Header>
            <Modal.Body>
              <div className="rightside1">
                <div className="cart-summary-box">
                  <Scrollbars autoHeight autoHeightMax={"40vh"}>
                    <table style={{ marginLeft: "20px", marginRight: "20px" }}>
                      <tbody>
                        {Array.isArray(cartProducts) && cartProducts.length ? (
                          cartProducts.map((cartProduct) => {
                            return (
                              <tr>
                                <td>
                                  <div
                                    className="action-btns-pointer"
                                    onClick={(e) =>
                                      handleClickDecrease(cartProduct)
                                    }
                                  >
                                    <Icon
                                      icon={minus}
                                      size={20}
                                      style={{
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>{cartProduct.qty}</td>
                                <td>
                                  <div
                                    className="action-btns-pointer"
                                    onClick={(e) =>
                                      handleClickIncrease(cartProduct)
                                    }
                                  >
                                    <Icon
                                      icon={plus}
                                      size={20}
                                      style={{
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <p
                                    style={{
                                      paddingTop: "10px",
                                      paddingBottom: "0",
                                      margin: "0",
                                      fontFamily: "Merriweather, serif",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                      color: "black",
                                      maxWidth: "250px",
                                    }}
                                  >
                                    {cartProduct.title}
                                  </p>
                                  {cartProduct.option.map((option) => (
                                    <p
                                      style={{
                                        padding: "0",
                                        margin: "0",
                                        textIndent: "15px",
                                        color: "rgb(130, 130, 130)",
                                        fontSize: "14px",
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
                                        textIndent: "15px",
                                        color: "rgb(130, 130, 130)",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {addOn.menu}
                                    </p>
                                  ))}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  £
                                  {Number(
                                    cartProduct.priceWithAddon * cartProduct.qty
                                  ).toFixed(2)}
                                </td>
                                <td>
                                  <div
                                    className="action-btns-pointer"
                                    onClick={(e) =>
                                      handleClickDelete(cartProduct)
                                    }
                                    style={{
                                      marginLeft: "10px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <Icon
                                      icon={ic_delete}
                                      size={20}
                                      style={{ color: "#c2052a" }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <div className="empty-basket">
                            <span>Basket is empty.</span>
                          </div>
                        )}
                      </tbody>
                    </table>
                  </Scrollbars>
                  <br></br>

                  <div className="total-section">
                    <div>
                      <span>Subtotal:</span>
                      <span>£{Number(subtotalPrice).toFixed(2)}</span>
                    </div>
                    {localStorage.getItem("Delivery") == "true" &&
                    Array.isArray(cartProducts) &&
                    cartProducts.length ? (
                      <>
                        <div>
                          <span>Delivery Fee:</span>
                          <span>£{Number(fee).toFixed(2)}</span>
                        </div>
                        <span className="del-info">
                          {town}&nbsp;{postCode}
                        </span>
                      </>
                    ) : null}
                    <div>
                      <span className="t-total">Total:</span>
                      <span className="t-total">
                        £{Number(totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="arrowbtn" style={{ margin: "10px auto" }}>
                    <Button
                      style={{
                        backgroundColor: "#e80532",
                        borderColor: "#e80532",
                        width: "max-content",
                      }}
                      onClick={handleCheckout}
                    >
                      My Order
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : null}
      <Scrollbars
        style={{
          height: 70,
          width: "auto",
          position: "sticky",
          top: "0",
          backgroundColor: "white",
          borderRadius: "5px",
          marginTop: "0px",
        }}
        className="shadow"
        onScroll={() => setHideScroll(true)}
        autoHide={hideScroll}
        autoHideTimeout={500}
        renderThumbHorizontal={({ style }) => (
          <div
            style={{
              ...style,
              backgroundColor: "rgb(255, 218, 225)",
              borderRadius: "10px",
            }}
          />
        )}
      >
        <div className="category-container-c">
          <div className="category-tab-c">
            {spans ? (
              <>
                {spans.map((individualSpan, index) => (
                  <div className="category-ind-c">
                    <span
                      key={index}
                      id={individualSpan.id}
                      onClick={() => handleChange(individualSpan)}
                      className={
                        individualSpan.id === active ? active : "deactive"
                      }
                    >
                      {individualSpan.text}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Scrollbars>

      <div className="all-home">
        <div className="menu">
          {filteredProducts.length > 0 && (
            <>
              <h1>{category}</h1>
              <div className="a-container">
                <a href="javascript:void(0)" onClick={returntoAllProducts}>
                  RETURN TO ALL MENU
                </a>
              </div>
              <div className="menu-container">
                {filteredProducts.map((individualFilteredProduct) => (
                  <IndividualFilteredProduct
                    key={individualFilteredProduct.ID}
                    individualFilteredProduct={individualFilteredProduct}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </>
          )}
          {filteredProducts.length < 1 && (
            <>
              {products.length > 0 && (
                <>
                  <h1>ALL MENU</h1>
                  <div className="menu-container">
                    <Products products={products} addToCart={addToCart} />
                  </div>
                </>
              )}
              {products.length < 1 && (
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "80vh",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="spinner"
                    size="8x"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div style={{ clear: "both" }}></div>

        {!yourBasketQuery ? (
          <></>
        ) : (
          <div className="rightside">
            <div className="cart-summary-box">
              <Icon className="your-basket" icon={shoppingBag} size={34} />
              <Scrollbars autoHeight autoHeightMax={"40vh"}>
                <table style={{ marginLeft: "20px", marginRight: "20px" }}>
                  <tbody>
                    {Array.isArray(cartProducts) && cartProducts.length ? (
                      cartProducts.map((cartProduct) => {
                        return (
                          <tr>
                            <td>
                              <div
                                className="action-btns-pointer"
                                onClick={(e) =>
                                  handleClickDecrease(cartProduct)
                                }
                              >
                                <Icon
                                  icon={minus}
                                  size={20}
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                />
                              </div>
                            </td>
                            <td>{cartProduct.qty}</td>
                            <td>
                              <div
                                className="action-btns-pointer"
                                onClick={(e) =>
                                  handleClickIncrease(cartProduct)
                                }
                              >
                                <Icon
                                  icon={plus}
                                  size={20}
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <p
                                style={{
                                  paddingTop: "10px",
                                  paddingBottom: "0",
                                  margin: "0",
                                  fontFamily: "Merriweather, serif",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  color: "black",
                                }}
                              >
                                {cartProduct.title}
                              </p>
                              {cartProduct.option.map((option) => (
                                <p
                                  style={{
                                    padding: "0",
                                    margin: "0",
                                    textIndent: "15px",
                                    color: "rgb(130, 130, 130)",
                                    fontSize: "14px",
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
                                    textIndent: "15px",
                                    color: "rgb(130, 130, 130)",
                                    fontSize: "14px",
                                  }}
                                >
                                  {addOn.menu}
                                </p>
                              ))}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              £
                              {Number(
                                cartProduct.priceWithAddon * cartProduct.qty
                              ).toFixed(2)}
                            </td>
                            <td>
                              <div
                                className="action-btns-pointer"
                                onClick={(e) => handleClickDelete(cartProduct)}
                                style={{
                                  marginLeft: "10px",
                                  marginRight: "10px",
                                }}
                              >
                                <Icon
                                  icon={ic_delete}
                                  size={20}
                                  style={{ color: "#c2052a" }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <div className="empty-basket">
                        <span>Basket is empty.</span>
                      </div>
                    )}
                  </tbody>
                </table>
              </Scrollbars>
              <br></br>

              <div className="total-section">
                <div>
                  <span>Subtotal:</span>
                  <span>£{Number(subtotalPrice).toFixed(2)}</span>
                </div>
                {localStorage.getItem("Delivery") == "true" ? (
                  <>
                    <div>
                      <span>Delivery Fee:</span>
                      <span>£{Number(fee).toFixed(2)}</span>
                    </div>
                    <span className="del-info">
                      {town}&nbsp;{postCode}
                    </span>
                  </>
                ) : null}
                <div>
                  <span className="t-total">Total:</span>
                  <span className="t-total">
                    £{Number(totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="arrowbtn" style={{ margin: "10px auto" }}>
                <Button
                  style={{
                    backgroundColor: "#e80532",
                    borderColor: "#e80532",
                    width: "max-content",
                  }}
                  onClick={handleCheckout}
                >
                  My Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
