import React, { useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Paypal(cost) {
  const paypal = useRef();
  const history = useHistory();

  useEffect(() => {
    console.log(Object.values(cost)[0])
    window.paypal
      .Buttons({
        upgradeLSAT: true,
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "GBP",
                  value: Object.values(cost)[0],
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
            const order = await actions.order.capture(); 
            console.log("order", order);
            console.log('DONEEEEEEEEEEEEEEe')
            history.push('/menu')
        },
        onShippingChange: function(data,actions){
            return actions.resolve();
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, cost);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}