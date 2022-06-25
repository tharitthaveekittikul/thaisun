import React, { useEffect, useState, useRef } from "react";
import { auth, fs } from "../../Config/Config";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DataTable from "./DataTable";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const userTableStyles = {
  height: "650px",
};

function ManageAdmin() {
  const columns = [
    { field: "key", headerName: "UID", width: 300 },
    { field: "date", headerName: "Date", width: 250 },
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
  const [users, setUsers] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const [uid, setUid] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const AuidRef = useRef();
  const RuidRef = useRef();

  useEffect(() => {
    const getUserFormFirebase = [];
    const subscriber = fs.collection("users").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getUserFormFirebase.push({ ...doc.data(), key: doc.id });
      });
      setUsers(getUserFormFirebase);
      setLoading(false);
    });
    return () => subscriber();
  }, []);

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

      fs.collection("users")
        .doc(uid)
        .update({
          isAdmin: true,
        })
        .then(() => {
          setMessage("Add Admin Successful");
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

  async function handleAddAdmin(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("users")
        .doc(AuidRef.current.value)
        .update({
          isAdmin: true,
        })
        .then(() => {
          setMessage("Add Admin Successful");
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
  async function handleRemoveButton(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("users")
        .doc(uid)
        .update({
          isAdmin: false,
        })
        .then(() => {
          setMessage("Remove Admin Successful");
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
  async function handleRemoveAdmin(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("users")
        .doc(RuidRef.current.value)
        .update({
          isAdmin: false,
        })
        .then(() => {
          setMessage("Remove Admin Successful");
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
          rows={users}
          columns={columns}
          loading={!users.length}
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
                Add Admin
              </h2>
              {/* {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>} */}
              {sendEmail ? null : (
                <Form onSubmit={handleAddAdmin}>
                  <Form.Group id="uid" className="mb-3">
                    <Form.Label>UID</Form.Label>
                    <Form.Control type="text" ref={AuidRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100" type="submit">
                    Add
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="d-flex mx-5 my-5" style={{ height: "300px" }}>
          <div className="vr"></div>
        </div>
        <div className="w-100 my-5" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4 align-items-center justify-content-center ">
                Remove Admin
              </h2>
              {/* {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>} */}
              {sendEmail ? null : (
                <Form onSubmit={handleRemoveAdmin}>
                  <Form.Group id="uid" className="mb-3">
                    <Form.Label>UID</Form.Label>
                    <Form.Control type="text" ref={RuidRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100" type="submit">
                    Remove
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

export default ManageAdmin;
