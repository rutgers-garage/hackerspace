import React from "react";
import "./App.css";
//import * as db from './db.json';

class Checkout extends React.Component {
  constructor() {
    super();

    this.state = {
      db: {},
      request: {}
    };

    this.validateInput = this.validateInput.bind(this);
    this.retrieveRequest = this.retrieveRequest.bind(this);
    this.wow = this.wow.bind(this);
  }

  componentDidMount() {
    fetch("https://5ddfcb0f.ngrok.io")
      .then(res => res.json())
      .then(data => {
        this.setState({ db: data });
      });

    let request = this.retrieveRequest();

    this.setState({ request: request });
  }

  retrieveRequest() {
    let name = this.props.location.state.name;
    let quantityAvailable = this.props.location.state.quantityAvailable;
    let quantityRequested = this.props.location.state.quantityRequested;

    console.log(name, quantityAvailable, quantityRequested);

    return [name, quantityAvailable, quantityRequested];
  }

  wow(event) {
    event.preventDefault();

    let request = this.state.request;

    let name = event.target.name.value;
    let graduating = event.target.class.value;
    let netID = event.target.netID.value;
    let email = event.target.email.value;

    let body = {
      name: name,
      class: graduating,
      netId: netID,
      email: email,
      checkout: {
        name: request[0],
        quantity: request[2]
      }
    };

    console.log(body);

    fetch("https://5ddfcb0f.ngrok.io/checkout", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(res => console.log(res));
  }

  // Checks request isn't larger than inventory.
  validateInput() {
    let request = this.state.request;

    console.log();

    if (parseInt(request[1]) < parseInt(request[2])) {
      // NOTE: PARSING INT IN COMPARISON MAKES IT WORK??? FUCK JAVASCRIPT

      return (
        <h1>
          Sorry! We can't fulfill this request. You're trying to check out more{" "}
          {request[0]}s than we have.
        </h1>
      );
    } else {
      return (
        <div>
          <h2>
            {request[0]}, {request[2]} Units{" "}
          </h2>

          <form onSubmit={this.wow}>
            <input type="text" name="name" placeholder="Name"></input>
            <input type="text" name="class" placeholder="Class"></input>
            <input type="text" name="netID" placeholder="NetID"></input>
            <input type="text" name="email" placeholder="Email"></input>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <nav>
          <h1>Checkout</h1>
        </nav>

        <main>{this.validateInput()}</main>
      </div>
    );
  }
}

export default Checkout;
