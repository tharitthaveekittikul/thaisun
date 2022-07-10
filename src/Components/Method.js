import React from "react";
import Delivery from "./Delivery";
import Pickup from "./Pickup";
import { Icon } from "react-icons-kit";

import { ic_restaurant } from "react-icons-kit/md/ic_restaurant";
import { ic_directions_bike } from "react-icons-kit/md/ic_directions_bike";

export default function Method() {
  return (
    <>
      <div className="method-container">
        <div className="method">
          <Icon icon={ic_directions_bike} size={60} />
          <Delivery />
        </div>
        <div className="method">
          <Icon icon={ic_restaurant} size={60} />
          <Pickup />
        </div>
      </div>
    </>
  );
}
