import React, { useEffect, useState, useRef } from "react";
import { auth, fs } from "../../Config/Config";
import { Button, Alert, Container, Card, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";

function AddAdmin() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const [uid, setUid] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const uidRef = useRef();

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

  async function handleAddAdmin(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("users")
        .doc(uidRef.current.value)
        .update({
          isAdmin: true,
        })
        .then(() => {
          setMessage("Add Admin Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch(() => {
          setError("Failed to add Admin");
        });
    } catch {
      setError("Failed to add Admin");
    }
    setLoading(false);
  }

  // Note user.key = uid
  return (
    <>
      <div>All User</div>
      {message ? <Alert variant="success">{message}</Alert> : ""}
      {error ? <Alert variant="danger">{error}</Alert> : ""}
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Add Admin</h2>
              {/* {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>} */}
              {sendEmail ? null : (
                <Form onSubmit={handleAddAdmin}>
                  <Form.Group id="uid" className="mb-3">
                    <Form.Label>UID</Form.Label>
                    <Form.Control type="text" ref={uidRef} required />
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
      {users.length > 0 ? (
        users.map((user) => (
          <>
            <div key={user.key}>
              Name = {user.FirstName} {user.LastName}, <br /> Uid = {user.key}
              ,
              <br />
              Email = {user.Email}, <br />
              isAdmin = {user.isAdmin.toString()}
            </div>

            <hr />
          </>
        ))
      ) : (
        <div> No User </div>
      )}
    </>
  );
}

export default AddAdmin;
