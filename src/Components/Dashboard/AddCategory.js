import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { Button, Alert, Container, Card, Form, Modal } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";

const userTableStyles = {
  height: "650px",
};

function AddCategory() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uidCategory, setUIDCategory] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const columns = [
    { field: "key", headerName: "UID", width: 250 },
    { field: "category", headerName: "Category", width: 300 },
    { field: "countUse", headerName: "Use", width: 100 },
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
                setUIDCategory(cellValues.id);
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const [category, setCategory] = useState("");
  const categoryRef = useRef();
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getCategoryFromFirebase = [];
  //   const subscriber = fs.collection("category").onSnapshot((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       getCategoryFromFirebase.push({ ...doc.data(), key: doc.id });
  //     });
  //     setCategory(getCategoryFromFirebase);
  //     setLoading(false);
  //   });
  //   return () => subscriber();
  // }, []);

  function GetCategoryFromFirebase() {
    const getCategoryFromFirebase = [];
    const [category, setCategory] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("category").get();
      snapshot.docs.map((doc) => {
        getCategoryFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCategory(getCategoryFromFirebase);
      setLoading(false);
    }, []);
    return category;
  }

  const category = GetCategoryFromFirebase();

  function handleAddCategory(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoadingMsg("Loading...");
      window.scrollTo(0, 0);
      setLoading(true);
      handleClose();
      fs.collection("category")
        .add({
          category: categoryRef.current.value,
          id: categoryRef.current.value,
          text: categoryRef.current.value,
          countUse: 0,
        })
        .then(() => {
          setMessage("Add Category Successful");
          setLoadingMsg("");
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
        .doc(uidCategory)
        .delete()
        .then(() => {
          setMessage("Remove Category Successful");
          setTimeout(() => {
            handleClose();
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
  if (category) {
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
                maxWidth: "900px",
                margin: "auto",
                marginTop: "50px",
              }}
            >
              {loadingMsg ? (
                <Alert variant="secondary">{loadingMsg}</Alert>
              ) : (
                ""
              )}
              {message ? <Alert variant="success">{message}</Alert> : ""}
              {error ? <Alert variant="danger">{error}</Alert> : ""}
              <DataTable
                rows={category}
                columns={columns}
                loading={!category.length}
                sx={userTableStyles}
              />
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

            <div
              className="w-100 my-5"
              style={{
                maxWidth: "400px",
                marginLeft: "37%",
              }}
            >
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
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={categoryRef} required />
                      </Form.Group>
                      <Button
                        disabled={loading}
                        className="w-100"
                        type="submit"
                      >
                        Add
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
  return null;
}

export default AddCategory;
