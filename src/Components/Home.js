import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Products from "./Products";
import { auth, fs } from "../Config/Config";

function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  //get current user
  function GetCurrentUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FirstName);
              setIsAdmin(snapshot.data().isAdmin);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  //   console.log(user);
  //   console.log("isAdmin : ", isAdmin);

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />
      <Products />
    </>
  );
}

export default Home;
