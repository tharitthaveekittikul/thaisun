import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { auth, fs } from "../Config/Config";

const PrivateRoute = ({ component: Component, ...rest }) => {
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
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  console.log(user);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) => {
        if (user != null) {
          return <Component {...props} />;
        }
        return <Redirect to="/login" />;
        // currentUser!=null ? <Redirect to="/login" /> : <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
