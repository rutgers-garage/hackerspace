from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)
@app.route('/', methods=['GET'])
def get_items():
    db = requests.get("https://api.myjson.com/bins/rqa1u").json()
    print(db)
    return db


@app.route('/checkout', methods = ['POST'])
def new_checkout():
    # Base Data
    checkout_request = request.get_json()
    db = requests.get("https://api.myjson.com/bins/rqa1u").json()

    # Variables for Query / Modification
    item_checked_out = checkout_request['checkout']['name']
    quantity_checked_out = checkout_request['checkout']['quantity']
    item = [x for x in db['items'] if x['name'] == item_checked_out][0]

    # Actual Changes
    item['quantity'] -= quantity_checked_out  # Change amount available in ledger
    user = [x for x in db['checkouts'] if x['netId'] == checkout_request['netId'] ]  # Identify if this is a new or old user.

    if len(user) == 0:  # If this is a new user...
        user_checkout = {
            "name": checkout_request['name'],
            "netId": checkout_request['netId'],
            "class" : checkout_request['class'],
            "email": checkout_request['email'],
            "checkout": [checkout_request['checkout']]
        }
        db['checkouts'].append(user_checkout)

    else :  # If this is an existing user...
        checkout_item = [x for x in user[0]['checkout'] if x['name'] == checkout_request['checkout']['name']]
        if len(checkout_item) == 0 :  # If the user has never checked this item out before...
            user[0]['checkout'].append(checkout_request['checkout'])
        else :  # If the user already has some of this item checked out...
            checkout_item[0]['quantity'] += checkout_request['checkout']['quantity']


    #Recommit to DB
    requests.put("https://api.myjson.com/bins/rqa1u", json = db)
    return "done"



if __name__ == "__main__":
    app.run()
