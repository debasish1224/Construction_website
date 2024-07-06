import React from 'react';
import { Form, Button } from 'react-bootstrap';

const JobApplicationForm = ({ job, onClose }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted!');
    onClose(); // Close modal after submission
  };

  return (
    <Form onSubmit={handleSubmit} >
      <Form.Group controlId="formName">
        <Form.Label> First Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your First name" required />
      </Form.Group>

      <Form.Group controlId="formName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your Last name" required />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter your email" required />
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Label>Phone number</Form.Label>
        <Form.Control type="tel" placeholder="Enter your phone number" required />
      </Form.Group>

      <Form.Group controlId="formName">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="Enter your Address detail" required />
      </Form.Group>

      <Form.Group controlId="formResume">
        <Form.Label>Upload Resume</Form.Label>
        <Form.Control type="file" accept=".pdf,.doc,.docx" required />
      </Form.Group>
<br></br> <br></br>
      <Button variant="primary" type="submit" className="d-block mx-auto">
        Submit Application
      </Button>
    </Form>
  );
};

export default JobApplicationForm;
