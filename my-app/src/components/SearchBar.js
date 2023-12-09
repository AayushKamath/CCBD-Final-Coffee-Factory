import React from 'react';
import { Form, Button, Col, Row, InputGroup } from "react-bootstrap";

export const Search = ({ handleSubmit, handleChange, inputs }) => {
  return (
  <Form onSubmit={handleSubmit}>
    <Row className="justify-content-md-center">
      <Col xs="auto">
        <InputGroup className="mb-2">
          <InputGroup.Text>Address</InputGroup.Text>
          <Form.Control
            required
            type="text" 
            name="address" 
            value={inputs.address || ""} 
            onChange={handleChange}
            placeholder="177A Bleecker Street"
          />
        </InputGroup>
      </Col>
      <Col xs="auto">
        <InputGroup className="mb-2">
          <InputGroup.Text>Filter</InputGroup.Text>
          <Form.Select aria-label="Default select example" selectvalue={inputs.filter} onChange={handleChange} name="filter" required>
            {/* required */}
            {/* defaultValue = "Overall" */}
            {/* <option defaultValue="Overall"> </option> */}
            <option value=""></option>
            <option value="overall">Overall</option>
            <option value="coldbrew">Cold Brew</option>
            <option value="espresso">Espresso</option>
            <option value="cappuccino">Cappuccino</option>
            <option value="service">Service</option>
            <option value="ambiance">Ambiance</option>
            <option value="value">Value</option>


          </Form.Select>
        </InputGroup>
      </Col>
      <Col xs="auto">
        <InputGroup className="mb-2">
          <InputGroup.Text>Distance(km)</InputGroup.Text>
          <Form.Control
            required
            type="number"
            name="distance"
            value={inputs.distance || ""}
            onChange={handleChange}
            placeholder="5"
          />
        </InputGroup>
      </Col>
      <Col xs="auto">
        <Button type="search" className="mb-2">
          Search
        </Button>
      </Col>
    </Row>
  </Form>    
  );
};

export default Search;
