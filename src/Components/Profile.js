import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Container } from "react-bootstrap";
import { auth, fs } from "../Config/Config";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
function Profile() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const postCodeRef = useRef();
  const telRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [tel, setTel] = useState("");

  const history = useHistory();

  const [user, setUser] = useState(null);

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            console.log(user);
            console.log(user.uid);
            setUser(snapshot.data().FirstName);
            setFirstName(snapshot.data().FirstName);
            setLastName(snapshot.data().LastName);
            setEmail(snapshot.data().Email);
            setAddress(snapshot.data().Address);
            setPostCode(snapshot.data().PostCode);
            setTel(snapshot.data().Telephone);
            setIsAdmin(snapshot.data().isAdmin);
          });
      } else {
        history.push("/login");
      }
    });
  }, []);

  async function handleUpdate() {}

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              <Form onSubmit={handleUpdate}>
                <Form.Group id="firstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={firstNameRef}
                    required
                    value={firstName}
                  />
                </Form.Group>

                <Form.Group id="lastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={lastNameRef}
                    required
                    value={lastName}
                  />
                </Form.Group>

                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    value={email}
                    readOnly
                  />
                </Form.Group>

                <Form.Group id="address" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    ref={addressRef}
                    required
                    value={address}
                  />
                </Form.Group>

                <Form.Group id="postCode" className="mb-3">
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control
                    type="text"
                    ref={postCodeRef}
                    required
                    value={postCode}
                  />
                </Form.Group>

                <Form.Group id="tel" className="mb-3">
                  <Form.Label>Telephone</Form.Label>
                  <Form.Control type="tel" ref={telRef} required value={tel} />
                </Form.Group>

                <Button disabled={loading} className="w-100" type="submit">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default Profile;
