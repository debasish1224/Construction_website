import React, { useState } from 'react';
import { Container, Row, Col, Modal, Form, Button, Alert,Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/Footer.css'; // Import your custom CSS for Footer styling
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth functions

const Footer = ({ auth }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('');
  const [uploading, setUploading] = useState(false);
  const history = useNavigate();

  const handleClose = () => {
    setShowLoginModal(false);
    setEmail('');
    setPassword('');
    setAlert('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setUploading(true); // Start uploading, set loading state
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAlert('');
      handleClose();
      history('/admin'); // Redirect to admin page on successful login
    } catch (error) {
      console.error("Login error:", error);
      setAlert('Invalid email or password');
    }finally {
      setUploading(false); // Upload complete, set loading state to false
    }
  };

  return (
    <footer className="footer-container text-center text-lg-start text-white">
      <Container className="p-4">
        {/* Grid container for footer content */}
        <Row>
          {/* Company Logo and Name */}
          <Col lg={3} md={6} className="mb-4 mb-md-0 text-lg-start text-md-center">
            <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/images/Logo.jpg`} alt="SannuTech Construction Logo" height={50} />

            </div>
            <p className="text-uppercase mt-3 footer-text">SannuTech Construction</p>
            <p>
              <span className="text-primary text-decoration-none" onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }}>
                Admin Login
              </span>
            </p>
          </Col>

          {/* Contact Information */}
          <Col lg={4} md={6} className="mb-4 mb-md-0 text-center">
            <h5 className="text-uppercase footer-text">Contact Us</h5>
            <ul className="list-unstyled mb-0 footer-text">
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>Address:  at +post-parsouni ,itkhori ,chatra,Jharkhand-825408,INDIA
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>Email: Sannutechinterio24infra@gmail.com
              </li>
              <li>
                <i className="fas fa-phone me-2"></i>Phone: 8252200480
              </li>
            </ul>
          </Col>

          {/* Social Media Links */}
          <Col lg={3} md={6} className="mb-4 mb-md-0 text-center">
            <h5 className="text-uppercase footer-text">Follow Us</h5>
            <ul className="list-inline mt-3 footer-text">
              <li className="list-inline-item">
                <a href="https://www.facebook.com/profile.php?id=61559168380340" className="text-white" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f" style={{ color: '#1877f2', fontSize: '28px' }}></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://twitter.com/sannutech" className="text-white" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter" style={{ color: '#1da1f2', fontSize: '28px' }}></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.linkedin.com/company/sannutech-interio-art-and-infra-buildcon-pvt-ltd/about/?viewAsMember=true" className="text-white" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in" style={{ color: '#0a66c2', fontSize: '28px' }}></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com/sannutech/" className="text-white" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram" style={{ color: '#e4405f', fontSize: '28px' }}></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.youtube.com/channel/UC4nY9ZS14Lj9ZGZUJBqlk5w" className="text-white" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube" style={{ color: '#ff0000', fontSize: '28px' }}></i>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div className="text-center p-3 footer-bottom">
        <p className="mb-0 footer-text">&copy; 2024 SannuTech Construction. All rights reserved.</p>
      </div>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {alert && <Alert variant="danger">{alert}</Alert>}
            <Button variant="primary" type="submit" className="d-block mx-auto mt-2" disabled={uploading}>
        {uploading ? (
          <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          'Login'
        )}
      </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </footer>
  );
};

export default Footer;