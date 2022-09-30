import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Container, Alert } from "react-bootstrap";
import { auth, fs } from "../Config/Config";
import { useHistory } from "react-router-dom";
import Navbar1 from "./Navbar1";
import { useMediaQuery } from "react-responsive";
import { validTel, formatPhoneNumber } from "./Regexvalidate";

function Profile() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const houseRef = useRef();
  const addressRef = useRef();
  const townRef = useRef();
  // const countyRef = useRef();
  const postCodeRef = useRef();
  const telRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [house, setHouse] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [tel, setTel] = useState("");
  const [town, setTown] = useState("");
  const [showOthers, setShowOthers] = useState(false);
  // const [county, setCounty] = useState("");
  const yourProfileQuery = useMediaQuery({ query: "(min-width: 600px)" });

  const history = useHistory();

  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const [townTemp, setTownTemp] = useState("");
  const [postCodeTemp, setPostCodeTemp] = useState("");

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  const defaultTown = [
    "Calvery",
    "Bramley",
    "Armley",
    "Rodley",
    "Horstforth",
    "Stanningley",
    "Pudsey",
  ];
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
            setHouse(snapshot.data().House);
            setAddress(snapshot.data().Address);
            setTown(snapshot.data().Town);
            setTownTemp(snapshot.data().Town);
            // setCounty(snapshot.data().County);
            setPostCode(snapshot.data().PostCode);
            let teleTemp = snapshot.data().Telephone;
            teleTemp = teleTemp.replaceAll(" ", "-");
            setTel(teleTemp);
            setIsAdmin(snapshot.data().isAdmin);
            if (!defaultTown.includes(snapshot.data().Town)) {
              setShowOthers(true);
              setTownTemp("others");
            }
          });
      } else {
        history.push("/login");
      }
    });
  }, []);

  function handleChangeTown(e) {
    setShowOthers(false);
    setTown(e.target.value);
    setTownTemp(e.target.value);
    if (e.target.value == "others") {
      setShowOthers(true);
      setTown("");
    }
  }

  function handleChangeTownOthers() {
    setTown(townRef.current.value);
  }

  function handleChangePostCode(e) {
    setPostCode(e.target.value);
  }

  function handleTelephone(e) {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setTel(formattedPhoneNumber);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      firstNameRef.current.value === "" ||
      lastNameRef.current.value === "" ||
      houseRef.current.value === "" ||
      addressRef.current.value === "" ||
      telRef.current.value === ""
    ) {
      setError("Please fill the empty.");
      return;
    }
    if (postCode === "") {
      return setError("Please select postcode.");
    }
    if (townTemp === "others") {
      if (townRef.current.value === "") {
        return setError("Please fill your town.");
      }
      setTown(townRef.current.value);
    }

    let tempTel;
    if (!validTel.test(telRef.current.value)) {
      setLoadingMsg("");
      return setError("Telephone number should be 0xxxx-xxx-xxx");
    } else if (validTel.test(telRef.current.value)) {
      tempTel = telRef.current.value;
      tempTel = tempTel.replaceAll("-", " ");
    }
    setLoadingMsg("Loading...");
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .update({
            FirstName: firstNameRef.current.value,
            LastName: lastNameRef.current.value,
            House: houseRef.current.value,
            Address: addressRef.current.value,
            Town: town,
            // County: countyRef.current.value,
            PostCode: postCodeRef.current.value,
            Telephone: tempTel,
          })
          .then(() => {
            setLoadingMsg("");
            setMessage("Your profile has been updated.");
          });
      } else {
        setError("Cannot update your profile.");
        setLoadingMsg("");
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

                  <Form.Group id="house" className="mb-3">
                    <Form.Label>
                      House Number/ Flat Number / House Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={houseRef}
                      required
                      defaultValue={house}
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

                  <Form.Group id="town" className="mb-3">
                    <Form.Label>Town / City</Form.Label>
                    {/* <Form.Control
                      type="text"
                      ref={townRef}
                      required
                      defaultValue={town}
                    /> */}
                    <select
                      className="form-control"
                      required
                      onChange={(e) => {
                        handleChangeTown(e);
                      }}
                      value={townTemp}
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
                      <Form.Label>Others Town</Form.Label>
                      <Form.Control
                        type="text"
                        ref={townRef}
                        required
                        defaultValue={town}
                        onChange={() => {
                          handleChangeTownOthers();
                        }}
                      />
                    </Form.Group>
                  ) : (
                    <></>
                  )}

                  {/* <Form.Group id="postCode" className="mb-3">
                    <Form.Label>County</Form.Label>
                    <Form.Control
                      type="text"
                      ref={countyRef}
                      required
                      defaultValue={county}
                    />
                  </Form.Group> */}

                  <Form.Group id="postCode" className="mb-3">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control
                      type="text"
                      ref={postCodeRef}
                      required
                      defaultValue={postCode}
                    />
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

                      <Form.Group id="house" className="mb-3">
                        <Form.Label>
                          House Number/ Flat Number / House Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          ref={houseRef}
                          required
                          defaultValue={house}
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
                      <Form.Group id="town" className="mb-3">
                        <Form.Label>Town / City</Form.Label>
                        {/* <Form.Control
                          type="text"
                          ref={townRef}
                          required
                          defaultValue={town}
                        /> */}
                        <select
                          className="form-control"
                          required
                          onChange={(e) => {
                            handleChangeTown(e);
                          }}
                          value={townTemp}
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
                          <Form.Label>Others Town</Form.Label>
                          <Form.Control
                            type="text"
                            ref={townRef}
                            required
                            defaultValue={town}
                            onChange={() => {
                              handleChangeTownOthers();
                            }}
                          />
                        </Form.Group>
                      ) : (
                        <></>
                      )}

                      {/* <Form.Group id="postCode" className="mb-3">
                        <Form.Label>County</Form.Label>
                        <Form.Control
                          type="text"
                          ref={countyRef}
                          required
                          defaultValue={county}
                        />
                      </Form.Group> */}

                      <Form.Group id="postCode" className="mb-3">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                          type="text"
                          ref={postCodeRef}
                          required
                          defaultValue={postCode}
                        />
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
                          required
                          defaultValue={tel}
                          value={tel}
                          onChange={(e) => handleTelephone(e)}
                          maxLength={13}
                        />
                      </Form.Group>

                      <Button
                        style={{ marginTop: "32px" }}
                        disabled={loading}
                        className="w-100"
                        onClick={handleUpdate}
                      >
                        Update
                      </Button>
                    </div>
                  </Form>
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
