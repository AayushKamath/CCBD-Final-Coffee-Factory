// components/Profile.js
import { useState, useEffect, createRef } from 'react'
import { TextField, Heading, Flex, SelectField, useAuthenticator} from '@aws-amplify/ui-react';
import { Button, Container, Col, Row, Card} from "react-bootstrap";
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { route } = useAuthenticator((context) => [context.route]);

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [nickname, setNickname] = useState('')
  const [user, setUser] = useState([{}]);
  // const [picture, setPicture] = useState('')

  let nameRef = createRef();
  let addressRef = createRef();
  let nicknameRef = createRef();
  // let pictureRef = createRef();

  async function update() {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      name: nameRef.current.value
    });
    await Auth.updateUserAttributes(user, {
      address: addressRef.current.value
    });
    await Auth.updateUserAttributes(user, {
      nickname: nicknameRef.current.value
    });
    setNickname(nicknameRef.current.value)
    // await Auth.updateUserAttributes(user, {
    //   picture: picture.current.value
    // })
  }


  useEffect(() => {
    Auth.currentUserInfo().then( (data) => {
      setName(data.attributes.name)
      setEmail(data.attributes.email)
      setPhoneNumber(data.attributes.phone_number)
      setAddress(data.attributes.address)
      setNickname(data.attributes.nickname)
    }
  )})

  function handleGetLikes() {
    Auth.currentAuthenticatedUser().then( (cognito_user) => {
      console.log(cognito_user.username)
      var apigClientFactory = require('aws-api-gateway-client').default;
      var apigClient = apigClientFactory.newClient({
        invokeUrl: 'https://94mh4uplv2.execute-api.us-east-1.amazonaws.com/coffeevv2',   // REQUIRED
        region: 'us-east-1',                                                            // REQUIRED
        accessKey: 'AKIATOXDJB3BTYYUGYO6',                                              // REQUIRED
        secretKey: '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',                          // REQUIRED
        apiKey: '2tGqBljnbm2NWPvDMpAre7IxhZoNo4TS3uwaWtNB'                              // REQUIRED
      });
      var pathParams = {
        //This is where path request params go.
      };
      // Template syntax follows url-template https://www.npmjs.com/package/url-template
      var pathTemplate = '/getLikes'
      var method = 'GET';
      var additionalParams = {
        //If there are query parameters or headers that need to be sent with the request you can add them here
        headers: {
        },
        queryParams: {
          userid: cognito_user.username
        }
      };
      var body = {
        //This is where you define the body of the request
      };

      apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then(function(result){
          //This is where you would put a success callback
          console.log("getLikes GOOD")
          console.log(result)
          setUser(result['data']['likes'])
        }).catch( function(result){
          //This is where you would put an error callback
          console.log("BAD")
          console.log(result)
      });

    })
  }

  const navigate = useNavigate();

  const routeChange = (name) =>{
    let path = '/shop_' + name;
    navigate(path);
  }


  const message =
    route === 'authenticated' ? 'Profile Page' : 'Loading...';

  if (Object.keys(user[0]).length === 0) {
    return (
      <div>
        <Heading level={1}>{message}</Heading>
        <Container>
          <br/>
          <br/>
          <Row>
            <Col sm={4} className="bg-light border">
              <br/>
              <Heading level={3}>Edit Profile</Heading>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField ref={nameRef} label="Name" defaultValue={name}/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField ref={addressRef} label="Address" defaultValue={address}/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField defaultValue={email} isReadOnly="true" label="Email"/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField defaultValue={phoneNumber} isReadOnly="true" label="Phone Number"/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <SelectField ref={nicknameRef} label="Change Favorite Type of Coffee">
                  <option>{nickname}</option>
                  <option value="coldbrew">coldbrew</option>
                  <option value="espresso">espresso</option>
                  <option value="cappuccino">cappuccino</option>
                </SelectField>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <Button onClick={update}>Update</Button>
              </Flex>
              <br/>
              <br/>
            </Col>
            <Col sm={8}>
              <Heading level={3}>Likes</Heading>
              <Button onClick={handleGetLikes}>GetLikes</Button>
              <br/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div>
        <Heading level={1}>{message}</Heading>
        <Container>
          <br/>
          <br/>
          <Row>
            <Col sm={4} className="bg-light border">
              <br/>
              <Heading level={3}>Edit Profile</Heading>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField ref={nameRef} label="Name" defaultValue={name}/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField ref={addressRef} label="Address" defaultValue={address}/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField defaultValue={email} isReadOnly="true" label="Email"/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <TextField defaultValue={phoneNumber} isReadOnly="true" label="Phone Number"/>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <SelectField ref={nicknameRef} label="Change Favorite Type of Coffee">
                  <option>{nickname}</option>
                  <option value="coldbrew">coldbrew</option>
                  <option value="espresso">espresso</option>
                  <option value="cappuccino">cappuccino</option>
                </SelectField>
              </Flex>
              <br/>
              <Flex style={{justifyContent: 'center'}}>
                <Button onClick={update}>Update</Button>
              </Flex>
              <br/>
              <br/>
            </Col>
            <Col sm={8}>
              <Heading level={3}>Likes</Heading>
              <Button onClick={handleGetLikes}>Get Likes</Button>
              <br/>
              <Row xs={1} md={4} className="g-4">
                {user.map((value, idx) => (
                  <Col>
                    <Card>
                      <Card.Img variant="top" src={value['imageUrl']}/>
                      <Card.Body>
                        <Card.Title>{value['shopid']}</Card.Title>
                        {/*<Card.Text>*/}
                        {/*  This is a longer card with supporting text below as a natural*/}
                        {/*  lead-in to additional content. This content is a little bit longer.*/}
                        {/*</Card.Text>*/}
                        <Button variant="primary" onClick={() => routeChange(value['shopid'])}>See Reviews</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <br/>
              <br/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}