import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const userTableStyles = {
  height: "650px",
};

function OrderHistory() {
  const history = useHistory();
  const columns = [
    { field: "date", headerName: "Date", width: 250, sortable: false },
    { field: "orderNo", headerName: "Order No.", width: 150 },
    {
      field: "payment",
      headerName: "Payment Type",
      width: 150,
      valueFormatter: ({ value }) => value.type,
      type: "string",
    },
    { field: "status", headerName: "Status", width: 150 },
    { field: "postCode", headerName: "Postcode", width: 150 },
    { field: "user", headerName: "Customer", width: 150 },
    {
      field: "view",
      headerName: "View",
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              color="error"
              variant="success"
              onClick={() => {
                console.log(cellValues.id);
                handleView(cellValues.id);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  // const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getOrderFromFirebase = [];
  //   const subscriber = fs
  //     .collection("orderHistory")
  //     .onSnapshot((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         getOrderFromFirebase.push({ ...doc.data(), key: doc.id });
  //       });
  //       setOrders(getOrderFromFirebase);
  //       setLoading(false);
  //     });
  //   console.log(getOrderFromFirebase);
  //   return () => subscriber();
  // }, []);

  function GetOrderFromFirebase() {
    const getOrderFromFirebase = [];
    const [orders, setOrders] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("orderHistory").get();
      snapshot.docs.map((doc) => {
        getOrderFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setOrders(getOrderFromFirebase);
      setLoading(false);
    }, []);
    return orders;
  }

  const orders = GetOrderFromFirebase();

  const [order, setOrder] = useState();

  function handleView(id) {
    fs.collection("orderHistory")
      .doc(id)
      .get()
      .then((snapshot) => {
        setOrder(snapshot.data());
      });
  }

  if (orders) {
    console.log(orders);
  }

  useEffect(() => {
    if (order) {
      console.log(order);
      history.push({
        pathname: "/eachorder",
        state: {
          orders: order,
        },
      });
    }
  }, [order]);

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  if (!isAdmin) {
    console.log(isAdmin);
    return <Redirect to="/" />;
  }
  if (loading) {
    return (
      <div className="wrapper">
        <Header />
        <Menu />
        <div className="content-wrapper">
          <div
            style={{
              display: "flex",
              backgroundColor: "#f4f6f9",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh",
            }}
          >
            <FontAwesomeIcon icon={faSpinner} className="spinner" size="8x" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orders) {
    return (
      <div className="wrapper">
        <Header />
        <Menu />
        <div className="content-wrapper">
          <div
            style={{
              paddingTop: "8px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#f4f6f9",
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFF",
                maxWidth: "1200px",
                margin: "auto",
                marginTop: "50px",
              }}
            >
              {orders.length ? (
                <DataTable
                  rows={orders}
                  columns={columns}
                  loading={!orders.length}
                  sx={userTableStyles}
                />
              ) : (
                <h1>No data</h1>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return null;
}

export default OrderHistory;
