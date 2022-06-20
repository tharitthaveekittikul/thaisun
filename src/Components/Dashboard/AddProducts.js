import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { storage, fs } from "../../Config/Config";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
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

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

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

  const handleRemoveTitle = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
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
                price: Number(price),
                img: url,
                addOn: inputFields,
              })
              .then(() => {
                setSuccessMsg("Product added successfully");
                setTitle("");
                setDescription("");
                setCategory("");
                setPrice("");
                document.getElementById("file").value = "";
                setImageError("");
                setUploadError("");
                setTimeout(() => {
                  setSuccessMsg("");
                }, 3000);
              })
              .catch((error) => setUploadError(error.message));
          });
      }
    );
  };

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
      <div className="container">
        <br></br>
        <br></br>
        <h1>Add Products</h1>
        <hr></hr>
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
            required
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Product Category</option>
            <option>Electronic Devices</option>
            <option>Mobile Accessories</option>
            <option>TV & Home Appliances</option>
            <option>Sports & outdoors</option>
            <option>Health & Beauty</option>
            <option>Home & Lifestyle</option>
            <option>Men's Fashion</option>
            <option>Watches, bags & Jewellery</option>
            <option>Groceries</option>
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
              <Icon icon={plus} size={20} onClick={() => handleAddTitle()} />
              <Icon
                icon={minus}
                size={20}
                onClick={() => handleRemoveTitle(index)}
              />
              <hr />
            </div>
          ))}
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
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}
