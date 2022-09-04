import React, { useRef, useState } from "react";
import { Form, Card, Button, Container, Alert, Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import { format } from "date-fns";
import { useMediaQuery } from "react-responsive";
import { validTel, formatPhoneNumber } from "./Regexvalidate";

function Signup() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const houseRef = useRef();
  const addressRef = useRef();
  const townRef = useRef();
  // const countyRef = useRef();
  const postCodeRef = useRef();
  const telRef = useRef();
  const telConfirmRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const signUpQuery = useMediaQuery({ query: "(min-width: 600px)" });
  // const [postCode, setPostCode] = useState("");
  const [town, setTown] = useState("");
  const history = useHistory();
  const [showOthers, setShowOthers] = useState(false);
  const [tel, setTel] = useState("");
  const [telComfirm, setTelComfirm] = useState("");

  if (isLogIn) {
    history.push("/");
  }

  function handleChangeTown(e) {
    setShowOthers(false);
    setTown(e.target.value);
    if (e.target.value == "others") {
      setShowOthers(true);
    }
  }

  // function handleChangePostCode(e) {
  //   setPostCode(e.target.value);
  // }

  function handleTelephone(e) {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setTel(formattedPhoneNumber);
  }

  function handleTelephoneConfirm(e) {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setTelComfirm(formattedPhoneNumber);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let tempTel;

    if (firstNameRef.current.value === "") {
      return setError("Please fill your first name.");
    } else if (lastNameRef.current.value === "") {
      return setError("Please fill your last name.");
    } else if (emailRef.current.value === "") {
      return setError("Please fill your email address.");
    } else if (passwordRef.current.value === "") {
      return setError("Please fill your password.");
    } else if (passwordConfirmRef.current.value === "") {
      return setError("Please fill your password confirmation.");
    } else if (houseRef.current.value === "") {
      return setError(
        "Please fill your house number / flat number / house name."
      );
    } else if (addressRef.current.value === "") {
      return setError("Please fill your address.");
    } else if (telRef.current.value === "") {
      return setError("Please fill your telephone number.");
    } else if (postCodeRef.current.value === "") {
      return setError("Please fill your postcode.");
    } else if (telConfirmRef.current.value === "") {
      return setError("Please fill your telephone number confirmation.");
    }

    if (town === "others") {
      if (townRef.current.value === "") {
        return setError("Please fill your town.");
      }
      setTown(townRef.current.value);
    }

    if (!validTel.test(telRef.current.value)) {
      // console.log(telRef.current.value);
      return setError("Telephone number should be 0xxxx-xxx-xxx");
    } else if (validTel.test(telRef.current.value)) {
      // console.log(telRef.current.value);
      tempTel = telRef.current.value;
      tempTel = tempTel.replaceAll("-", " ");
      // console.log(tempTel);
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }
    if (telRef.current.value !== telConfirmRef.current.value) {
      return setError("Telephone number do not match.");
    }
    if (town === "") {
      return setError("Please select town.");
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
          // console.log(credentials);
          await credentials.user.sendEmailVerification();
          fs.collection("users")
            .doc(credentials.user.uid)
            .set({
              FirstName: firstNameRef.current.value,
              LastName: lastNameRef.current.value,
              Email: emailRef.current.value,
              House: houseRef.current.value,
              Address: addressRef.current.value,
              Town: town,
              PostCode: postCodeRef.current.value,
              Telephone: tempTel,
              isAdmin: false,
              Coupons: [],
              date: String(format(new Date(), "LLLL dd, yyyy kk:mm:ss")),
            })
            .then(async () => {
              setSuccess(
                "Signup successful. Check your email to verify account."
              );
              handleShow();
              window.scrollTo(0, 0);
              await auth.signOut();
              // setTimeout(() => {
              //   history.push("/login");
              // }, 2000);
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
  const handleLogin = () => history.push("/login");
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

                  <Form.Group id="house" className="mb-3">
                    <Form.Label>
                      House Number/ Flat Number / House Name
                    </Form.Label>
                    <Form.Control type="text" ref={houseRef} required />
                  </Form.Group>

                  <Form.Group id="address" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" ref={addressRef} required />
                  </Form.Group>

                  <Form.Group id="town" className="mb-3">
                    <Form.Label>Town / City</Form.Label>
                    <select
                      className="form-control"
                      required
                      onChange={(e) => {
                        handleChangeTown(e);
                      }}
                      defaultValue={town}
                      style={{ marginBottom: "10px" }}
                    >
                      <option value="" disabled={true}>
                        Select Town
                      </option>
                      <option value="Calvery">Calvery</option>
                      <option value="Bramley">Bramley</option>
                      <option value="Armley">Armley</option>
                      <option value="Rodley">Rodley</option>
                      <option value="Horstforth">Horstforth</option>
                      <option value="Stanningley">Stanningley</option>
                      <option value="Pudsey">Pudsey</option>
                      <option value="others">Others Town</option>
                    </select>
                  </Form.Group>
                  {showOthers ? (
                    <Form.Group id="town-ref" className="mb-3">
                      <Form.Label>Other Town</Form.Label>
                      <Form.Control type="text" ref={townRef} required />
                    </Form.Group>
                  ) : (
                    <></>
                  )}

                  {/* <Form.Group id="county" className="mb-3">
                    <Form.Label>County</Form.Label>
                    <Form.Control type="text" ref={countyRef} required />
                  </Form.Group> */}

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control type="text" ref={postCodeRef} required />
                    {/* <select
                      className="form-control"
                      required
                      onChange={(e) => {
                        handleChangePostCode(e);
                      }}
                      defaultValue={postCode}
                      style={{ marginBottom: "10px" }}
                    >
                      <option value="" disabled={true}>
                        Select Postcode
                      </option>
                      <option value="LS12">LS12</option>
                      <option value="LS13">LS13</option>
                      <option value="LS18">LS18</option>
                      <option value="LS28">LS28</option>
                    </select> */}
                  </Form.Group>

                  <Form.Group id="tel" className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
                      type="tel"
                      ref={telRef}
                      onChange={(e) => handleTelephone(e)}
                      value={tel}
                      required
                      maxLength={13}
                    />
                  </Form.Group>

                  <Form.Group id="tel-confirm" className="mb-3">
                    <Form.Label>Telephone Confirmation</Form.Label>
                    <Form.Control
                      type="tel"
                      ref={telConfirmRef}
                      required
                      maxLength={13}
                      onChange={(e) => handleTelephoneConfirm(e)}
                      value={telComfirm}
                    />
                  </Form.Group>

                  <div className="queryProfilebtn">
                    <Button
                      variant="danger"
                      disabled={loading}
                      className="w-100"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Already have an account?{" "}
              <Link style={{ color: "#e80532" }} to="/login">
                Log In
              </Link>
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

                  <Form className="in-signup">
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

                      <Form.Group id="house" className="mb-3">
                        <Form.Label>
                          House Number/ Flat Number / House Name
                        </Form.Label>
                        <Form.Control type="text" ref={houseRef} required />
                      </Form.Group>
                    </div>

                    <div className="rightside-signup">
                      <Form.Group id="address" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" ref={addressRef} required />
                      </Form.Group>

                      <Form.Group id="town" className="mb-3">
                        <Form.Label>Town / City</Form.Label>
                        <select
                          className="form-control"
                          required
                          onChange={(e) => {
                            handleChangeTown(e);
                          }}
                          defaultValue={town}
                          style={{ marginBottom: "10px" }}
                        >
                          <option value="" disabled={true}>
                            Select Town
                          </option>
                          <option value="Calvery">Calvery</option>
                          <option value="Bramley">Bramley</option>
                          <option value="Armley">Armley</option>
                          <option value="Rodley">Rodley</option>
                          <option value="Horstforth">Horstforth</option>
                          <option value="Stanningley">Stanningley</option>
                          <option value="Pudsey">Pudsey</option>
                          <option value="others">Other Town</option>
                        </select>
                      </Form.Group>

                      {showOthers ? (
                        <Form.Group id="town-ref" className="mb-3">
                          <Form.Label>Other Town</Form.Label>
                          <Form.Control type="text" ref={townRef} required />
                        </Form.Group>
                      ) : (
                        <></>
                      )}

                      {/* <Form.Group id="county" className="mb-3">
                        <Form.Label>County</Form.Label>
                        <Form.Control type="text" ref={countyRef} required />
                      </Form.Group> */}

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control type="text" ref={postCodeRef} required />
                        {/* <select
                          className="form-control"
                          required
                          onChange={(e) => {
                            handleChangePostCode(e);
                          }}
                          defaultValue={postCode}
                          style={{ marginBottom: "10px" }}
                        >
                          <option value="" disabled={true}>
                            Select Postcode
                          </option>
                          <option value="LS12">LS12</option>
                          <option value="LS13">LS13</option>
                          <option value="LS18">LS18</option>
                          <option value="LS28">LS28</option>
                        </select> */}
                      </Form.Group>

                      <Form.Group id="tel" className="mb-3">
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control
                          type="text"
                          ref={telRef}
                          required
                          onChange={(e) => handleTelephone(e)}
                          value={tel}
                          title="Telephone number should be 0xxxx-xxx-xxx"
                          maxLength={13}
                          pattern="^\s*(([+]\s?\d[-\s]?\d|0)?\s?\d([-\s]?\d){9}|[(]\s?\d([-\s]?\d)+\s*[)]([-\s]?\d)+)\s*$"
                        />
                      </Form.Group>

                      <Form.Group id="tel-confirm" className="mb-3">
                        <Form.Label>Telephone Confirmation</Form.Label>
                        <Form.Control
                          type="tel"
                          ref={telConfirmRef}
                          required
                          maxLength={13}
                          onChange={(e) => handleTelephoneConfirm(e)}
                          value={telComfirm}
                        />
                      </Form.Group>
                    </div>
                  </Form>
                  <div
                    className="queryProfilebtn"
                    // style={{
                    //   marginTop: "48px",
                    // }}
                  >
                    <Button
                      variant="danger"
                      disabled={loading}
                      className="w-100"
                      onClick={handleSubmit}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Already have an account?{" "}
              <Link style={{ color: "#e80532" }} to="/login">
                Log In
              </Link>
            </div>
          </div>
        </Container>
      )}
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Thank you for sign up with Thai Sun. Unfortunately your account can
            order collection only or please contact restaurant 01133-187-268.
          </div>
          <br></br>
          <div>Please check your email to verify this account.</div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 text-center mt-2">
            Go back to{" "}
            <Link style={{ color: "#e80532" }} to="/login">
              Login
            </Link>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Signup;
