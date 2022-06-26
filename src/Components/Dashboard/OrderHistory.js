import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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
  const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderFromFirebase = [];
    const subscriber = fs
      .collection("orderHistory")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getOrderFromFirebase.push({ ...doc.data(), key: doc.id });
        });
        setOrders(getOrderFromFirebase);
        setLoading(false);
      });
    console.log(getOrderFromFirebase);
    return () => subscriber();
  }, []);

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

  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <DataTable
          rows={orders}
          columns={columns}
          loading={!orders.length}
          sx={userTableStyles}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default OrderHistory;
