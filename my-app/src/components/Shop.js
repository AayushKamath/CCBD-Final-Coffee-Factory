// components/Shop.js
import React from 'react';
import { Form, Button, Col, Row, InputGroup, ListGroup, Badge, Card} from "react-bootstrap";
import { useState } from 'react';
import { useParams } from "react-router-dom";
import {Auth} from "aws-amplify";

var apigClientFactory = require('aws-api-gateway-client').default;
var apigClient = apigClientFactory.newClient({
    invokeUrl: 'https://94mh4uplv2.execute-api.us-east-1.amazonaws.com/coffeevv2',   // REQUIRED
    region: 'us-east-1',                                                             // REQUIRED
    accessKey: 'AKIATOXDJB3BTYYUGYO6',                                               // REQUIRED
    secretKey: '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',                           // REQUIRED
    apiKey: '2tGqBljnbm2NWPvDMpAre7IxhZoNo4TS3uwaWtNB'                               // REQUIRED
});

export function Shop() {
    const [inputs, setInputs] = useState({});
    const [shop, setShop] = useState({});
    const [liked, setLiked] = useState(false);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }
    const { id } = useParams();

    async function handleSubmit(event) {
      event.preventDefault();
      Auth.currentAuthenticatedUser().then( (cognito_user) => {
        let submit = inputs
        submit['userid'] = cognito_user.username
        submit['shopid'] = id
        console.log("submit review: ", submit)

        var pathParams = {
          //This is where path request params go.
        };
        // Template syntax follows url-template https://www.npmjs.com/package/url-template
        var pathTemplate = '/submitReview'
        var method = 'POST';
        var additionalParams = {
          //If there are query parameters or headers that need to be sent with the request you can add them here
        };
        var body = submit

        apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
          .then(function(result){
            //This is where you would put a success callback
            console.log("review GOOD")
            console.log(result)
            console.log(result['data']['body'])
          }).catch( function(result){
            //This is where you would put an error callback
            console.log("BAD")
            console.log(result)
          });
      })
    }

    function handleLike(){
      Auth.currentAuthenticatedUser().then( (cognito_user) => {
        console.log(cognito_user.username)
        let submit = {}
        submit['userid'] = cognito_user.username
        submit['shopid'] = id
        console.log("submit like:", submit)

        var pathParams = {
          //This is where path request params go.
        };
        // Template syntax follows url-template https://www.npmjs.com/package/url-template
        var pathTemplate = '/like'
        var method = 'POST';
        var additionalParams = {
          //If there are query parameters or headers that need to be sent with the request you can add them here
        };
        var body = {
          //This is where you define the body of the request
          "userid": cognito_user.username,
          "shopid": id
        };

        apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
          .then(function(result){
            //This is where you would put a success callback
            console.log("like GOOD")
            console.log(result)
            setLiked(true)
          }).catch( function(result){
            //This is where you would put an error callback
            console.log("BAD")
            console.log(result)
          });
      })
    }

    function handleGetShopDetails() {
      console.log(id)
      Auth.currentAuthenticatedUser().then( (cognito_user) => {
        var pathParams = {
          //This is where path request params go.
          shopName: id
        };
        // Template syntax follows url-template https://www.npmjs.com/package/url-template
        var pathTemplate = '/getShopDetails/{shopName}'
        var method = 'GET';
        var additionalParams = {
          //If there are query parameters or headers that need to be sent with the request you can add them here
          queryParams: {
            shopid: id
          }
        };
        var body = {
          //This is where you define the body of the request
        };

        apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
          .then(function(result){
            //This is where you would put a success callback
            console.log("getShopDetails GOOD")
            console.log(result)
            console.log(result['data'])
            setShop(result['data'])

          }).catch( function(result){
            //This is where you would put an error callback
            console.log("BAD")
            console.log(result)
          });
      })
    }



    if (Object.keys(shop).length === 0) {
        return(
          <div>
              <h1>{id}</h1>
              <Button onClick={handleGetShopDetails}>Show Shop</Button>
          </div>
        )
    } else {
        return (
          <div>
              <Button onClick={handleGetShopDetails}>Refresh Shop</Button>
              <h1>{id}</h1>
              <Card.Img variant="top" style={{ width: '18rem' }} src={shop['imageUrl']} />
              <h2>{shop['address']}</h2>
              <br/>

              <ListGroup horizontal className="justify-content-md-center">
                  <ListGroup.Item>
                      <div className="fw-bold">Overall</div>
                      <Badge bg="primary" pill>
                          {shop['rating'].toFixed(2)} / 5
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Value</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['value']}
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Service</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['service']}
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Ambiance</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['ambiance']}
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Cold Brew</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['coldbrew']}
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Espresso</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['espresso']}
                      </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <div className="fw-bold">Cappuccino</div>
                      <Badge bg="primary" pill>
                          {shop['analysis']['cappuccino']}
                      </Badge>
                  </ListGroup.Item>
              </ListGroup>
              <br/>
              <br/>
              {!liked &&
                <Button variant="primary" onClick={handleLike}>Like</Button>
              }
              {liked &&
                <div>
                    <h3>Already Liked!</h3>
                    <Button variant="primary" disabled onClick={handleLike}>Like</Button>
                </div>
              }
              <br/>
              <br/>

              <h4>Leave a Review!</h4>
              <Form onSubmit={handleSubmit}>
                  <Row className="justify-content-md-center" xs="auto">
                      <Col xs="auto">
                          <InputGroup className="mb-2">
                              <InputGroup.Text>Name</InputGroup.Text>
                              <Form.Control
                                required
                                type="text"
                                name="name"
                                value={inputs.name || ""}
                                onChange={handleChange}
                                placeholder="Erik Lehnsherr"
                              />
                          </InputGroup>
                      </Col>
                      <Col xs="auto">
                          <InputGroup className="mb-2">
                              <InputGroup.Text>Rating</InputGroup.Text>
                              <Form.Select aria-label="Default select example" selectvalue={inputs.rating}
                                           onChange={handleChange} name="rating" required>
                                  <option value=""></option>
                                  <option value="1">1 Star</option>
                                  <option value="2">2 stars</option>
                                  <option value="3">3 stars</option>
                                  <option value="4">4 stars</option>
                                  <option value="5">5 stars</option>
                              </Form.Select>
                          </InputGroup>
                      </Col>
                  </Row>
                  <Row className="justify-content-md-center" lg={2}>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            required
                            type="text"
                            name="review"
                            value={inputs.review || ""}
                            onChange={handleChange}
                            placeholder="I love this coffee!"
                          />
                      </Form.Group>
                  </Row>
                  <Row className="justify-content-md-center" xs="auto">
                      <Button type="search" className="mb-2">
                          Post
                      </Button>
                  </Row>
              </Form>

              <br/>
              <br/>
              <h4>User Reviews ({shop['numrating']} Total)</h4>
              {shop['reviews'].slice(0).reverse().map((value, idx) => (
                <row>
                    <Card>
                        <Card.Header as="h5">{value.name}</Card.Header>
                        <Card.Body>
                            <Card.Title>{value.rating.toFixed(2)} / 5</Card.Title>
                            <Card.Text>
                                {value.review}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </row>

              ))}
          </div>
        );
    }
}