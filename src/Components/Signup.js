import React, { useRef, useState } from "react";
import { Form, Card, Button, Container, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import { format } from "date-fns";
import { useMediaQuery } from "react-responsive";

function Signup() {
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const addressRef = useRef();
  const townRef = useRef();
  const countyRef = useRef();
  const postCodeRef = useRef();
  const telRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const signUpQuery = useMediaQuery({ query: "(min-width: 600px)" });

  const history = useHistory();

  if (isLogIn) {
    history.push("/");
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await auth
        .createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        )
        .then(async (credentials) => {
          console.log(credentials);
          await credentials.user.sendEmailVerification();
          fs.collection("users")
            .doc(credentials.user.uid)
            .set({
              FirstName: firstNameRef.current.value,
              LastName: lastNameRef.current.value,
              Email: emailRef.current.value,
              Address: addressRef.current.value,
              Town: townRef.current.value,
              County: countyRef.current.value,
              PostCode: postCodeRef.current.value,
              Telephone: telRef.current.value,
              isAdmin: false,
              Coupons: [],
              date: String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")),
            })
            .then(async () => {
              setSuccess(
                "Signup Successful. Check your email to verify account."
              );
              window.scrollTo(0, 0);
              await auth.signOut();
              setTimeout(() => {
                history.push("/login");
              }, 2000);
            });
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          window.scrollTo(0, 0);
        });
    } catch {
      setError("Failed to create an account");
    }
  }
  return (
    <>
      {!signUpQuery ? (
        <Container
          className="d-flex align-items-center justify-content-center mt-3 mb-3"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {success ? <Alert variant="success">{success}</Alert> : ""}
                {error ? <Alert variant="danger">{error}</Alert> : ""}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="firstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" ref={firstNameRef} required />
                  </Form.Group>

                  <Form.Group id="lastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" ref={lastNameRef} required />
                  </Form.Group>

                  <Form.Group id="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>

                  <Form.Group id="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>

                  <Form.Group id="password-confirm" className="mb-3">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      required
                    />
                  </Form.Group>

                  <Form.Group id="address" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" ref={addressRef} required />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Town / City</Form.Label>
                    <Form.Control type="text" ref={townRef} required />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>County</Form.Label>
                    <Form.Control type="text" ref={countyRef} required />
                  </Form.Group>

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control type="text" ref={postCodeRef} required />
                  </Form.Group>

                  <Form.Group id="tel" className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" ref={telRef} required />
                  </Form.Group>

                  <Button disabled={loading} className="w-100" type="submit">
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </div>
        </Container>
      ) : (
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "800px" }}>
            {success ? <Alert variant="success">{success}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
            <Card>
              <Card.Body>
                <div className="container-signup">
                  <h2 className="text-center mb-4">Sign Up</h2>

                  <Form onSubmit={handleSubmit} className="in-signup">
                    <div className="leftside-signup">
                      <Form.Group id="firstName" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" ref={firstNameRef} required />
                      </Form.Group>

                      <Form.Group id="lastName" className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" ref={lastNameRef} required />
                      </Form.Group>

                      <Form.Group id="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                      </Form.Group>

                      <Form.Group id="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          ref={passwordRef}
                          required
                        />
                      </Form.Group>

                      <Form.Group id="password-confirm" className="mb-3">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control
                          type="password"
                          ref={passwordConfirmRef}
                          required
                        />
                      </Form.Group>
                    </div>

                    <div className="rightside-signup">
                      <Form.Group id="address" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" ref={addressRef} required />
                      </Form.Group>

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Town / City</Form.Label>
                        <Form.Control type="text" ref={townRef} required />
                      </Form.Group>

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>County</Form.Label>
                        <Form.Control type="text" ref={countyRef} required />
                      </Form.Group>

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control type="text" ref={postCodeRef} required />
                      </Form.Group>

                      <Form.Group id="tel" className="mb-3">
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control type="tel" ref={telRef} required />
                      </Form.Group>
                    </div>
                  </Form>
                </div>
                <Button disabled={loading} className="w-100" type="submit">
                  Sign Up
                </Button>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

export default Signup;
