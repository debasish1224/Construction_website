import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/Footer.css'; // Import your custom CSS for Footer styling

const Footer = () => {
  return (
    <footer className="footer-container text-center text-lg-start text-white">
      <Container className="p-4">
        {/* Grid container for footer content */}
        <Row>
          {/* Company Logo and Name */}
          <Col lg={3} md={6} className="mb-4 mb-md-0 text-lg-start text-md-center">
            <div className="logo">
              <img src="favicon.ico" alt="Company Logo" height={50} />
            </div>
            <p className="text-uppercase mt-3 footer-text">SannuTech Construction</p>
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
    </footer>
  );
};

export default Footer;
