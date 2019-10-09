from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)
@app.route('/', methods=['GET'])
def get_items():
    db = requests.get("https://api.myjson.com/bins/16uxbr").json()
    print(db)
    return db


@app.route('/checkout', methods = ['POST'])
def new_checkout():
    # Base Data
    checkout_request = request.get_json()
    db = requests.get("https://api.myjson.com/bins/16uxbr").json()

    # Variables for Query / Modification
    item_checked_out = checkout_request['checkout']['name']
    quantity_checked_out = checkout_request['checkout']['quantity']
    item = [x for x in db['items'] if x['name'] == item_checked_out][0]

    # Actual Changes
    item['quantity'] -= int( quantity_checked_out)
    db['checkouts'].append(checkout_request)

    #Recommit to DB
    requests.put("https://api.myjson.com/bins/16uxbr", json = db)
    return "done"



if __name__ == "__main__":
    app.run()