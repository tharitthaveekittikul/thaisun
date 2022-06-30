import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Alert, Container, Card, Form, Modal } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";
import EditProducts from "./EditProducts";

const userTableStyles = {
  height: "775px",
};

function ManageProducts() {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uidProduct, setUIDProduct] = useState("");
  const columns = [
    { field: "key", headerName: "UID", width: 250 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    { field: "category", headerName: "Category", width: 250 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              color="error"
              variant="success"
              // onClick={() => {
              //   // console.log(cellValues.id);
              //   // handleUpdateButton(cellValues.id);
              //   handleEditButton(cellValues.id);
              // }}
              onClick={() => handleEditButton(cellValues.id)}
            >
              Edit
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
                handleShow();
                setUIDProduct(cellValues.id);
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
  const [products, setProducts] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const handleRowEditCommit = React.useCallback((params) => {
    if (params.field === "title") {
      setTitle(params.value);
    } else if (params.field === "description") {
      setDescription(params.value);
    } else if (params.field === "price") {
      setPrice(params.value);
    }
  }, []);

  function handleEditButton(uid) {
    history.push({
      pathname: "/editproducts",
      state: {
        uid: uid,
      },
    });
  }

  useEffect(() => {
    const getProductFromFirebase = [];
    const subscriber = fs.collection("Products").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getProductFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setProducts(getProductFromFirebase);
      setLoading(false);
    });
    return () => subscriber();
  }, []);

  const [categoryID, setCategoryID] = useState();

  const [countUsed, setCountUsed] = useState();

  useEffect(() => {
    console.log(categoryID);
  }, [categoryID]);

  useEffect(() => {
    fs.collection("category")
      .doc(categoryID)
      .get()
      .then((snapshot) => {
        console.log(categoryID);
        setCountUsed(snapshot.data().countUse);
      })
      .catch((error) => {
        console.log(error.message);
      });
    console.log(countUsed);
  }, [categoryID, countUsed]);

  useEffect(() => {
    fs.collection("category")
      .doc(categoryID)
      .update({
        countUse: countUsed - 1,
      });
  }, [message]); // refer to message change

  async function handleRemoveButton() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      handleClose();
      fs.collection("Products")
        .doc(uidProduct)
        .get()
        .then((snapshot) => {
          setCategoryID(snapshot.data().categoryID);
          fs.collection("Products")
            .doc(uidProduct)
            .delete()
            .then(() => {
              setMessage("Remove Products Successful");

              window.location.reload(false);
            })
            .catch(() => {
              setError("Failed to remove products");
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch {
      setError("Failed to remove products");
    }
    setLoading(false);
  }

  // console.log(users);
  if (loading) {
    return <h1></h1>;
  }

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
      <div className="content-wrapper">
        <div
          style={{
            paddingTop: "10px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#f4f6f9",
            paddingBottom: "50px",
          }}
        >
          <div
            style={{
              maxWidth: "1250px",
              margin: "auto",
              marginTop: "50px",
              backgroundColor: "#FFFF",
            }}
          >
            {message ? <Alert variant="success">{message}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
            <DataTable
              rows={products}
              columns={columns}
              loading={!products.length}
              sx={userTableStyles}
              handleRowEditCommit={handleRowEditCommit}
            />
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
      </div>
      <Footer />
    </div>
  );
}

export default ManageProducts;
