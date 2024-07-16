import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { db } from '../firebase'; // Import Firestore from Firebase
import { collection, addDoc } from 'firebase/firestore';

const NonSkilledJobApplicationForm = ({ job, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!firstName || !lastName || !email || !phone || !address) {
      setAlert('All fields are required');
      return;
    }

    setUploading(true); // Start uploading, set loading state

    try {
      // Add application data to Firestore
      const docRef = await addDoc(collection(db, 'applications'), {
        firstName,
        lastName,
        email,
        phone,
        address,
        jobId: job.id,
        jobTitle: job.title,
        jobType: 'non-skilled',
      });

      console.log('Application submitted successfully with ID: ', docRef.id);
      setAlert('Application submitted successfully...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      // onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error submitting application: ', error);
      setAlert('Error submitting application');
    } finally {
      setUploading(false); // Upload complete, set loading state to false
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {alert && <Alert variant="danger">{alert}</Alert>}
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="phone">
        <Form.Label>Phone number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your Address detail"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="d-block mx-auto mt-2" disabled={uploading}>
        {uploading ? (
          <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          'Submit Application'
        )}
      </Button>
    </Form>
  );
};

export default NonSkilledJobApplicationForm;