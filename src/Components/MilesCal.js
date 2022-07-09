import React, { useState, useEffect, useCallback, useRef } from "react";
import { auth, fs } from "../Config/Config";

function MilesCal() {
  const [town, setTown] = useState("");
  const [postCode, setPostCode] = useState("");

  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setTown(snapshot.data().Town);
              setPostCode(snapshot.data().PostCode);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }
  const user = GetCurrentUser();
  const [fee, setFee] = useState(2); // 2 pounds default
  const miles = 3; //default 3 miles
  useEffect(() => {
    if (town === "Calvery") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      }
    } else if (town === "Bramley") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(16 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(16 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(16 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      }
    } else if (town === "Armley") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(6 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      }
    } else if (town === "Rodley") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      }
    } else if (town === "Horstforth") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(6 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(3 - miles); // miles < 3 so distance around 3 default
        setFee(Number(distance + fee));
      }
    } else if (town === "Stanningley") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(4 - miles);
        setFee(Number(distance + fee));
      }
    } else if (town === "Pudsey") {
      if (postCode.toUpperCase() === "LS12") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS13") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS18") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      } else if (postCode.toUpperCase() === "LS28") {
        let distance = Number(3 - miles);
        setFee(Number(distance + fee));
      }
    }
  }, [town, postCode]);
  return fee;
}

export default MilesCal;
