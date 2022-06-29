import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { Redirect, useHistory } from "react-router-dom";
import {
  Button,
  Alert,
  Container,
  Card,
  Form,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { auth, fs } from "../../Config/Config";
import sound from "../../sound/new_order.mp3";
import axios from "axios";

function LiveOrder() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";

  const [liveOrders, setLiveOrders] = useState();
  const history = useHistory();

  const [showSure, setShowSure] = useState(false);
  const handleCloseSure = () => setShowSure(false);
  const handleShowSure = () => {
    console.log(orderTemp);
    setShowSure(true);
  };

  const [showReason, setShowReason] = useState(false);
  const handleCloseReason = () => setShowReason(false);
  const [orderTemp, setOrderTemp] = useState();

  const [reason, setReason] = useState("");
  const [etc, setETC] = useState("");

  const [send, setSent] = useState(false);
  // const [text, setText] = useState("");
  const [playAudio, setPlayAudio] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const handleSend = async (text, email) => {
    setSent(true);
    try {
      await axios.post("http://localhost:587/send_mail", {
        text,
        emailTo: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  function handleChangeReason(e) {
    if (e.target.value === "" || e.target.value === "etc.") {
      setDisableButton(true);
    }
    console.log(e.target.value);
    setDisableButton(false);
    setReason(e.target.value);
    setPlayAudio(false);
  }

  function handleETCReason(e) {
    setDisableButton(false);
    setPlayAudio(false);
    setETC(e.target.value);
  }
  const handleShowReason = (liveorder, key) => {
    setOrderTemp([liveorder, key]);
    setShowReason(true);
    setPlayAudio(false);
  };

  useEffect(() => {
    const getLiveOrderFromFirebase = [];
    const subscriber = fs
      .collection("liveorder")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getLiveOrderFromFirebase.push({ ...doc.data(), key: doc.id });
        });
        setLiveOrders(getLiveOrderFromFirebase);
        setPlayAudio(true);
      });
    return () => subscriber();
  }, []);

  function handleAccept(liveorder, key) {
    // if (liveorder.pickupState) {
    //   setText("The menu takes at least 25 minutes.");
    // } else {
    //   setText("The menu takes at least 60 minutes.");
    // }
    // console.log("click");
    let detailsOrder = `<table
    class="es-content"
    cellspacing="0"
    cellpadding="0"
    align="center"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
      table-layout: fixed !important;
      width: 100%;
    "
  >
    <tr style="border-collapse: collapse">
      <td align="center" style="padding: 0; margin: 0">
        <table
          class="es-content-body"
          cellspacing="0"
          cellpadding="0"
          bgcolor="#ffffff"
          align="center"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
            background-color: #ffffff;
            width: 600px;
          "
        >
          <tr style="border-collapse: collapse">
            <td
              align="left"
              style="
                margin: 0;
                padding-top: 20px;
                padding-left: 20px;
                padding-right: 20px;
                padding-bottom: 30px;
              "
            >
              <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:280px" valign="top"><![endif]-->
              <table
                class="es-left"
                cellspacing="0"
                cellpadding="0"
                align="left"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  float: left;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    class="es-m-p20b"
                    align="left"
                    style="padding: 0; margin: 0; width: 280px"
                  >
                    <table
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: separate;
                        border-spacing: 0px;
                        background-color: #fef9ef;
                        border-color: #efefef;
                        border-width: 1px 0px 1px 1px;
                        border-style: solid;
                      "
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#fef9ef"
                      role="presentation"
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-bottom: 10px;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <h4
                            style="
                              margin: 0;
                              line-height: 120%;
                              mso-line-height-rule: exactly;
                              font-family: 'trebuchet ms', helvetica,
                                sans-serif;
                            "
                          >
                            SUMMARY:
                          </h4>
                        </td>
                      </tr>
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-bottom: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <table
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                              width: 100%;
                            "
                            class="cke_show_border"
                            cellspacing="1"
                            cellpadding="1"
                            border="0"
                            align="left"
                            role="presentation"
                          >
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order #:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >${liveorder.orderNo}</span
                                >
                              </td>
                            </tr>
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order Date:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >${liveorder.date}</span
                                >
                              </td>
                            </tr>
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order Total:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >£ ${liveorder.Total}</span
                                >
                              </td>
                            </tr>
                          </table>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            <br />
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if mso]></td><td style="width:0px"></td><td style="width:280px" valign="top"><![endif]-->
              <table
                class="es-right"
                cellspacing="0"
                cellpadding="0"
                align="right"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  float: right;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    align="left"
                    style="padding: 0; margin: 0; width: 280px"
                  >
                    <table
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: separate;
                        border-spacing: 0px;
                        background-color: #fef9ef;
                        border-width: 1px;
                        border-style: solid;
                        border-color: #efefef;
                      "
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#fef9ef"
                      role="presentation"
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-bottom: 10px;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <h4
                            style="
                              margin: 0;
                              line-height: 120%;
                              mso-line-height-rule: exactly;
                              font-family: 'trebuchet ms', helvetica,
                                sans-serif;
                            "
                          >
                            SHIPPING ADDRESS:<br />
                          </h4>
                        </td>
                      </tr>
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-bottom: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${liveorder.user}
                          </p>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${liveorder.address}
                          </p>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${liveorder.postCode}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <table
              class="es-content"
              cellspacing="0"
              cellpadding="0"
              align="center"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                table-layout: fixed !important;
                width: 100%;
              "
            >
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    class="es-content-body"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    "
                  ><tr style="border-collapse: collapse">
                  <td
                    align="left"
                    style="
                      margin: 0;
                      padding-top: 10px;
                      padding-bottom: 10px;
                      padding-left: 20px;
                      padding-right: 20px;
                    "
                  >
                    <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                    <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame" width="270" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20l" align="left">
                                                                                        <h4>ITEMS ORDERED</h4>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                    <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      align="right"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                      "
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="padding: 0; margin: 0; width: 270px"
                        >
                          <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            role="presentation"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr style="border-collapse: collapse">
                              <td
                                align="left"
                                style="padding: 0; margin: 0"
                              >
                                <table
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    width: 100%;
                                  "
                                  class="cke_show_border"
                                  cellspacing="1"
                                  cellpadding="1"
                                  border="0"
                                  role="presentation"
                                >
                                  <tr style="border-collapse: collapse">
                                    <td style="padding: 0; margin: 0">
                                      <span style="font-size: 13px"
                                        ></span
                                      >
                                    </td>
                                    <td
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        width: 60px;
                                        text-align: center;
                                      "
                                    >
                                      <span style="font-size: 13px"
                                        ><span style="line-height: 100%"
                                          >QTY</span
                                        ></span
                                      >
                                    </td>
                                    <td
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        width: 100px;
                                        text-align: center;
                                      "
                                    >
                                      <span style="font-size: 13px"
                                        ><span style="line-height: 100%"
                                          >PRICE</span
                                        ></span
                                      >
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!--[if mso]></td></tr></table><![endif]-->
                  </td>
                </tr> `;
    for (let i = 0; i < liveorder.cartProducts.length; i++) {
      detailsOrder =
        `${detailsOrder}` +
        `<tr style="border-collapse: collapse">
        <td
          align="left"
          style="
            padding: 0;
            margin: 0;
            padding-left: 20px;
            padding-right: 20px;
          "
        >
          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
            "
          >
            <tr style="border-collapse: collapse">
              <td
                valign="top"
                align="center"
                style="padding: 0; margin: 0; width: 560px"
              >
                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="center"
                      style="
                        padding: 0;
                        margin: 0;
                        padding-bottom: 0px;
                        font-size: 0;
                      "
                    >
                      <table
                        width="100%"
                        height="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              border-bottom: 1px solid #efefef;
                              background: #ffffff none repeat
                                scroll 0% 0%;
                              height: 1px;
                              width: 100%;
                              margin: 0px;
                            "
                          ></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="border-collapse: collapse">
        <td
          align="left"
          style="
            margin: 0;
            padding-top: 5px;
            padding-bottom: 0;
            padding-left: 20px;
            padding-right: 20px;
          "
        >
          <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:178px" valign="top"><![endif]-->
          <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame" width="178" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-image" align="left"><strong>${
                                                                                      liveorder
                                                                                        .cartProducts[
                                                                                        i
                                                                                      ]
                                                                                        .title
                                                                                    }</strong></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
          <!--[if mso]></td><td style="width:20px"></td><td style="width:362px" valign="top"><![endif]-->
          <table
            cellspacing="0"
            cellpadding="0"
            align="right"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
            "
          >
            <tr style="border-collapse: collapse">
              <td
                align="left"
                style="padding: 0; margin: 0; width: 362px"
              >
                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="left"
                      style="padding: 0; margin: 0"
                    >
                      <p
                        style="
                          margin: 0;
                          -webkit-text-size-adjust: none;
                          -ms-text-size-adjust: none;
                          mso-line-height-rule: exactly;
                          font-family: arial, 'helvetica neue',
                            helvetica, sans-serif;
                          line-height: 21px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >
                      </p>
                      <table
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          width: 100%;
                        "
                        class="cke_show_border"
                        cellspacing="1"
                        cellpadding="1"
                        border="0"
                        role="presentation"
                      >
                        <tr style="border-collapse: collapse">
                          <td style="padding: 0; margin: 0; text-align: center" >
                          <strong>${""}</strong>
                          </td>
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              width: 60px;
                              text-align: center;
                            "
                          >
                            ${liveorder.cartProducts[i].qty}
                          </td>
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              width: 100px;
                              text-align: center;
                            "
                          >
                          £ ${liveorder.cartProducts[i].TotalProductPrice}
                          </td>
                        </tr>
                      </table>
                      <p
                        style="
                          margin: 0;
                          -webkit-text-size-adjust: none;
                          -ms-text-size-adjust: none;
                          mso-line-height-rule: exactly;
                          font-family: arial, 'helvetica neue',
                            helvetica, sans-serif;
                          line-height: 21px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >
                        <br />
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr><p style="text-align: left ; margin-top: 0px ; padding-left: 10px ; padding-top: 0">`;
      for (let j = 0; j < liveorder.cartProducts[i].option.length; j++) {
        detailsOrder =
          `${detailsOrder}` + `${liveorder.cartProducts[i].option[j].menu}, `;
      }

      for (let j = 0; j < liveorder.cartProducts[i].addOn.length; j++) {
        detailsOrder =
          `${detailsOrder}` + `${liveorder.cartProducts[i].addOn[j].menu}, `;
      }
      detailsOrder = detailsOrder + `</p>`;
    }
    detailsOrder =
      detailsOrder +
      `<tr style="border-collapse: collapse">
    <td
      align="left"
      style="
        margin: 0;
        padding-top: 5px;
        padding-left: 20px;
        padding-bottom: 30px;
        padding-right: 40px;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
        "
      >
        <tr style="border-collapse: collapse">
          <td
            valign="top"
            align="center"
            style="padding: 0; margin: 0; width: 540px"
          >
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              role="presentation"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
              "
            >
              <tr style="border-collapse: collapse">
                <td
                  align="right"
                  style="padding: 0; margin: 0"
                >
                  <table
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      width: 500px;
                    "
                    class="cke_show_border"
                    cellspacing="1"
                    cellpadding="1"
                    border="0"
                    align="right"
                    role="presentation"
                  >
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Subtotal (${liveorder.cartProducts.length} items):
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                      £ ${liveorder.Subtotal}
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Flat-rate Shipping:
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                          color: #d48344;
                        "
                      >
                        <strong>FREE</strong>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Discount:
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                      £ 0.00
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        <strong>Order Total:</strong>
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                          color: #d48344;
                        "
                      >
                        <strong>£ ${liveorder.Total}</strong>
                      </td>
                    </tr>
                  </table>
                  <p
                    style="
                      margin: 0;
                      -webkit-text-size-adjust: none;
                      -ms-text-size-adjust: none;
                      mso-line-height-rule: exactly;
                      font-family: arial, 'helvetica neue',
                        helvetica, sans-serif;
                      line-height: 21px;
                      color: #333333;
                      font-size: 14px;
                    "
                  >
                    <br />
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  </table></td></tr></table>`;

    let orders = { ...liveorder, status: "accepted" };
    fs.collection("orderHistory").add(orders);
    fs.collection("liveorder")
      .doc(key)
      .delete()
      .then(() => {
        if (liveorder.pickupState) {
          handleSend(
            detailsOrder + "The menu takes at least 25 minutes.",
            liveorder.email
          );
        } else {
          handleSend(
            detailsOrder + "The menu takes at least 60 minutes.",
            liveorder.email
          );
        }
        localStorage.setItem("orders", JSON.stringify(orders));
        let newWindow = window.open(
          "/receipt",
          "Popup",
          "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=300, height=500"
        );
        window.location.reload(false);
        newWindow.print();
        window.addEventListener(
          "beforeunload",
          function (e) {
            this.localStorage.removeItem("orders");
          },
          false
        );
      });
  }

  function handleDecline() {
    let detailsOrder = `<table
    class="es-content"
    cellspacing="0"
    cellpadding="0"
    align="center"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
      table-layout: fixed !important;
      width: 100%;
    "
  >
    <tr style="border-collapse: collapse">
      <td align="center" style="padding: 0; margin: 0">
        <table
          class="es-content-body"
          cellspacing="0"
          cellpadding="0"
          bgcolor="#ffffff"
          align="center"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
            background-color: #ffffff;
            width: 600px;
          "
        >
          <tr style="border-collapse: collapse">
            <td
              align="left"
              style="
                margin: 0;
                padding-top: 20px;
                padding-left: 20px;
                padding-right: 20px;
                padding-bottom: 30px;
              "
            >
              <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:280px" valign="top"><![endif]-->
              <table
                class="es-left"
                cellspacing="0"
                cellpadding="0"
                align="left"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  float: left;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    class="es-m-p20b"
                    align="left"
                    style="padding: 0; margin: 0; width: 280px"
                  >
                    <table
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: separate;
                        border-spacing: 0px;
                        background-color: #fef9ef;
                        border-color: #efefef;
                        border-width: 1px 0px 1px 1px;
                        border-style: solid;
                      "
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#fef9ef"
                      role="presentation"
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-bottom: 10px;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <h4
                            style="
                              margin: 0;
                              line-height: 120%;
                              mso-line-height-rule: exactly;
                              font-family: 'trebuchet ms', helvetica,
                                sans-serif;
                            "
                          >
                            SUMMARY:
                          </h4>
                        </td>
                      </tr>
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-bottom: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <table
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                              width: 100%;
                            "
                            class="cke_show_border"
                            cellspacing="1"
                            cellpadding="1"
                            border="0"
                            align="left"
                            role="presentation"
                          >
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order #:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >${orderTemp[0].orderNo}</span
                                >
                              </td>
                            </tr>
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order Date:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >${orderTemp[0].date}</span
                                >
                              </td>
                            </tr>
                            <tr style="border-collapse: collapse">
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >Order Total:</span
                                >
                              </td>
                              <td style="padding: 0; margin: 0">
                                <span
                                  style="
                                    font-size: 14px;
                                    line-height: 21px;
                                  "
                                  >£ ${orderTemp[0].Total}</span
                                >
                              </td>
                            </tr>
                          </table>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            <br />
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if mso]></td><td style="width:0px"></td><td style="width:280px" valign="top"><![endif]-->
              <table
                class="es-right"
                cellspacing="0"
                cellpadding="0"
                align="right"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  float: right;
                "
              >
                <tr style="border-collapse: collapse">
                  <td
                    align="left"
                    style="padding: 0; margin: 0; width: 280px"
                  >
                    <table
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: separate;
                        border-spacing: 0px;
                        background-color: #fef9ef;
                        border-width: 1px;
                        border-style: solid;
                        border-color: #efefef;
                      "
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#fef9ef"
                      role="presentation"
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-bottom: 10px;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <h4
                            style="
                              margin: 0;
                              line-height: 120%;
                              mso-line-height-rule: exactly;
                              font-family: 'trebuchet ms', helvetica,
                                sans-serif;
                            "
                          >
                            SHIPPING ADDRESS:<br />
                          </h4>
                        </td>
                      </tr>
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-bottom: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${orderTemp[0].user}
                          </p>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${orderTemp[0].address}
                          </p>
                          <p
                            style="
                              margin: 0;
                              -webkit-text-size-adjust: none;
                              -ms-text-size-adjust: none;
                              mso-line-height-rule: exactly;
                              font-family: arial, 'helvetica neue',
                                helvetica, sans-serif;
                              line-height: 21px;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${orderTemp[0].postCode}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <table
              class="es-content"
              cellspacing="0"
              cellpadding="0"
              align="center"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                table-layout: fixed !important;
                width: 100%;
              "
            >
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    class="es-content-body"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    "
                  ><tr style="border-collapse: collapse">
                  <td
                    align="left"
                    style="
                      margin: 0;
                      padding-top: 10px;
                      padding-bottom: 10px;
                      padding-left: 20px;
                      padding-right: 20px;
                    "
                  >
                    <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                    <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame" width="270" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20l" align="left">
                                                                                        <h4>ITEMS ORDERED</h4>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                    <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      align="right"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                      "
                    >
                      <tr style="border-collapse: collapse">
                        <td
                          align="left"
                          style="padding: 0; margin: 0; width: 270px"
                        >
                          <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            role="presentation"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr style="border-collapse: collapse">
                              <td
                                align="left"
                                style="padding: 0; margin: 0"
                              >
                                <table
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    width: 100%;
                                  "
                                  class="cke_show_border"
                                  cellspacing="1"
                                  cellpadding="1"
                                  border="0"
                                  role="presentation"
                                >
                                  <tr style="border-collapse: collapse">
                                    <td style="padding: 0; margin: 0">
                                      <span style="font-size: 13px"
                                        ></span
                                      >
                                    </td>
                                    <td
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        width: 60px;
                                        text-align: center;
                                      "
                                    >
                                      <span style="font-size: 13px"
                                        ><span style="line-height: 100%"
                                          >QTY</span
                                        ></span
                                      >
                                    </td>
                                    <td
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        width: 100px;
                                        text-align: center;
                                      "
                                    >
                                      <span style="font-size: 13px"
                                        ><span style="line-height: 100%"
                                          >PRICE</span
                                        ></span
                                      >
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!--[if mso]></td></tr></table><![endif]-->
                  </td>
                </tr> `;
    for (let i = 0; i < orderTemp[0].cartProducts.length; i++) {
      detailsOrder =
        `${detailsOrder}` +
        `<tr style="border-collapse: collapse">
        <td
          align="left"
          style="
            padding: 0;
            margin: 0;
            padding-left: 20px;
            padding-right: 20px;
          "
        >
          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
            "
          >
            <tr style="border-collapse: collapse">
              <td
                valign="top"
                align="center"
                style="padding: 0; margin: 0; width: 560px"
              >
                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="center"
                      style="
                        padding: 0;
                        margin: 0;
                        padding-bottom: 0px;
                        font-size: 0;
                      "
                    >
                      <table
                        width="100%"
                        height="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              border-bottom: 1px solid #efefef;
                              background: #ffffff none repeat
                                scroll 0% 0%;
                              height: 1px;
                              width: 100%;
                              margin: 0px;
                            "
                          ></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="border-collapse: collapse">
        <td
          align="left"
          style="
            margin: 0;
            padding-top: 5px;
            padding-bottom: 0;
            padding-left: 20px;
            padding-right: 20px;
          "
        >
          <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:178px" valign="top"><![endif]-->
          <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame" width="178" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-image" align="left"><strong>${
                                                                                      orderTemp[0]
                                                                                        .cartProducts[
                                                                                        i
                                                                                      ]
                                                                                        .title
                                                                                    }</strong></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
          <!--[if mso]></td><td style="width:20px"></td><td style="width:362px" valign="top"><![endif]-->
          <table
            cellspacing="0"
            cellpadding="0"
            align="right"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
            "
          >
            <tr style="border-collapse: collapse">
              <td
                align="left"
                style="padding: 0; margin: 0; width: 362px"
              >
                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="left"
                      style="padding: 0; margin: 0"
                    >
                      <p
                        style="
                          margin: 0;
                          -webkit-text-size-adjust: none;
                          -ms-text-size-adjust: none;
                          mso-line-height-rule: exactly;
                          font-family: arial, 'helvetica neue',
                            helvetica, sans-serif;
                          line-height: 21px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >
                      </p>
                      <table
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          width: 100%;
                        "
                        class="cke_show_border"
                        cellspacing="1"
                        cellpadding="1"
                        border="0"
                        role="presentation"
                      >
                        <tr style="border-collapse: collapse">
                          <td style="padding: 0; margin: 0; text-align: center" >
                          <strong>${""}</strong>
                          </td>
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              width: 60px;
                              text-align: center;
                            "
                          >
                            ${orderTemp[0].cartProducts[i].qty}
                          </td>
                          <td
                            style="
                              padding: 0;
                              margin: 0;
                              width: 100px;
                              text-align: center;
                            "
                          >
                          £ ${orderTemp[0].cartProducts[i].TotalProductPrice}
                          </td>
                        </tr>
                      </table>
                      <p
                        style="
                          margin: 0;
                          -webkit-text-size-adjust: none;
                          -ms-text-size-adjust: none;
                          mso-line-height-rule: exactly;
                          font-family: arial, 'helvetica neue',
                            helvetica, sans-serif;
                          line-height: 21px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >
                        <br />
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr><p style="text-align: left ; margin-top: 0px ; padding-left: 10px ; padding-top: 0">`;
      for (let j = 0; j < orderTemp[0].cartProducts[i].option.length; j++) {
        detailsOrder =
          `${detailsOrder}` +
          `${orderTemp[0].cartProducts[i].option[j].menu}, `;
      }

      for (let j = 0; j < orderTemp[0].cartProducts[i].addOn.length; j++) {
        detailsOrder =
          `${detailsOrder}` + `${orderTemp[0].cartProducts[i].addOn[j].menu}, `;
      }
      detailsOrder = detailsOrder + `</p>`;
    }
    detailsOrder =
      detailsOrder +
      `<tr style="border-collapse: collapse">
    <td
      align="left"
      style="
        margin: 0;
        padding-top: 5px;
        padding-left: 20px;
        padding-bottom: 30px;
        padding-right: 40px;
      "
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
        "
      >
        <tr style="border-collapse: collapse">
          <td
            valign="top"
            align="center"
            style="padding: 0; margin: 0; width: 540px"
          >
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              role="presentation"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
              "
            >
              <tr style="border-collapse: collapse">
                <td
                  align="right"
                  style="padding: 0; margin: 0"
                >
                  <table
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      width: 500px;
                    "
                    class="cke_show_border"
                    cellspacing="1"
                    cellpadding="1"
                    border="0"
                    align="right"
                    role="presentation"
                  >
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Subtotal (${orderTemp[0].cartProducts.length} items):
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                      £ ${orderTemp[0].Subtotal}
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Flat-rate Shipping:
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                          color: #d48344;
                        "
                      >
                        <strong>FREE</strong>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        Discount:
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                      £ 0.00
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                        "
                      >
                        <strong>Order Total:</strong>
                      </td>
                      <td
                        style="
                          padding: 0;
                          margin: 0;
                          text-align: right;
                          font-size: 18px;
                          line-height: 27px;
                          color: #d48344;
                        "
                      >
                        <strong>£ ${orderTemp[0].Total}</strong>
                      </td>
                    </tr>
                  </table>
                  <p
                    style="
                      margin: 0;
                      -webkit-text-size-adjust: none;
                      -ms-text-size-adjust: none;
                      mso-line-height-rule: exactly;
                      font-family: arial, 'helvetica neue',
                        helvetica, sans-serif;
                      line-height: 21px;
                      color: #333333;
                      font-size: 14px;
                    "
                  >
                    <br />
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  </table></td></tr></table>`;

    if (reason === "etc.") {
      fs.collection("orderHistory").add({
        ...orderTemp[0],
        status: "declined",
        reason: etc,
      });
      handleSend(
        `
        <table
            class="es-content"
            cellspacing="0"
            cellpadding="0"
            align="center"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              table-layout: fixed !important;
              width: 100%;
            "
          >
            <tr style="border-collapse: collapse">
              <td align="center" style="padding: 0; margin: 0">
                <table
                  class="es-content-body"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#ffffff"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    background-color: #ffffff;
                    width: 600px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="left"
                      style="
                        margin: 0;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        padding-left: 20px;
                        padding-right: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            valign="top"
                            align="center"
                            style="padding: 0; margin: 0; width: 560px"
                          >
                            <table
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: separate;
                                border-spacing: 0px;
                                border-radius: 0px;
                              "
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              role="presentation"
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  align="center"
                                  style="
                                    padding: 0;
                                    margin: 0;
                                    padding-top: 10px;
                                    padding-bottom: 15px;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      line-height: 36px;
                                      mso-line-height-rule: exactly;
                                      font-family: 'trebuchet ms', helvetica,
                                        sans-serif;
                                      font-size: 30px;
                                      font-style: normal;
                                      font-weight: normal;
                                      color: #E44C13;
                                    "
                                  >
                                  The order has been cancelled <br/> Reason: 
                                  ${etc} 
                                  <br/>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ` + detailsOrder,
        orderTemp[0].email
      );
    } else {
      fs.collection("orderHistory").add({
        ...orderTemp[0],
        status: "declined",
        reason: reason,
      });
      handleSend(
        `
        <table
            class="es-content"
            cellspacing="0"
            cellpadding="0"
            align="center"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              table-layout: fixed !important;
              width: 100%;
            "
          >
            <tr style="border-collapse: collapse">
              <td align="center" style="padding: 0; margin: 0">
                <table
                  class="es-content-body"
                  cellspacing="0"
                  cellpadding="0"
                  bgcolor="#ffffff"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    background-color: #ffffff;
                    width: 600px;
                  "
                >
                  <tr style="border-collapse: collapse">
                    <td
                      align="left"
                      style="
                        margin: 0;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        padding-left: 20px;
                        padding-right: 20px;
                      "
                    >
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                      >
                        <tr style="border-collapse: collapse">
                          <td
                            valign="top"
                            align="center"
                            style="padding: 0; margin: 0; width: 560px"
                          >
                            <table
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: separate;
                                border-spacing: 0px;
                                border-radius: 0px;
                              "
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              role="presentation"
                            >
                              <tr style="border-collapse: collapse">
                                <td
                                  align="center"
                                  style="
                                    padding: 0;
                                    margin: 0;
                                    padding-top: 10px;
                                    padding-bottom: 15px;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      line-height: 36px;
                                      mso-line-height-rule: exactly;
                                      font-family: 'trebuchet ms', helvetica,
                                        sans-serif;
                                      font-size: 30px;
                                      font-style: normal;
                                      font-weight: normal;
                                      color: #E44C13;
                                    "
                                  >
                                  The order has been cancelled <br/> Reason:  
                                  ${reason} 
                                  <br/>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ` + detailsOrder,
        orderTemp[0].email
      );
    }

    fs.collection("liveorder")
      .doc(orderTemp[1])
      .delete()
      .then(() => {
        window.location.reload(false);
      });
  }

  function playSound() {
    if (playAudio) {
      const audio = new Audio(sound);
      audio.play();
    }
  }

  console.log(liveOrders);

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  if (!isAdmin) {
    console.log(isAdmin);
    return <Redirect to="/" />;
  }
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        {/* loop all live order */}
        {liveOrders ? (
          <>
            {liveOrders.length > 0 ? <>{playSound()}</> : null}

            {liveOrders.map((liveorder) => (
              <div
                style={{
                  overflowY: "scroll",
                  height: "400px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  margin: "5px",
                }}
              >
                <Card
                  style={{
                    width: "400px",
                  }}
                >
                  <Card.Body>
                    <Card.Title>
                      <p style={{ fontWeight: "bold" }}>ORDER</p>
                      <p># {liveorder.orderNo}</p>
                    </Card.Title>
                    <Card.Text>{liveorder.date}</Card.Text>
                    {liveorder.payment.type === "cash" ? (
                      <>
                        {liveorder.pickupState ? (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              CASH Collection
                            </Card.Title>
                          </>
                        ) : (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              CASH Delivery
                            </Card.Title>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {liveorder.pickupState ? (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              PAYPAL Collection
                            </Card.Title>
                          </>
                        ) : (
                          <>
                            <Card.Title style={{ fontWeight: "bold" }}>
                              PAYPAL Delivery
                            </Card.Title>
                          </>
                        )}
                      </>
                    )}
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    {liveorder.cartProducts.map((cartProduct) => (
                      <>
                        <ListGroupItem>
                          <p>
                            {cartProduct.qty} x {cartProduct.title}
                          </p>
                          {cartProduct.option.map((option) => (
                            <>
                              <p style={{ fontWeight: "bold" }}>
                                {option.title}{" "}
                                <label style={{ fontWeight: "normal" }}>
                                  - {option.menu} (£
                                  {parseFloat(option.price).toFixed(2)})
                                </label>
                              </p>
                            </>
                          ))}
                          {cartProduct.addOn.map((addon) => (
                            <>
                              <p style={{ fontWeight: "bold" }}>
                                {addon.title}{" "}
                                <label style={{ fontWeight: "normal" }}>
                                  - {addon.menu} (£
                                  {parseFloat(addon.price).toFixed(2)})
                                </label>
                              </p>
                            </>
                          ))}
                        </ListGroupItem>
                      </>
                    ))}
                    {/* loop order this option and addon font weight bold*/}
                    {/* end loop order */}
                  </ListGroup>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "bold" }}>
                      TOTAL £{parseFloat(liveorder.Total).toFixed(2)} <br></br>
                      PHONE: {liveorder.Telephone}
                    </Card.Title>
                    <Card.Text>
                      {liveorder.user +
                        " " +
                        liveorder.address +
                        " " +
                        liveorder.postCode}
                    </Card.Text>
                  </Card.Body>
                  <Card.Body>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(liveorder, liveorder.key)}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleShowReason(liveorder, liveorder.key);
                        // handleDecline(liveorder, liveorder.key);
                      }}
                    >
                      DECLINE
                    </Button>
                  </Card.Body>
                </Card>
                <Modal show={showReason} onHide={handleCloseReason}>
                  <Modal.Header closeButton>
                    <Modal.Title>Why declined the order?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <select
                      className="form-control"
                      required={true}
                      onChange={(e) => {
                        handleChangeReason(e);
                      }}
                    >
                      <option value="">Select Reason</option>
                      <option value="Too many orders cannot be delivered but you can be picked up at the restaurant.">
                        Too many orders cannot be delivered but you can be
                        picked up at the restaurant.
                      </option>
                      <option value="Driver is not available.">
                        Driver is not available.
                      </option>
                      <option value="Kitchen is closed.">
                        Kitchen is closed.
                      </option>
                      <option value="etc.">etc.</option>
                    </select>

                    {reason === "etc." ? (
                      <Form onSubmit={(event) => event.preventDefault()}>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label>Reason Details</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(event) => handleETCReason(event)}
                            required={true}
                            // placeholder="Eg. Food allergies, food strength etc..."
                          />
                        </Form.Group>
                      </Form>
                    ) : null}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReason}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleShowSure}
                      type="submit"
                      disabled={disableButton}
                    >
                      Send
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={showSure} onHide={handleCloseSure}>
                  <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSure}>
                      Dismiss
                    </Button>
                    <Button variant="primary" onClick={handleDecline}>
                      Cancel the order
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            ))}
          </>
        ) : null}

        {/* end loop all live order */}
      </Container>
      <Footer />
    </div>
  );
}

export default LiveOrder;
