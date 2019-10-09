import React from 'react';
import './App.css';
//import * as db from './db.json';

class  Dashboard extends React.Component {
  
    // React Constructor
    constructor(){
        
        super();
        
        this.state = { 
            items: [],
            checkouts: [],
            quantityRequested: 0 
        };
        
        this.handleChange = this.handleChange.bind(this);
        
        this.saveRequest = this.saveRequest.bind(this);

    }
    
    handleChange(){
        
    }
    
    componentDidMount(){
        
        fetch("https://api.myjson.com/bins/16uxbr")
            .then( (res) => res.json() )
            .then( (data) => { this.setState({items: data.items, checkouts: data.checkouts}) });
    
    }
    
    render(){
        return (
            <p>{this.state.items}, {this.state.checkouts}</p>
        );
    }
}

export default Dashboard;
