import React, { useRef, useState } from "react";
import { Form, Card, Button, Container, Alert } from "react-bootstrap";
import { auth } from "../Config/Config";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  if (isLogIn) {
    history.push("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      await auth
        .signInWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        )
        .then(async (currentUser) => {
          //   console.log(currentUser);
          if (!currentUser.user.emailVerified) {
            setError("Please check your email to verify.");
            await auth.signOut();
          } else {
            setSuccess("Log In Successfull.");

            localStorage.setItem("isLogIn", "True");
            history.push("/");
          }
        })
        .catch((error) => setError(error.message));
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {success ? <Alert variant="success">{success}</Alert> : ""}
            {error ? <Alert variant="danger">{error}</Alert> : ""}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <div className="queryProfilebtn">
                <Button
                  variant="danger"
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                  Log In
                </Button>
              </div>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link style={{ color: "#e80532" }} to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account?{" "}
          <Link style={{ color: "#e80532" }} to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default Login;
