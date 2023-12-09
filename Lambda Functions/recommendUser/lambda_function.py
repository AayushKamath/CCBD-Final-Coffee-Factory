import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
def lookup_data(key, db=None, table='users'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.get_item(Key=key)
        print('key is', key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        # print(response['Item'])
        return response['Item']
def get_recommendation(db= None, table = 'CoffeeShops'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        # how many shops do we need to report
        response = table.scan(ProjectionExpression = 'shopid, analysis, address, numrating, rating, shopname, imageUrl')
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        print("response recommend:", response['Items'])
        return response['Items']
        
def lambda_handler(event, context):
    # TODO implement
    print(event)
    userId = event['queryStringParameters']['userid']
    userFav = event['queryStringParameters']['preference']
    print("type of userFav:", type(userFav))
    print("user preference:", userFav)
    userdata = lookup_data({'userid':userId})
    useranalysis = userdata['analysis']
    useranalysis = dict(sorted(useranalysis.items(), key=lambda item: item[1]))
    print("hello:", useranalysis)
    tops = list(useranalysis.keys())[4:]
    print("top two:", tops)
    shopdata = get_recommendation()
    print(shopdata)
    # shopdata = dict(sorted(shopdata, key=lambda item: item[1][tops[0]] + item[1][tops[1]]))
    # print("shopdata:", shopdata)
    shopanalysis = sorted(shopdata, key=lambda d: d['analysis'][tops[0]]+d['analysis'][tops[1]]+d['analysis'][userFav], reverse = True) 
    print("shopanalysis:", shopanalysis)
    response = {}
    response['shops'] = []
    for i in range(len(shopanalysis)):
        t = lookup_data({'shopid':shopanalysis[i]['shopid']}, table = 'CoffeeShops')
        response["shops"].append({})
        response["shops"][i]["shopid"] = t["shopid"]
        response["shops"][i]["shopname"] = t["shopname"]
        response["shops"][i]["address"] = t["address"]
        response["shops"][i]["numrating"] = float(t["numrating"])
        response["shops"][i]["rating"] = float(t["rating"])
        response["shops"][i]["imageUrl"] = t["imageUrl"]
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        'body': json.dumps(response)
    }
