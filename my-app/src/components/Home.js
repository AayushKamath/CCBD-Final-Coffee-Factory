// components/Home.js
import React from 'react';
import {Button, Col, Row, Card, Badge} from "react-bootstrap";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import {Heading} from "@aws-amplify/ui-react";


export function Home() {
  const [inputs, setInputs] = useState({});
  const [curfilter, setCurFilter] = useState("");
  const [shops, setShops] = useState([{}]);
  const [status, setStatus] = useState("");
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  const navigate = useNavigate();

  const routeChange = (name) =>{
    let path = '/shop_' + name;
    navigate(path);
  }

  function handleSearchUserQuery(event) {
    console.log(inputs)
    event.preventDefault();
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
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/searchUserQuery'
    const method = 'GET';
    var additionalParams = {
      queryParams: {
        address: inputs['address'],
        filter: inputs['filter'],
        distance: inputs['distance']
      }
    };
    // var additionalParams = inputs
    var body = {
      //This is where you define the body of the request
    };
    apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
      .then(function(result){
        //This is where you would put a success callback
        console.log("searchUserQuery GOOD")
        console.log(result)

        if(result['data'] === 'Wrong Address!' || result['data'] === 'no result') {
          console.log(result['data'])
          setStatus(result['data'])
          return
        }
        console.log(result)

        // console.log(result['data']['shops'])
        setShops(result['data']['shops'])
        setStatus("")
        setCurFilter(inputs.filter)
      }).catch( function(result){
        //This is where you would put an error callback
        console.log("searchUserQuery")
        console.log(result)
      });
  }

  if (Object.keys(shops[0]).length === 0) {
    return (
      <div>
        <Heading level={2}>Dashboard</Heading>
        <br/>
        <SearchBar
          handleSubmit={handleSearchUserQuery}
          handleChange={handleChange}
          inputs={inputs}>
        </SearchBar>
        <h3 className='text-danger'>{status}</h3>
      </div>
    );
  } else if (status !== "") {
    return (
      <div>
        <Heading level={2}>Dashboard</Heading>
        <br/>
        <SearchBar
          handleSubmit={handleSearchUserQuery}
          handleChange={handleChange}
          inputs={inputs}>
        </SearchBar>
        <h3 className='text-danger'>{status}</h3>

      </div>
    )
  } else {
    console.log(shops);
    return (
      <div>
        <br/>
        <SearchBar
          handleSubmit={handleSearchUserQuery}
          handleChange={handleChange}
          inputs={inputs}>
        </SearchBar>
        <br/>
        <Row xs={1} md={4} className="g-4">
          {
            shops.map((value, idx) => (
            <Col>
              <Card>
                <Card.Img variant="top" src={value['imageUrl']} />
                <Card.Body>
                  <Card.Title>{value['shopname']}</Card.Title>
                  <Card.Text>
                    {value['address']}<br/>

                    <Badge bg="warning" text="dark">
                      Distance: {value['distance']} km
                    </Badge>{' '}<br/>


                    {/*<Badge bg="primary" pill>*/}
                    {/*  Overall: {value['rating']} / 5 ({value['numrating']})*/}
                    {/*</Badge>*/}
                    {curfilter === "overall" &&
                      <Badge bg="info" pill>
                        {curfilter}: {value['rating'].toFixed(2)} / 5 ({value['numrating']} ratings)
                      </Badge>
                    }
                    {curfilter !== "overall" &&
                      <Badge bg="info" pill>
                        {curfilter}: {value['analysis'][curfilter]} ({value['numrating']} ratings)
                      </Badge>
                    }

                    <br/>
                    {/*{value['rating']} / 5 ({value['numrating']})<br/>*/}
                  </Card.Text>

                  <Button variant="primary" onClick={() => routeChange(value['shopname'])}>See Reviews</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

    </div>
    )
  }
}