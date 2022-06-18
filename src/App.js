import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
// import { NotFound } from "./Components/NotFound";
// import { AddProducts } from "./Components/AddProducts";
// import { Cart } from "./Components/Cart";
import Profile from "./Components/Profile";
import NotFound from "./Components/NotFound";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import AddProducts from "./Components/Dashboard/AddProducts";
import Cart from "./Components/Cart";
import AddAdmin from "./Components/Dashboard/AddAdmin";
import Method from "./Components/Method";

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/addproducts" component={AddProducts} />
        <Route path="/addadmin" component={AddAdmin} />
        <Route path="/cart" component={Cart} />
        <Route path="/method" component={Method} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
