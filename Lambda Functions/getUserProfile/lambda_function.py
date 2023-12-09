import json
import boto3
from botocore.exceptions import ClientError
def lookup_data(key, db=None, table='users'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.get_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        # print(response['Item'])
        return response['Item']
        
def lambda_handler(event, context):
    # TODO implement
    userId = event['queryStringParameters']['userid']
    print(userId)
    userdata = lookup_data({'userid':userId})
    print(userdata['userid'])
    print(userdata['likes'])
    print(userdata['reviews'])
    response = {}
    response['userid'] = userdata['userid']
    response['likes'] = userdata['likes']
    response['reviews'] = userdata['reviews']
    # imageUrls = []
    for likedShop in response['likes']:
        shop_data = lookup_data(key=likedShop, table='CoffeeShops')
        likedShop['imageUrl'] = shop_data['imageUrl']
        
    #     imageUrls.append(shop_data['imageUrl'])
    # response['imageUrls'] = imageUrls
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        'body': json.dumps(response)
    }
