import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect } from "react-router-dom";
import { Button, Alert, Container, Card, Form, Modal } from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import DataTable from "./DataTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const userTableStyles = {
  height: "650px",
};

function AddCoupon() {
  const [loadingMsg, setLoadingMsg] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uidCoupon, setUIDCoupon] = useState("");
  const columns = [
    { field: "key", headerName: "UID", width: 250 },
    { field: "coupon", headerName: "Coupon", width: 200 },
    {
      field: "expireddate",
      headerName: "Expired Date",
      width: 150,
      sortable: false,
    },
    { field: "type", headerName: "Discount Type", width: 150 },
    { field: "value", headerName: "Discount Value", width: 150 },
    { field: "minimum", headerName: "Minimum Total", width: 150 },
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
                // handleRemoveButton(cellValues.id);
                setUIDCoupon(cellValues.id);
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
  // const [coupon, setCoupon] = useState("");
  const couponRef = useRef();
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiredDate, setExpiredDate] = useState(new Date());
  const [dateState, setDateState] = useState(false);
  const [type, setType] = useState(true); //fixed = true, percent = false
  const fixedRef = useRef();
  const percentRef = useRef();
  const [percent, setPercent] = useState(1);
  const [gName, setgName] = useState("");
  const minimumRef = useRef();
  const [minimum, setMinimum] = useState(0);
  const [minState, setMinState] = useState(false);

  // useEffect(() => {
  //   const getCouponFromFirebase = [];
  //   const subscriber = fs.collection("coupon").onSnapshot((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       getCouponFromFirebase.push({ ...doc.data(), key: doc.id });
  //     });
  //     setCoupon(getCouponFromFirebase);
  //     setLoading(false);
  //   });
  //   console.log(getCouponFromFirebase);
  //   return () => subscriber();
  // }, []);

  function GetCouponFromFirebase() {
    const getCouponFromFirebase = [];
    const [coupon, setCoupon] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("coupon").get();
      snapshot.docs.map((doc) => {
        getCouponFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCoupon(getCouponFromFirebase);
      setLoading(false);
    }, []);
    return coupon;
  }

  const coupon = GetCouponFromFirebase();

  function handleAddCoupon(e) {
    e.preventDefault();
    try {
      setLoadingMsg("Loading...");
      window.scrollTo(0, 0);
      setMessage("");
      setError("");
      setLoading(true);

      let expired = "";

      if (dateState == false) {
        expired = "-";
      } else {
        expired = expiredDate.toLocaleDateString();
      }

      let couponType = "";
      let value = 0;

      if (type == true) {
        couponType = "fixed";
        value = Number(fixedRef.current.value);
      } else {
        couponType = "percent";
        value = percent;
      }

      let min = "";

      if (minState == false) {
        min = "-";
      } else {
        min = Number(minimumRef.current.value);
      }

      fs.collection("coupon")
        .add({
          coupon: couponRef.current.value,
          expireddate: expired,
          type: couponType,
          value: value,
          minimum: min,
        })
        .then(() => {
          setMessage("Add Coupon Successful");
          setLoadingMsg("");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch((error) => {
          setError("Failed to add Coupon");
        });
    } catch (error) {
      setError("Failed to add Coupon");
    }
    setLoading(false);
  }

  function handleRemoveButton() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      fs.collection("coupon")
        .doc(uidCoupon)
        .delete()
        .then(() => {
          handleClose();
          setMessage("Remove Coupon Successful");
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        })
        .catch(() => {
          setError("Failed to remove coupon");
        });
    } catch {
      setError("Failed to remove coupon");
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

  function handleDateChange(event) {
    if (event.target.value == "yes") {
      setDateState(true);
    } else if (event.target.value == "no") {
      setDateState(false);
    }
  }

  function handleTypeChange(event) {
    //fixed = true, percent = false
    if (event.target.value == "fixed") {
      setType(true);
    } else if (event.target.value == "percent") {
      setType(false);
    }
  }

  function handlePercentChange(event) {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setPercent(value);
  }

  function generateName() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setgName(result);
  }

  function handleMinimumChange(event) {
    if (event.target.value == "yes") {
      setMinState(true);
    } else if (event.target.value == "no") {
      setMinState(false);
    }
  }

  function handleNameChange(event) {
    event.preventDefault();
    setgName(event.target.value);
  }

  if (coupon) {
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
                maxWidth: "1200px",
                margin: "auto",
                marginTop: "50px",
                backgroundColor: "#FFFF",
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
                rows={coupon}
                columns={columns}
                loading={!coupon.length}
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
            <Container
              className="d-flex justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <div className="w-100 my-5" style={{ maxWidth: "400px" }}>
                <Card>
                  <Card.Body>
                    <h2 className="text-center mb-4 align-items-center justify-content-center ">
                      Add Voucher
                    </h2>
                    {/* {error && <Alert variant="danger">{error}</Alert>}
                  {message && <Alert variant="success">{message}</Alert>} */}
                    {sendEmail ? null : (
                      <Form onSubmit={handleAddCoupon}>
                        <Form.Group id="uid" className="mb-3">
                          <FormLabel>Coupon</FormLabel>
                          <Form.Control
                            type="text"
                            ref={couponRef}
                            value={gName}
                            defaultValue={""}
                            required
                            onChange={handleNameChange}
                          />
                          <div className="text-center">
                            <Button
                              className="w-50"
                              style={{
                                marginBottom: "10px",
                                marginTop: "10px",
                              }}
                              onClick={generateName}
                            >
                              Generate Voucher
                            </Button>
                          </div>
                          <div>
                            <FormControl>
                              <FormLabel>Expired Date?</FormLabel>
                              <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                defaultValue="no"
                                onChange={handleDateChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                            {dateState ? (
                              <DatePicker
                                selected={expiredDate}
                                onChange={(date) => [
                                  setExpiredDate(date),
                                  console.log(date.toLocaleDateString()),
                                ]}
                              />
                            ) : null}
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <FormControl>
                              <FormLabel>Discount Type?</FormLabel>
                              <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                defaultValue="fixed"
                                onChange={handleTypeChange}
                              >
                                <FormControlLabel
                                  value="fixed"
                                  control={<Radio />}
                                  label="Fixed"
                                />
                                <FormControlLabel
                                  value="percent"
                                  control={<Radio />}
                                  label="Percent"
                                />
                              </RadioGroup>
                            </FormControl>
                            {type ? (
                              <div>
                                <FormLabel>Fixed Discount Number</FormLabel>
                                <Form.Control
                                  type="number"
                                  ref={fixedRef}
                                  required
                                />
                              </div>
                            ) : (
                              <div>
                                <FormLabel>
                                  Percent Discount Number 1-100
                                </FormLabel>
                                <Form.Control
                                  type="number"
                                  value={percent}
                                  onChange={handlePercentChange}
                                  required
                                  min={1}
                                  max={100}
                                  defaultValue={1}
                                />
                              </div>
                            )}
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <FormControl>
                              <FormLabel>
                                Minimum Total To Use Voucher?
                              </FormLabel>
                              <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                defaultValue="no"
                                onChange={handleMinimumChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                            {minState ? (
                              <div>
                                <FormLabel>Minimum number</FormLabel>
                                <Form.Control
                                  type="number"
                                  ref={minimumRef}
                                  required
                                />
                              </div>
                            ) : null}
                          </div>
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
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
  return null;
}

export default AddCoupon;
