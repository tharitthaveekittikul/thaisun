import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { fs } from "../../Config/Config";
import DataTable from "./DataTable";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const userTableStyles = {
  height: "650px",
};

function Customer() {
  const columns = [
    { field: "key", headerName: "UID", width: 300 },
    { field: "date", headerName: "Date", width: 250, sortable: false },
    { field: "FirstName", headerName: "First Name", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 150 },
    { field: "Email", headerName: "E-mail", width: 250 },
  ];
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  // const [users, setUsers] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getUserFromFirebase = [];
  //   const subscriber = fs.collection("users").onSnapshot((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       if (doc.data().isAdmin == false) {
  //         getUserFromFirebase.push({ ...doc.data(), key: doc.id });
  //       }
  //     });
  //     setUsers(getUserFromFirebase);
  //     setLoading(false);
  //   });
  //   console.log(getUserFromFirebase);
  //   return () => subscriber();
  // }, []);

  function GetUserFromFirebase() {
    const getUserFromFirebase = [];
    const [users, setUsers] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("users").get();
      snapshot.docs.map((doc) => {
        if (doc.data().isAdmin == false) {
          getUserFromFirebase.push({ ...doc.data(), key: doc.id });
        }
      });
      console.log(getUserFromFirebase);
      setUsers(getUserFromFirebase);
      setLoading(false);
    }, []);
    return users;
  }
  const users = GetUserFromFirebase();

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

  if (users) {
    return (
      <div className="wrapper">
        <Header />
        <Menu />
        <div className="content-wrapper">
          <div
            style={{
              paddingTop: "50px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#f4f6f9",
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFF",
                maxWidth: "1100px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <DataTable
                rows={users}
                columns={columns}
                loading={!users.length}
                sx={userTableStyles}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return null;
}

export default Customer;
