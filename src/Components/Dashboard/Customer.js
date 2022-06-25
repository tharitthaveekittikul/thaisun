import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
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

function Customer() {
  const columns = [
    { field: "key", headerName: "UID", width: 300 },
    { field: "date", headerName: "Date", width: 250 },
    { field: "FirstName", headerName: "First Name", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 150 },
    { field: "Email", headerName: "E-mail", width: 250 },
  ];
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [users, setUsers] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromFirebase = [];
    const subscriber = fs.collection("users").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().isAdmin == false) {
          getUserFromFirebase.push({ ...doc.data(), key: doc.id });
        }
      });
      setUsers(getUserFromFirebase);
      setLoading(false);
    });
    console.log(getUserFromFirebase);
    return () => subscriber();
  }, []);

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
          rows={users}
          columns={columns}
          loading={!users.length}
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

export default Customer;
