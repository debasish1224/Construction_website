import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../Css/Contact.css'; // Import your custom CSS for Contact styling

const Contact = () => {
  return (
    <div className="contact-page">
      <Container className="my-5">
        <h2 className="text-center mb-4">Get in Touch</h2>
        <Row>
          {/* Contact Form */}
          <Col lg={6}>
            <div className="contact-form">
              <h3>Contact Us</h3>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>

                <Form.Group controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" placeholder="Enter subject" />
                </Form.Group>

                <Form.Group controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Enter your message" />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>

          {/* Contact Information and Map */}
          <Col lg={6}>
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><i className="fas fa-map-marker-alt"></i> Address: post-parsouni ,itkhori ,chatra, Jharkhand-825408, India</p>
              <p><i className="fas fa-envelope"></i> Email: Sannutechinterio24infra@gmail.com</p>
              <p><i className="fas fa-phone"></i> Phone: 8252200480</p>
            </div>
            <div className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387142.8400011041!2d-74.25819513784327!3d40.705831642183215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250e5e4d4f81f%3A0xf38c6e47e3cddc14!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1633564852159!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
