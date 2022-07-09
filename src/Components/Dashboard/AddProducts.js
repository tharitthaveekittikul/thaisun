import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { storage, fs } from "../../Config/Config";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { Button, Alert, Container, Card, Form, Modal } from "react-bootstrap";

export default function AddProducts() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLogIn = localStorage.getItem("isLogIn") === "True";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(true);

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

  // const [categoryFs, setCategoryFs] = useState();
  const [categoryUID, setCategoryUID] = useState("");
  const [countCategory, setCountCategory] = useState(0);
  const categoryRef = useRef();

  const [loadingMsg, setLoadingMsg] = useState("");

  function GetCategoryFromFirebase() {
    const getCategoryFromFirebase = [];
    const [categoryFs, setCategoryFs] = useState();
    useEffect(async () => {
      const snapshot = await fs.collection("category").get();
      snapshot.docs.map((doc) => {
        getCategoryFromFirebase.push({ ...doc.data(), key: doc.id });
      });
      setCategoryFs(getCategoryFromFirebase);
      setLoading(false);
    }, []);
    return categoryFs;
  }

  const categoryFs = GetCategoryFromFirebase();

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

  const inputFieldsTemp = [
    {
      title: "",
      menu: [
        {
          menuName: "",
          price: 0,
        },
      ],
    },
  ];

  // function arrayCompare(_arr1, _arr2) {
  //   if (
  //     !Array.isArray(_arr1) ||
  //     !Array.isArray(_arr2) ||
  //     _arr1.length !== _arr2.length
  //   ) {
  //     return false;
  //   }

  //   // .concat() to not mutate arguments
  //   const arr1 = _arr1.concat().sort();
  //   const arr2 = _arr2.concat().sort();

  //   for (let i = 0; i < arr1.length; i++) {
  //     if (arr1[i] !== arr2[i]) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }
  // console.log(inputFields);
  // console.log(inputFieldsTemp);
  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // console.log(isEqual(inputFields, inputFieldsTemp));
  // console.log(arrayCompare(inputFields, inputFieldsTemp));

  const titleRef = useRef([]);

  const handleChangeTitle = (index, event) => {
    // console.log(index, event.target.value);
    const values = [...inputFields];
    values[index]["title"] = event.target.value;
    setInputFields(values);
    console.log(inputFields);
  };

  const handleChangeMenu = (index, index_child, event) => {
    // console.log(index, event.target.value);
    const values = [...inputFields];
    values[index]["menu"][index_child][event.target.name] = event.target.value;
    setInputFields(values);
    console.log(inputFields);
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

  console.log(inputFields);

  const handleRemoveTitle = (index) => {
    if (isEqual(inputFields, inputFieldsTemp)) {
      console.log("in");
      handleClose1();
      return;
    }
    if (inputFields.length === 1) {
      console.log("in lenght 1");
      handleClose1();
      return;
    }
    const values = [...inputFields];
    console.log(index);
    values.splice(index, 1);
    setInputFields(values);
    handleClose1();
  };

  const handleAddMenu = (index) => {
    // console.log(inputFields[index].menu[0]);
    // console.log(titleRef.current[index].value);
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
      // console.log(values);
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
    if (inputFields[index].menu.length === 1) {
      console.log("menu in");
      handleClose();
      return;
    }
    if (isEqual(inputFields, inputFieldsTemp)) {
      console.log("in");
      handleClose();
      return;
    }
    const values = inputFields[index].menu;
    // console.log(values);
    values.splice(index_child, 1);
    // console.log(values);
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

    handleClose();
    // setInputFields();
    // setInputFields(values);
    // setInputFields([
    //   {
    //     title: titleRef.current[index].value,
    //     menu: values,
    //   },
    // ]);

    // ดูตัวแปร object กับ array ของ menu ใหม่ด้วย
    // console.log(index_child);
    // values.splice(index_child, 1);
    // console.log(values);
    // setInputFields(values);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [menuIndex, setMenuIndex] = useState();
  const [menuIndexChild, setMenuIndexChild] = useState();
  const handleShow = (index, index_child) => {
    if (inputFields[index].menu.length === 1) {
      console.log("menu in");
      handleClose();
      return;
    }
    if (isEqual(inputFields, inputFieldsTemp)) {
      console.log("in");
      handleClose();
      return;
    }
    setMenuIndex(index);
    setMenuIndexChild(index_child);
    setShow(true);
  };

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const [titleIndex, setTitleIndex] = useState();
  const handleShow1 = (index) => {
    if (isEqual(inputFields, inputFieldsTemp)) {
      console.log("in");
      handleClose1();
      return;
    }
    if (inputFields.length === 1) {
      console.log("in lenght 1");
      handleClose1();
      return;
    }
    setTitleIndex(index);
    setShow1(true);
  };

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
      } else {
        setImage(null);
        setImageError("please select a valid image file type (png or jpg)");
      }
    } else {
      console.log("please select your file");
    }
  };

  const handleAddProducts = (e) => {
    e.preventDefault();
    // console.log(title, description, price);
    // console.log(image);
    setLoadingMsg("Loading...");
    window.scrollTo(0, 0);
    const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => setUploadError(error.message),
      () => {
        storage
          .ref("product-images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            fs.collection("Products")
              .add({
                title,
                description,
                category,
                categoryID: categoryUID,
                price: Number(price),
                img: url,
                option: inputFields,
              })
              .then(() => {
                console.log(countCategory);
                fs.collection("category")
                  .doc(categoryUID)
                  .update({
                    countUse: countCategory + 1,
                  });
                setSuccessMsg("Product added successfully");
                setLoadingMsg("");
                setTitle("");
                setDescription("");
                setPrice("");
                document.getElementById("file").value = "";
                setImageError("");
                setUploadError("");
                setTimeout(() => {
                  setSuccessMsg("");
                }, 2000);
              })
              .catch((error) => setUploadError(error.message));
          });
      }
    );
  };

  function handleChangeCategory(e) {
    let values = e.target.value;
    values = values.split(",");
    console.log(values);
    setCategory(values[1]);
    setCategoryUID(values[0]);
    fs.collection("category")
      .doc(values[0])
      .get()
      .then((snapshot) => {
        setCountCategory(snapshot.data().countUse);
      });
  }

  let getCategory;
  if (categoryFs) {
    getCategory = categoryFs.map((category, index) => {
      return (
        <option
          key={index}
          value={[category.key, category.category]}
          ref={categoryRef}
        >
          {category.category}
        </option>
      );
    });
  } else {
    getCategory = () => {
      return <></>;
    };
  }

  if (!isLogIn) {
    return <Redirect to="/login" />;
  }
  console.log(isAdmin);
  if (!isAdmin) {
    console.log(isAdmin);
    return <Redirect to="/" />;
  }

  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <div className="content-wrapper">
        <div className="container">
          <br></br>
          <br></br>
          <h1>Add Products</h1>
          <hr></hr>
          {loadingMsg ? <Alert variant="secondary">{loadingMsg}</Alert> : ""}
          {successMsg && (
            <>
              <div className="success-msg">{successMsg}</div>
              <br></br>
            </>
          )}
          <form
            autoComplete="off"
            className="form-group"
            onSubmit={handleAddProducts}
          >
            <label>Product Title</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            ></input>
            <br></br>
            <label>Product Description</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></input>
            <br></br>
            <label>Product Price</label>
            <input
              type="number"
              className="form-control"
              required
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            ></input>
            <br></br>
            <label>Product Category</label>
            <select
              className="form-control"
              required
              onChange={(e) => {
                handleChangeCategory(e);
              }}
              defaultValue={category}
            >
              {console.log(category)}
              {console.log(categoryUID)}
              <option value="">Select Product Category</option>
              {loading ? (
                <>
                  <option></option>
                </>
              ) : (
                <>{getCategory}</>
              )}
            </select>
            <br></br>
            <label>Upload Product Image</label>
            <input
              type="file"
              id="file"
              className="form-control"
              required
              onChange={handleProductImg}
            ></input>
            <br></br>
            <label>Add Add-on</label>
            {inputFields.map((titleField, index) => (
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
                  <>
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
                        style={{ cursor: "pointer" }}
                      />
                      <Icon
                        icon={minus}
                        size={20}
                        // onClick={() => handleRemoveMenu(index, index_child)}
                        onClick={() => handleShow(index, index_child)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </>
                ))}
                <Icon
                  icon={plus}
                  size={20}
                  onClick={() => handleAddTitle()}
                  style={{ cursor: "pointer" }}
                />
                <Icon
                  icon={minus}
                  size={20}
                  onClick={() => handleShow1(index)}
                  style={{ cursor: "pointer" }}
                />

                <hr />
              </div>
            ))}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  No
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleRemoveMenu(menuIndex, menuIndexChild)}
                >
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={show1} onHide={handleClose1}>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose1}>
                  No
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleRemoveTitle(titleIndex)}
                >
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>

            {imageError && (
              <>
                <br></br>
                <div className="error-msg">{imageError}</div>
              </>
            )}
            <br></br>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-success btn-md">
                SUBMIT
              </button>
            </div>
          </form>
          {uploadError && (
            <>
              <br></br>
              <div className="error-msg">{uploadError}</div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
