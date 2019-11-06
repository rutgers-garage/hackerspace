import React from 'react';
import './App.css';

class CheckoutTable extends React.Component {
  
    // React Constructor
    constructor(){
        super();

        this.wow = this.wow.bind(this);
    }

    wow(event){
        event.preventDefault();
        let user = this.props.netid;
        let item = event.target.name.value;
        let quantityOut = event.target.quantityout.value;
        let quantityReturned = event.target.quantityreturned.value;

        let body =  {
            netId: user, 
            item: item, 
            quantity: quantityReturned
        };
        
        console.log(body);
        
        fetch("https://5ddfcb0f.ngrok.io/checkin", {
            'method': 'POST',
            'mode': 'cors',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(body)
        }).then( (res) => console.log(res) );

    }

    buildCheckout(){
        let x = [];
        let items = this.props.checkout;
        console.log(items);
                
        for(let i = 0; i < items.length; i++){

            let element = (
                <form onSubmit = {this.wow} key = {i}>
                    <div className =  "list-item">
                        <input onChange = { this.handleChange } type="text" name="name" value = {items[i].name} readOnly = "readonly"/>
                        <input onChange = { this.handleChange } type="text" name="quantityout" value = {items[i].quantity} readOnly = "readonly"/>
                        <input onChange = { this.handleChange } type="text" name="quantityreturned" />
                        <input type="submit" value="Checkout"/>
                    </div>
                </form>
            )

            x.push(element);
        }

        return x;
    }
    
    render(){
        return (
            <div>
               {this.buildCheckout()}
            </div>
        );
    }
}

export default CheckoutTable;
