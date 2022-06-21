import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";

const userTableStyles = {
  height: "650px",
};

function AddCategory() {
  const columns = [
    { field: "key", headerName: "UID", width: 300 },
    { field: "category", headerName: "Category", width: 300 },
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const categoryRef = useRef();
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCategoryFromFirebase = [];
    const subscriber = fs.collection("category").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getCategoryFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCategory(getCategoryFromFirebase);
      setLoading(false);
    });
    return () => subscriber();
  }, []);

  function handleAddCategory(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("category")
        .add({
          category: categoryRef.current.value,
        })
        .then(() => {
          setMessage("Add Category Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch((error) => {
          setError("Failed to add Category");
        });
    } catch (error) {
      setError("Failed to add Category");
    }
    setLoading(false);
  }

  function handleRemoveButton(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("category")
        .doc(uid)
        .delete()
        .then(() => {
          setMessage("Remove Category Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch(() => {
          setError("Failed to remove Category");
        });
    } catch {
      setError("Failed to remove Category");
    }
    setLoading(false);
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
          maxWidth: "800px",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        {message ? <Alert variant="success">{message}</Alert> : ""}
        {error ? <Alert variant="danger">{error}</Alert> : ""}
        <DataTable
          rows={category}
          columns={columns}
          loading={!category.length}
          sx={userTableStyles}
        />
      </div>
      <Container
        className="d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100 my-5" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4 align-items-center justify-content-center ">
                Add Category
              </h2>
              {/* {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>} */}
              {sendEmail ? null : (
                <Form onSubmit={handleAddCategory}>
                  <Form.Group id="uid" className="mb-3">
                    <Form.Label>UID</Form.Label>
                    <Form.Control type="text" ref={categoryRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100" type="submit">
                    Add
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default AddCategory;
