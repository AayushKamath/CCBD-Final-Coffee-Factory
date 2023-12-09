import json
from botocore.exceptions import ClientError
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
from decimal import Decimal, getcontext

# def update_review(key, feature, db=None, table='users'):
#     if not db:
#         db = boto3.resource('dynamodb')
#     table = db.Table(table)
#     del feature["userid"]
#     print(feature)
    
#     response = table.update_item(
#         Key=key,
#         UpdateExpression="SET reviews = list_append(reviews, :i)",
#         ExpressionAttributeValues={
#             ':i': [feature],
            
#         },
#         ReturnValues="UPDATED_NEW"
#     )
#     print(response)
#     return response

# def update_review(key, feature, db=None, table='shops'):
#     if not db:
#         db = boto3.resource('dynamodb')
#     table = db.Table(table)
#     del feature["shopid"]
#     # print(feature)
    
#     response = table.update_item(
#         Key={'shopid': key},
#         UpdateExpression="SET reviews = list_append(reviews, :i)",
#         ExpressionAttributeValues={
#             ':i': [feature],
            
#         },
#         ReturnValues="UPDATED_NEW"
#     )
#     print(response)
#     return response
    
def lookup_data(key, db=None, table='CoffeeShops'):
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
    
# def update_count()
#     response = table.update_item(
#         Key={'userid': key},
#         UpdateExpression="SET Price = Price + :p"",
#         ExpressionAttributeValues={
#             ':i': [feature],
            
#         },
#         ReturnValues="UPDATED_NEW"
#     )

def update_item(key, new_count, review, new_rating, db=None, table='CoffeeShops'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    # change student location
    response = table.update_item(
        Key={'shopid': key},
        UpdateExpression="set #feature=:f, numrating = numrating + :p, reviews = list_append(reviews, :i), rating = :r",
        ExpressionAttributeValues={
            ':f': new_count,
            ":p": 1,
            ':i': [review],
            ':r': new_rating
        },
        ExpressionAttributeNames={
            "#feature": "analysis"
        },
        ReturnValues="UPDATED_NEW"
    )
    print(response)
    return response

    
def analyze(review):
    review = review.lower()
    coldbrew = ['cold-brew', 'cold brew']
    cappuccino = ['cappuccino']
    espresso = ['espresso']
    service = ['nice', 'friendly', 'service', 'patient']
    ambiance = ['study', 'ambiance', 'quite', 'vibe', 'chill']
    value = ['worth', 'cheap', 'value', 'price']
    filternames = ['coldbrew', 'cappuccino', 'espresso', 'service', 'ambiance', 'value']
    filters = [coldbrew, cappuccino, espresso, service, ambiance, value]

    counts = {
        'coldbrew': 0,
        'cappuccino': 0,
        'espresso': 0,
        'service': 0,
        'ambiance': 0,
        'value': 0
    }

    for i in range(len(filters)):
        category_count = 0
        for keyword in filters[i]:
            keyword_count = review.count(keyword)
            # print(keyword, keyword_count)
            category_count = category_count + keyword_count
        # print("\n")

        counts[filternames[i]] = counts[filternames[i]] + category_count
        
    # print(counts)

    return counts

    

def lambda_handler(event, context):
    # TODO implement
    print(event)
    shopid = event['shopid']
    del event["shopid"]
    review = event
    # update_review(shopid, event)
    res = lookup_data({'shopid': shopid})
    
    # print(type(res['numrating']))
    old_numratings = res['numrating']
    old_rating = res['rating']
    old_count = (res['analysis'])
    new_count = analyze(event['review'])
    review_rating = Decimal(event['rating'])
    # print('old_counts: ',  old_count)
    # print('new_counts: ', new_count)
    new_count['espresso'] += int(old_count['espresso'])
    new_count['coldbrew'] += int(old_count['coldbrew'])
    new_count['cappuccino'] += int(old_count['cappuccino'])
    new_count['value'] += int(old_count['value'])
    new_count['service'] += int(old_count['service'])
    new_count['ambiance'] += int(old_count['ambiance'])
    
    # print('old_numratings:', old_numratings, 'old_rating:', old_rating)
    new_rating = round((old_numratings*old_rating + review_rating) / (old_numratings + 1), 4)
    
    print(new_rating)
    # print(type(new_rating))
    
    
    # print('new_numratings:', old_numratings + 1, 'new_rating:', new_rating)
    update_item(shopid, new_count, review, new_rating)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
