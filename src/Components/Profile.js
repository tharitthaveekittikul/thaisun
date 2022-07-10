import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Container, Alert } from "react-bootstrap";
import { auth, fs } from "../Config/Config";
import { useHistory } from "react-router-dom";
import Navbar1 from "./Navbar1";
import { useMediaQuery } from "react-responsive";

function Profile() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const townRef = useRef();
  const countyRef = useRef();
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
  const [town, setTown] = useState("");
  const [county, setCounty] = useState("");
  const yourProfileQuery = useMediaQuery({ query: "(min-width: 600px)" });

  const history = useHistory();

  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

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
            // console.log(user);
            // console.log(user.uid);
            setUser(snapshot.data().FirstName);
            setFirstName(snapshot.data().FirstName);
            setLastName(snapshot.data().LastName);
            setEmail(snapshot.data().Email);
            setAddress(snapshot.data().Address);
            setTown(snapshot.data().Town);
            setCounty(snapshot.data().County);
            setPostCode(snapshot.data().PostCode);
            setTel(snapshot.data().Telephone);
            setIsAdmin(snapshot.data().isAdmin);
          });
      } else {
        history.push("/login");
      }
    });
  }, []);

  async function handleUpdate(e) {
    if (
      firstNameRef.current.value === "" ||
      lastNameRef.current.value === "" ||
      addressRef.current.value === "" ||
      townRef.current.value === "" ||
      countyRef.current.value === "" ||
      postCodeRef.current.value === "" ||
      telRef.current.value === ""
    ) {
      setError("Please fill the empty.");
      return;
    }
    e.preventDefault();
    setMessage("");
    setError("");
    setLoadingMsg("Loading...");
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .update({
            FirstName: firstNameRef.current.value,
            LastName: lastNameRef.current.value,
            Address: addressRef.current.value,
            Town: townRef.current.value,
            County: countyRef.current.value,
            PostCode: postCodeRef.current.value,
            Telephone: telRef.current.value,
          })
          .then(() => {
            setLoadingMsg("");
            setMessage("Your profile has been updated.");
          });
      } else {
        setError("Cannot update your profile.");
      }
    });
  }

  return (
    <>
      <Navbar1 user={user} totalProducts={totalProducts} isAdmin={isAdmin} />
      {!yourProfileQuery ? (
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
            {message ? <Alert variant="success">{message}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
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
                      defaultValue={firstName}
                    />
                  </Form.Group>

                  <Form.Group id="lastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      ref={lastNameRef}
                      required
                      defaultValue={lastName}
                    />
                  </Form.Group>

                  <Form.Group id="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      required
                      defaultValue={email}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group id="address" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      ref={addressRef}
                      required
                      defaultValue={address}
                    />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Town / City</Form.Label>
                    <Form.Control
                      type="text"
                      ref={townRef}
                      required
                      defaultValue={town}
                    />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>County</Form.Label>
                    <Form.Control
                      type="text"
                      ref={countyRef}
                      required
                      defaultValue={county}
                    />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control
                      type="text"
                      ref={postCodeRef}
                      required
                      defaultValue={postCode}
                    />
                  </Form.Group>

                  <Form.Group id="tel" className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
                      type="tel"
                      ref={telRef}
                      required
                      defaultValue={tel}
                    />
                  </Form.Group>

                  <div className="queryProfilebtn">
                    <Button disabled={loading} className="w-100" type="submit">
                      Update
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      ) : (
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="w-100" style={{ maxWidth: "800px" }}>
            {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
            {message ? <Alert variant="success">{message}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
            <Card>
              <Card.Body>
                <div className="container-profile">
                  <h2 className="text-center mb-4">Profile</h2>

                  <Form className="in-profile">
                    <div className="leftside-profile">
                      <Form.Group id="firstName" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          ref={firstNameRef}
                          required
                          defaultValue={firstName}
                        />
                      </Form.Group>

                      <Form.Group id="lastName" className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          ref={lastNameRef}
                          required
                          defaultValue={lastName}
                        />
                      </Form.Group>

                      <Form.Group id="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          ref={emailRef}
                          required
                          defaultValue={email}
                          readOnly
                        />
                      </Form.Group>

                      <Form.Group id="address" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          ref={addressRef}
                          required
                          defaultValue={address}
                        />
                      </Form.Group>
                    </div>

                    <div className="rightside-profile">
                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control
                          type="text"
                          ref={townRef}
                          required
                          defaultValue={town}
                        />
                      </Form.Group>

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>County</Form.Label>
                        <Form.Control
                          type="text"
                          ref={countyRef}
                          required
                          defaultValue={county}
                        />
                      </Form.Group>

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                          type="text"
                          ref={postCodeRef}
                          required
                          defaultValue={postCode}
                        />
                      </Form.Group>

                      <Form.Group id="tel" className="mb-3">
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control
                          type="tel"
                          ref={telRef}
                          required
                          defaultValue={tel}
                        />
                      </Form.Group>
                    </div>
                  </Form>
                  <Button
                    disabled={loading}
                    className="w-100"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      )}
    </>
  );
}

export default Profile;
