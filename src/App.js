import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import NotFound from "./Components/NotFound";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddProducts from "./Components/Dashboard/AddProducts";
import Cart from "./Components/Cart";
import ManageAdmin from "./Components/Dashboard/ManageAdmin";
// import Method from "./Components/Method";
import Receipt from "./Components/Receipt/Receipt";
import ManageProducts from "./Components/Dashboard/ManageProducts";
import EditProducts from "./Components/Dashboard/EditProducts";
import AddCategory from "./Components/Dashboard/AddCategory";
import FixedAddOn from "./Components/Dashboard/FixedAddOn";
import AddCoupon from "./Components/Dashboard/AddCoupon";
import Checkout from "./Components/Checkout";
import LiveOrder from "./Components/Dashboard/LiveOrder";
import Customer from "./Components/Dashboard/Customer";
import OrderHistory from "./Components/Dashboard/OrderHistory";
import Order from "./Components/Dashboard/Order";
import OrderSuccess from "./Components/OrderSuccess";

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
        <Route path="/order" component={Cart} />
        {/* <Route path="/method" component={Method} /> */}
        <Route path="/receipt" component={Receipt} />
        <Route path="/manageproducts" component={ManageProducts} />
        <Route path="/editproducts" component={EditProducts} />
        <Route path="/managecategory" component={AddCategory} />
        <Route path="/fixedaddon" component={FixedAddOn} />
        <Route path="/managecoupon" component={AddCoupon} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/liveorder" component={LiveOrder} />
        <Route path="/customer" component={Customer} />
        <Route path="/orderhistory" component={OrderHistory} />
        <Route path="/eachorder" component={Order} />
        <Route path="/ordersuccess" component={OrderSuccess} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
