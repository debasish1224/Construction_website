import React from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Home.css'; // Import your custom CSS for Home styling
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

const Home = () => {
  const images = [
    '/images/construction_company_homepage.png',
    '/images/construction_homepage_1.png',
    '/images/construction_homepage_2.png'
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <Carousel interval={2000} controls={false} indicators={false} fade>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <div
                className="carousel-image"
                style={{
                  backgroundImage: `url(${image})`
                }}
              >
                <div className="carousel-caption">
                  <h1>Welcome to Sannutech Interior-Art & Infra-Buildcon Pvt.Ltd</h1>
                  <p>Your trusted partner in building your dreams.</p>
                  <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section text-center py-5">
        <Container>
          <Row>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-item">
                    <h2><CountUp end={200} duration={4} />+</h2>
                    <p>Design Projects</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-item">
                    <h2><CountUp end={300} duration={4} />+</h2>
                    <p>Completed Constructions</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-item">
                    <h2><CountUp end={450} duration={4} />+</h2>
                    <p>Satisfied Clients</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-item">
                    <h2><CountUp end={100} duration={4} />+</h2>
                    <p>Qualified Professionals</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
