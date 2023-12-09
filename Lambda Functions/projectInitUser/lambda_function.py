import json
from botocore.exceptions import ClientError
import boto3
from boto3.dynamodb.conditions import Key, Attr

def insert_data(data_list, db=None, table='users'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    # overwrite if the same index is provided
    for data in data_list:
        response = table.put_item(Item=data)
    # print('@insert_data: response', response)
    return response

def lambda_handler(event, context):
    # TODO implement
    print(event)
    item = {
        "userid": event['userName'],
        "analysis": {
            "coldbrew": 0,
            "cappuccino": 0,
            "espresso": 0,
            "service": 0,
            "ambiance": 0,
            "value": 0
            
        },
        "likes": [],
        "reviews": []
    }
    insert_data([item])
    # context.succeed(event)
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }
    return event
