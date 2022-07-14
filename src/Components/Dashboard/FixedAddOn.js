import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { storage, fs } from "../../Config/Config";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { Alert } from "react-bootstrap";

function FixedAddOn() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const titleRef = useRef([]);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [inputFields, setInputFields] = useState([
    {
      title: "",
      menu: [
        {
          menuName: "",
          price: 0,
        },
      ],
    },
  ]);
  useEffect(() => {
    fs.collection("fixedAddOn")
      .doc("option")
      .get()
      .then((snapshot) => {
        setInputFields(snapshot.data().addOn);
      })
      .catch(() => {
        setErrorMsg("No data");
      });
  }, []);
  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  // console.log(isAdmin);
  if (!isAdmin) {
    // console.log(isAdmin);
    return <Redirect to="/" />;
  }

  const handleChangeTitle = (index, event) => {
    const values = [...inputFields];
    values[index]["title"] = event.target.value;
    setInputFields(values);
    // console.log(inputFields);
  };

  const handleChangeMenu = (index, index_child, event) => {
    const values = [...inputFields];
    values[index]["menu"][index_child][event.target.name] = event.target.value;
    setInputFields(values);
    // console.log(inputFields);
  };

  const handleAddTitle = () => {
    setInputFields([
      ...inputFields,
      {
        title: "",
        menu: [
          {
            menuName: "",
            price: 0,
          },
        ],
      },
    ]);
  };

  const handleRemoveTitle = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleAddMenu = (index) => {
    if (inputFields.length == 1) {
      setInputFields([
        {
          title: titleRef.current[index].value,
          menu: [
            ...inputFields[index].menu,
            {
              menuName: "",
              price: 0,
            },
          ],
        },
      ]);
    } else {
      const values = [...inputFields];
      values.push({
        title: titleRef.current[index].value,
        menu: [
          ...inputFields[index].menu,
          {
            menuName: "",
            price: 0,
          },
        ],
      });
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  const handleRemoveMenu = (index, index_child) => {
    const values = inputFields[index].menu;
    values.splice(index_child, 1);
    if (inputFields.length == 1) {
      setInputFields([
        {
          title: titleRef.current[index].value,
          menu: values,
        },
      ]);
    } else {
      const all = [
        ...inputFields,
        {
          title: titleRef.current[index].value,
          menu: values,
        },
      ];
      setInputFields(all);
      all.splice(index, 1);
      setInputFields(all);
    }
  };

  const handleUpdateAddOn = (e) => {
    e.preventDefault();
    setLoadingMsg("Loading...");
    fs.collection("fixedAddOn")
      .doc("option")
      .set({
        addOn: inputFields,
      })
      .then(() => {
        setSuccessMsg("Update fixed add-on successfully");
        setLoadingMsg("");
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      })
      .catch((error) => {
        setErrorMsg("Failed to update fixed add-on");
      });
  };
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div className="content-wrapper">
        <div className="container">
          <br></br>
          <br></br>
          <h1>Fixed Add-On</h1>
          <hr></hr>
          {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
          {successMsg && (
            <>
              <div className="success-msg">{successMsg}</div>
              <br></br>
            </>
          )}
          {errorMsg ? <Alert variant="danger">{errorMsg}</Alert> : ""}
          <form
            autoComplete="off"
            className="form-group"
            onSubmit={handleUpdateAddOn}
          >
            <br></br>

            {inputFields.map((titleField, index) => (
              <>
                <label>Add Add-on</label>
                <div key={index}>
                  <input
                    className="form-control"
                    type="text"
                    name="title"
                    placeholder="Add-on Title"
                    value={titleField.title}
                    ref={(el) => (titleRef.current[index] = el)}
                    onChange={(event) => handleChangeTitle(index, event)}
                  />
                  {titleField.menu.map((menuField, index_child) => (
                    <div key={index_child} className="d-flex">
                      <input
                        className="form-control"
                        type="text"
                        name="menuName"
                        placeholder="Menu Name"
                        value={menuField.menuName}
                        onChange={(event) =>
                          handleChangeMenu(index, index_child, event)
                        }
                        autoFocus
                      />
                      <input
                        className="form-control"
                        type="number"
                        name="price"
                        value={menuField.price}
                        onChange={(event) =>
                          handleChangeMenu(index, index_child, event)
                        }
                      />
                      <Icon
                        icon={plus}
                        size={20}
                        onClick={() => handleAddMenu(index)}
                      />
                      <Icon
                        icon={minus}
                        size={20}
                        onClick={() => handleRemoveMenu(index, index_child)}
                      />
                    </div>
                  ))}
                  <Icon
                    icon={plus}
                    size={20}
                    onClick={() => handleAddTitle()}
                  />
                  <Icon
                    icon={minus}
                    size={20}
                    onClick={() => handleRemoveTitle(index)}
                  />
                  <hr />
                </div>
              </>
            ))}
            <br></br>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-success btn-md">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FixedAddOn;
