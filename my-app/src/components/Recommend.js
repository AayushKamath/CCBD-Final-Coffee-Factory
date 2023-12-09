// components/Recommend.js
import { Heading } from '@aws-amplify/ui-react';
import {Button, Card, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import { useState } from 'react';
import {Auth} from "aws-amplify";

export function Recommend() {
  const [shops, setShops] = useState([{}]);
  const navigate = useNavigate();

  const routeChange = (name) =>{
    let path = '/shop_' + name;
    navigate(path);
  }

  function handleGetRecommendations() {
    Auth.currentAuthenticatedUser().then( (cognito_user) => {
      console.log(cognito_user['username'])
      console.log(cognito_user['attributes']['nickname'])
      var apigClientFactory = require('aws-api-gateway-client').default;
      var apigClient = apigClientFactory.newClient({
        invokeUrl: 'https://94mh4uplv2.execute-api.us-east-1.amazonaws.com/coffeevv2',   // REQUIRED
        region: 'us-east-1',                                                             // REQUIRED
        accessKey: 'AKIATOXDJB3BTYYUGYO6',                                               // REQUIRED
        secretKey: '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',                           // REQUIRED
        apiKey: '2tGqBljnbm2NWPvDMpAre7IxhZoNo4TS3uwaWtNB'                               // REQUIRED
      });
      var pathParams = {
        //This is where path request params go.
        geoLoc: 'hi'
      };
      // Template syntax follows url-template https://www.npmjs.com/package/url-template
      var pathTemplate = '/getRecommendations/{geoLoc}'
      var method = 'GET';
      var additionalParams = {
        queryParams: {
          userid: cognito_user.username,
          preference: cognito_user['attributes']['nickname']
        }
      };
      var body = {
        //This is where you define the body of the request
      };

      apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function(result){
          //This is where you would put a success callback
          console.log("getRecommendation GOOD")
          console.log(result)
          console.log(result['data']['shops'])
          setShops(result['data']['shops'])

        }).catch( function(result){
          //This is where you would put an error callback
          console.log("BAD")
          console.log(result)
      });
    })
  }
  if (Object.keys(shops[0]).length === 0) {
    return (
      <div>
        <br/>
        <Heading level={2}>Your Personalized Recommendations</Heading>
        <br/>
        <Button onClick={handleGetRecommendations}>Get Recomendations</Button>
      </div>
    );
  } else {
    return (
      <div>
        <br/>
        <Heading level={2}>Your Personalized Recommendations</Heading>
        <br/>
        <br/>
        <Row xs={1} md={4} className="g-4">
          {shops.map((value, idx) => (
            <Col>
              <Card>
                <Card.Img variant="top" src={value['imageUrl']}/>
                <Card.Body>
                  <Card.Title>{value['shopid']}</Card.Title>
                  <Card.Text>
                    {value['address']}<br/>
                    {value['rating'].toFixed(2)} / 5 ({value['numrating']})<br/>
                  </Card.Text>
                  <Button variant="primary" onClick={() => routeChange(value['shopid'])}>See Reviews</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}