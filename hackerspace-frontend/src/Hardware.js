import React from 'react';
import './App.css';
// eslint-disable-next-line
import { BrowserRouter as Router, Link } from "react-router-dom";


class Hardware extends React.Component{
    
    // React Constructor
    constructor(){
        
        super();
        
        this.state = { 
            items: [],
            quantityRequested: 0 
        };
        
        this.handleChange = this.handleChange.bind(this);
        
    }
    
    
    // API Call to Database
    componentDidMount(){
        
        fetch("https://api.myjson.com/bins/16uxbr")
            .then( (res) => res.json() )
            .then( (data) => { this.setState({items: data.items}) });
    
    }
    
    
    // Writes Quantity of Hardware Item Requested to
    handleChange(event){
        
        this.setState({ quantityRequested: event.target.value })
    
    }
    
    
    

    createItemList(){
        
        const raw = this.state.items;
                
        let items = [];
           
        for(let i = 0; i < raw.length; i++){

            let name = raw[i].name;
            let quantity = raw[i].quantity;
            
            let item = <tr key = {i} className =  "list-item"> 
                <td> {name} </td>
                <td> {quantity} </td>

                <td> <input onChange = { this.handleChange } type="text" name="fname" className = "quantity-request"></input> </td>

                <td> 
                    <Link to = {{pathname: "/checkout",  
                        state: {
                            name: name, 
                            quantityAvailable: quantity,
                            quantityRequested: this.state.quantityRequested
                        }
                    }}>
                        <button>Checkout</button>
                    </Link>
                </td>
            </tr>

            items.push(item);
        }
        
        return items;
        
    }


    render() {
        return (
            <div className="App">
                <table className="hardware-list">
                    <tbody>
                        <tr>
                            <th> Item Name </th>
                            <th> Quantity Available </th>
                            <th> Quantity Requested </th>
                            <th> Checkout </th>
                        </tr>

                        { this.createItemList() }
                    </tbody>
                </table>
            </div>
        );
    }

}
export default Hardware;
