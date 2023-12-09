import json
import boto3
from botocore.exceptions import ClientError
# ID: string,
# Name: string,
# NumReviews: number,
# AverageRating: number,
# Analysis: {
#     Cold-brew: number
#     Ambiance: number
#     Value: number
# }
# S3Image: {
#     Bucket: string,
#     Key: string
# }

def lookup_data(key, db=None, table='CoffeeShops'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.get_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        print(response['Item'])
        return response['Item']
        
def lambda_handler(event, context):
    # TODO implement
    shopid = event['queryStringParameters']['shopid']
    print(shopid)
    shopdata = lookup_data({'shopid':shopid})
    print(shopdata)
    print(shopdata['shopid'])
    print(shopdata['reviews'])
    response = {}
    response['shopid'] = shopdata['shopid']
    response['reviews'] = shopdata['reviews']
    for i in range(len(response['reviews'])):
        response['reviews'][i]['rating'] = float(response['reviews'][i]['rating'])
    response['analysis'] = shopdata['analysis']
    for key in response['analysis']:
        response['analysis'][key] = float(response['analysis'][key])
    response['shopname'] = shopdata['shopname']
    response['numrating'] = float(shopdata['numrating'])
    response['rating'] = float(shopdata['rating'])
    response['address'] = shopdata['address']
    response['imageUrl'] = shopdata['imageUrl']

    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        'body': json.dumps(response)
    }
