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
import ManageAdmin from "./Components/Dashboard/ManageAdmin";
import Method from "./Components/Method";
import Receipt from "./Components/Receipt/Receipt";
import ManageProducts from "./Components/Dashboard/ManageProducts";
import ManageAddOn from "./Components/Dashboard/ManageAddOn";
import EditProducts from "./Components/Dashboard/EditProducts";

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
        <Route path="/manageadmin" component={ManageAdmin} />
        <Route path="/checkout" component={Cart} />
        <Route path="/method" component={Method} />
        <Route path="/receipt" component={Receipt} />
        <Route path="/manageproducts" component={ManageProducts} />
        <Route path="/manageaddons" component={ManageAddOn} />
        <Route path="/editproducts" component={EditProducts} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
