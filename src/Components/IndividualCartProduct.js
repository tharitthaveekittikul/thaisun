import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { auth, fs } from "../Config/Config";

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
            console.log("successfully deleted");
          });
      }
    });
  };

  return (
    <li className="items odd">
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
          <br></br>
          <p>{cartProduct.instruction}</p>
          <br></br>
          <p>
            <span
              className="action-btns minus"
              onClick={handleCartProductDecrease}
            >
              <Icon icon={minus} size={20} />
            </span>
            <span style={{}}>{cartProduct.qty}</span>
            <span
              className="action-btns plus"
              onClick={handleCartProductIncrease}
            >
              <Icon icon={plus} size={20} />
            </span>{" "}
            x ${Number(cartProduct.priceWithAddon).toFixed(2)}
          </p>
        </div>
        <div className="prodTotal cartSection">
          <p>{Number(cartProduct.TotalProductPrice).toFixed(2)}</p>
        </div>
        <div className="cartSection removeWrap">
          <a className="remove" onClick={handleCartProductDelete}>
            x
          </a>
        </div>
      </div>
    </li>
  );
}
