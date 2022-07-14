import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { auth, fs } from "../Config/Config";
import { ic_delete } from "react-icons-kit/md/ic_delete";

export default function IndividualCartProduct({
  cartProduct,
  cartProductIncrease,
  cartProductDecrease,
}) {
  const handleCartProductIncrease = () => {
    cartProductIncrease(cartProduct);
  };

  const handleCartProductDecrease = () => {
    cartProductDecrease(cartProduct);
  };

  const handleCartProductDelete = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.DOC_ID)
          .delete()
          .then(() => {
            // console.log("successfully deleted");
          });
      }
    });
  };

  return (
    <li className="items">
      <div className="infoWrap">
        <div className="cartSection">
          {/* <img src={cartProduct.img} alt={cartProduct.title} /> */}
          <h3>{cartProduct.title}</h3>
          {cartProduct.option.map((option) => (
            <p
              style={{
                padding: "0",
                margin: "0",
                textIndent: "10px",
              }}
            >
              {option.menu}
            </p>
          ))}
          {cartProduct.addOn.map((addOn) => (
            <p
              style={{
                padding: "0",
                margin: "0",
                textIndent: "10px",
              }}
            >
              {addOn.menu}
            </p>
          ))}
          {cartProduct.instruction ? (
            <>
              <p
                style={{
                  textIndent: "10px",
                  marginBottom: "0px",
                }}
              >
                - {cartProduct.instruction}
              </p>
            </>
          ) : null}

          <p style={{ color: "#e80532" }}>
            <span
              className="action-btns-pointer"
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                marginBottom: "5px",
                color: "black",
              }}
              onClick={handleCartProductDecrease}
            >
              <Icon icon={minus} size={20} />
            </span>
            <span style={{ fontSize: "16px", color: "black" }}>
              {cartProduct.qty}
            </span>
            <span
              className="action-btns-pointer"
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                marginBottom: "5px",
                color: "black",
              }}
              onClick={handleCartProductIncrease}
            >
              <Icon icon={plus} size={20} />
            </span>{" "}
            x ${Number(cartProduct.priceWithAddon).toFixed(2)}
          </p>
        </div>
        <div className="right-container">
          <div className="prodTotal">
            <p>£{Number(cartProduct.TotalProductPrice).toFixed(2)}</p>
          </div>
          <div className="deleteProd" onClick={handleCartProductDelete}>
            <Icon icon={ic_delete} size={20} style={{ color: "#c2052a" }} />
          </div>
        </div>
      </div>
    </li>
  );
}
