import pymongo
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("mongodb://localhost:27017/")

@app.route('/', methods=['GET'])
def get_items():
    db = client["hackerspace"]
    items = db["items"]
    items_list = []
    for document in items.find({}, projection={"_id": False}):
        items_list.append(document)
    return jsonify(items_list)


@app.route('/checkout', methods=['POST'])
def new_checkout():
    # Base Data
    checkout_request = request.get_json()
    db = client["hackerspace"]
    items = db["items"]
    checkouts = db["checkouts"]

    # Variables for Query / Modification
    item_checked_out = checkout_request['checkout']['name']
    quantity_checked_out = checkout_request['checkout']['quantity']


    # Actual Changes
    for document in items.find({}, projection = {"_id" : False}):
        if document["name"] == item_checked_out:  # Change amount available in ledger
            items.update_one(document, {"$set": { "quantity": document["quantity"] - quantity_checked_out } } )   # Change amount available in ledger
            break

    exist = 0
    user = {}
    for document in checkouts.find({}, projection={"_id": False}): # Identify if this is a new or old user.
        if document["netId"] == checkout_request['netId']:
            exist = 1
            user = document
            break

    if exist == 0:  # If this is a new user...
        user_checkout = {
            "name": checkout_request['name'],
            "netId": checkout_request['netId'],
            "class": checkout_request['class'],
            "email": checkout_request['email'],
            "checkout": [checkout_request['checkout']]
        }
        db["checkouts"].insert_one(user_checkout)

    else:  # If this is an existing user...
        checked_out = 0
        edit_checkout = []
        for checkout in user["checkout"]: # If the user already has some of this item checked out...
            if checkout["name"] == checkout_request['checkout']['name']:
                checked_out = 1
                checkout["quantity"] = checkout["quantity"] + checkout_request['checkout']['quantity']
                print(checkout["quantity"])
            edit_checkout.append(checkout)
        if checked_out == 0:  # If the user has never checked this item out before...
            edit_checkout.append(checkout_request['checkout'])
        for document in checkouts.find({}, projection={"_id": False}):  # Identify if this is a new or old user.
            if document["netId"] == checkout_request['netId']:
                checkouts.update(document, {"$set": {"checkout": edit_checkout} })
    return "done"


@app.route('/checkin', methods=['POST'])
def check_in():
    # Base Data
    checkin_request = request.get_json()
    db = client["hackerspace"]
    items = db["items"]
    checkouts_collection = db["checkouts"]

    # Variables for Modification
    item_check_in = checkin_request['item']
    quantity_check_in = checkin_request['quantity']

    # Validation Checks

    user = {}
    len = 0
    for document in checkouts_collection.find({}, projection={"_id": False}):
        if document["netId"] == checkin_request['netId']:
            len = 1
            user = document
            break
    # If the user is not found...
    if len == 0:
        return "User not found in database"
    else:
        taken = 0
        update_checkout = []
        checkin_item = {}
        for checkouts in user["checkout"] :
            taken = 1
            checkin_item = checkouts



        if taken == 0:  # If the user has never checked this item out before...
            return "Item not checked out by user"
        else:  # If the user already has some of this item checked out...
            if checkin_item["quantity"] < checkin_request['quantity']:
                return "User only has " + str(checkin_item['quantity']) + " items checked out"
            else:
                for checkout in user["checkout"]:
                    if checkout["name"] == checkin_request['item']:
                        checkout["quantity"] = checkout["quantity"] - quantity_check_in
                        if checkout["quantity"] == 0:    #If there is no more items checked out
                            continue

                    update_checkout.append(checkout)

            for document in items.find({}, projection={"_id": False}):
                if document["name"] == item_check_in:
                    items.update_one(document, {"$set": {"quantity": document["quantity"] + quantity_check_in}})
                    break

            for document in checkouts_collection.find({}, projection={"_id": False}):
                if document["netId"] == checkin_request['netId']:
                    checkouts_collection.update(document, {"$set": {"checkout": update_checkout}})
                    return "done"
    return "done"


@app.route('/dashboard', methods=['GET'])
def get_checkins():
    db = client["hackerspace"]
    checkouts = []
    for document in db["checkouts"].find({}, projection={"_id": False}):
        checkouts.append(document)
    response = {"checkouts": checkouts}

    return jsonify(response)


if __name__ == "__main__":
    app.run()