import json
import boto3
from botocore.exceptions import ClientError
from geopy.geocoders import Nominatim
from geopy import distance
from geopy.exc import GeocoderTimedOut

def searchQuery(db= None, table = 'CoffeeShops'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        # how many shops do we need to report
        response = table.scan(ProjectionExpression = 'shopid, analysis, address, numrating, rating, shopname, locationinfo, shopCid, imageUrl')
        # print(response)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        # print("response recommend:", response['Items'])
        return response['Items']
    
def lambda_handler(event, context):
    # TODO implement
    fil = event['queryStringParameters']['filter']
    address = event['queryStringParameters']['address']
    disfilter = float(event['queryStringParameters']['distance'])
    print(disfilter)
    geolocator = Nominatim(user_agent='myuseragent')
    
    try:
        loc = geolocator.geocode(address, timeout=3)
    except GeocoderTimedOut as e:
        print ("Error", e.response['Error']['Message'])
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            'body': json.dumps("Wrong Address!")
        }
    # Most of the time the error cannot be catch from the exception
    # check if loc equals to None before processing it
    if loc == None:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            'body': json.dumps("Wrong Address!")
        }

    coor = (loc.latitude, loc.longitude)
    fil = fil.replace(" ", "").lower()
    # print("fil from user:", fil)
    lookupresult = searchQuery()
    # print("lookupresult", lookupresult)
    
    if lookupresult and (fil in lookupresult[0]['analysis'] or fil == "overall"):
        response = {}
        response['shops'] = []
        # do filter?
        for i in range(len(lookupresult)):
            shopcoord = (lookupresult[i]["locationinfo"]['latitude'], lookupresult[i]["locationinfo"]['longitude'])
            d = distance.distance(shopcoord, coor).km
            print("d:", d)
            if d > disfilter:
                continue
            else:
                print(lookupresult)
                response['shops'].append({})
                response['shops'][-1]["shopid"] = lookupresult[i]["shopid"]
                response['shops'][-1]["shopname"] = lookupresult[i]["shopname"]
                response['shops'][-1]["address"] = lookupresult[i]["address"]
                response['shops'][-1]["analysis"] = {}
                for k in lookupresult[i]["analysis"]:
                    response['shops'][-1]["analysis"][k] = float(lookupresult[i]["analysis"][k])
                response['shops'][-1]["numrating"] = float(lookupresult[i]["numrating"])
                response['shops'][-1]["rating"] = float(lookupresult[i]["rating"])
                response['shops'][-1]["distance"] = round(d, 3)
                response['shops'][-1]["shopCid"] = lookupresult[i]["shopCid"]
                response['shops'][-1]["imageUrl"] = lookupresult[i]["imageUrl"]
        
        if response['shops']:
            if fil == "overall":
                response['shops'] = sorted(response['shops'], key=lambda d: d['rating'], reverse = True)
            else:
                response['shops'] = sorted(response['shops'], key=lambda d: d['analysis'][fil], reverse = True)
            if len(response['shops']) > 8:
                response['shops'] = response['shops'][:8]
        else:
            response = "no result"
    else:
        response = "no result"
   
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        'body': json.dumps(response)
    }
