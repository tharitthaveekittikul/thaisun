import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";
import EditProducts from "./EditProducts";

const userTableStyles = {
  height: "775px",
};

function ManageProducts() {
  const history = useHistory();
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
                handleRemoveButton(cellValues.id);
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

  async function handleUpdateButton(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      console.log(title);
      console.log(description);
      console.log(price);

      fs.collection("Products")
        .doc(uid)
        .update({
          title: title,
          description: description,
          price: price,
        })
        .then(() => {
          setMessage("Update Products Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch((error) => {
          setError("Failed to update products");
        });
    } catch (error) {
      console.log(error.message);
      setError("Failed to update products");
    }
    setLoading(false);
  }

  async function handleRemoveButton(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("Products")
        .doc(uid)
        .delete()
        .then(() => {
          setMessage("Remove Products Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch(() => {
          setError("Failed to remove products");
        });
    } catch {
      setError("Failed to remove products");
    }
    setLoading(false);
  }

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
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div
        style={{
          maxWidth: "1250px",
          margin: "auto",
          marginTop: "50px",
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
        <Footer />
      </div>
    </div>
  );
}

export default ManageProducts;
