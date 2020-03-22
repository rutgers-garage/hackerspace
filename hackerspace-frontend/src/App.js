import React from "react";
import "./App.css";
import Hardware from "./Hardware.js";
import Checkout from "./Checkout.js";
import Dashboard from "./Dashboard.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Hardware} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default App;
