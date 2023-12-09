import json
from botocore.exceptions import ClientError
import boto3
from boto3.dynamodb.conditions import Key, Attr
    
# def update_likes(key, feature, db=None, table='users'):
#     if not db:
#         db = boto3.resource('dynamodb')
#     table = db.Table(table)
    
#     del feature['userid']
#     print(feature)
    
#     response = table.update_item(
#         Key={'userid': key},
#         UpdateExpression="SET likes = list_append(likes, :i)",
#         ExpressionAttributeValues={
#             ':i': [feature],
            
#         },
#         ReturnValues="UPDATED_NEW"
#     )
#     print(response)
#     return response

    
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
    
def update_item(key, user_count, likes, db=None, table='users'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    # change student location
    response = table.update_item(
        Key={'userid': key},
        UpdateExpression="set #feature=:f, likes = list_append(likes, :i)",
        ExpressionAttributeValues={
            ':f': user_count,
            ':i': [likes]
        },
        ExpressionAttributeNames={
            "#feature": "analysis"
        },
        ReturnValues="UPDATED_NEW"
    )
    # print(response)
    return response

def lambda_handler(event, context):
    # TODO implement
    print('event: ', event, "\n")
    userid = event['userid']
    shopid = event['shopid']

    user = lookup_data({'userid': userid})
    user_likes = user['likes']
    print('user_likes: ', user_likes, "\n")
    map = {'shopid': shopid}
    if map in user_likes:
        print("already liked!")
        return {
            'statusCode': 200,
            'body': json.dumps('Already Liked!')
        }
    # update_likes(userid, event)
    user_count = user['analysis']
    shop_count = lookup_data({'shopid': shopid}, table='CoffeeShops')['analysis']
    user_count['espresso'] += int(shop_count['espresso'])
    user_count['coldbrew'] += int(shop_count['coldbrew'])
    user_count['cappuccino'] += int(shop_count['cappuccino'])
    user_count['value'] += int(shop_count['value'])
    user_count['service'] += int(shop_count['service'])
    user_count['ambiance'] += int(shop_count['ambiance'])
    
    del event['userid']
    likes = event
    update_item(userid, user_count, likes)
    

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
