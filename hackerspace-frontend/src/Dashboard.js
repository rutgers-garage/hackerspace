import React from 'react';
import './App.css';

import CheckoutTable from './CheckoutTable.js'

class  Dashboard extends React.Component {
  
    // React Constructor
    constructor(){
        
        super();
        
        this.state = { 
            checkouts: []
        };

        this.buildCheckoutList = this.buildCheckoutList.bind(this);

    }
    
    // API Call to Database
    componentDidMount(){
        
        let backend_endpoint = "https://c3a04182.ngrok.io";

        fetch(backend_endpoint + "/dashboard")
            .then( (res) => res.json() )
            .then( (data) => { this.setState({checkouts: data.checkouts})});
    
    }

    buildCheckoutList(){
        let checkouts = this.state.checkouts;

        let x = [];

        for(let i = 0; i < checkouts.length; i++){

            let element = (
                <div key = {i}>
                    <h1>Name: {checkouts[i].name}</h1>
                    <CheckoutTable netid = {checkouts[i].netId} checkout = {checkouts[i].checkout} />
                </div>
            )

            x.push(element);
        }

        return x;

    }
    
    render(){
        return (
            <div>
                {this.buildCheckoutList()}
            </div>
        );
    }
}

export default Dashboard;
