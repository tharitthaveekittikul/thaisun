import React, { useEffect, useState, useRef } from "react";
import { auth, fs } from "../../Config/Config";
import { Button, Alert, Container, Card, Form, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DataTable from "./DataTable";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const userTableStyles = {
  height: "650px",
};

function ManageAdmin() {
  const [loadingMsg, setLoadingMsg] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uidUser, setUIDUser] = useState("");
  const columns = [
    { field: "key", headerName: "UID", width: 300 },
    { field: "date", headerName: "Date", width: 250, sortable: false },
    { field: "FirstName", headerName: "First Name", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 150 },
    { field: "Email", headerName: "E-mail", width: 250 },
    { field: "isAdmin", headerName: "isAdmin", width: 150 },
    {
      field: "add",
      headerName: "Add",
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              color="error"
              variant="success"
              onClick={() => {
                console.log(cellValues.id);
                handleAddButton(cellValues.id);
              }}
            >
              Add
            </Button>
          </div>
        );
      },
    },
    {
      field: "remove",
      headerName: "Remove",
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              color="error"
              variant="danger"
              onClick={() => {
                console.log(cellValues.id);
                // handleRemoveButton(cellValues.id);
                setUIDUser(cellValues.id);
                handleShow();
              }}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [loading, setLoading] = useState(true);
  // const [users, setUsers] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const [uid, setUid] = useState("");

  // useEffect(() => {
  //   const getUserFormFirebase = [];
  //   const subscriber = fs.collection("users").onSnapshot((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       getUserFormFirebase.push({ ...doc.data(), key: doc.id });
  //     });
  //     setUsers(getUserFormFirebase);
  //     setLoading(false);
  //   });
  //   return () => subscriber();
  // }, []);

  function GetUserFromFirebase() {
    const getUserFromFirebase = [];
    const [users, setUsers] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("users").get();
      snapshot.docs.map((doc) => {
        getUserFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setUsers(getUserFromFirebase);
      setLoading(false);
    }, []);
    return users;
  }

  const users = GetUserFromFirebase();

  // console.log(users);
  if (loading) {
    return <h1>loading firebase data...</h1>;
  }

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  if (!isAdmin) {
    console.log(isAdmin);
    return <Redirect to="/" />;
  }

  async function handleAddButton(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      setLoadingMsg("Loading...");

      fs.collection("users")
        .doc(uid)
        .update({
          isAdmin: true,
        })
        .then(() => {
          setMessage("Add Admin Successful");
          setLoadingMsg("");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch((error) => {
          setError("Failed to add Admin");
        });
    } catch (error) {
      setError("Failed to add Admin");
    }
    setLoading(false);
  }

  async function handleRemoveButton() {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      setLoadingMsg("Loading...");
      window.scrollTo(0, 0);
      handleClose();
      fs.collection("users")
        .doc(uidUser)
        .update({
          isAdmin: false,
        })
        .then(() => {
          setMessage("Remove Admin Successful");

          setLoadingMsg("");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch(() => {
          setError("Failed to remove Admin");
        });
    } catch {
      setError("Failed to remove Admin");
    }
    setLoading(false);
  }

  // Note user.key = uid
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div className="content-wrapper">
        <div
          style={{
            paddingTop: "10px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#f4f6f9",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFF",
              maxWidth: "1500px",
              margin: "auto",
              marginTop: "50px",
            }}
          >
            {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
            {message ? <Alert variant="success">{message}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
            <DataTable
              rows={users}
              columns={columns}
              loading={!users.length}
              sx={userTableStyles}
            />
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleRemoveButton}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
}

export default ManageAdmin;
