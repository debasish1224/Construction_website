import React, { useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/About.css'; // Import your custom CSS for About styling

const About = () => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 430; // Adjust scroll distance as needed
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 430; // Adjust scroll distance as needed
    }
  };

  return (
    <div className="about-container">
      {/* About Us Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">About Us</h2>
        <Row>
          <Col>
            <p>
              Welcome to our construction company! With over 20 years of experience in
              the industry, we pride ourselves on delivering high-quality construction
              services tailored to meet the unique needs of our clients. Our team of
              dedicated professionals is committed to excellence, safety, and
              innovation, ensuring that every project is completed on time and within
              budget.
            </p>
            <p>
              We specialize in residential and commercial construction, renovations,
              and construction site management. Our approach combines traditional
              craftsmanship with modern technology to create sustainable and
              aesthetically pleasing structures. We believe in building lasting
              relationships with our clients, based on trust, transparency, and mutual
              respect.
            </p>
            <p>
              Our mission is to transform your vision into reality. From the initial
              planning stages to the final touches, we work closely with you to ensure
              that every detail meets your expectations. Thank you for considering us
              for your construction needs. We look forward to working with you and
              turning your dreams into concrete achievements.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Horizontal Slider Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Key Features</h2>
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {/* Card Items */}
            {[
              {
                title: "Comprehensive Service Spectrum",
                text: "From design to execution, we provide a full range of construction services to meet all your needs.",
                img: "images/comprehensive_service_spectrum.png"
              },
              {
                title: "Unmatched Expertise",
                text: "Our team consists of highly skilled professionals with extensive industry experience.",
                img: "images/unmatched_expertise.png"
              },
              {
                title: "Quality Assurance",
                text: "We adhere to the highest standards of quality and safety in every project we undertake.",
                img: "images/quality_assurance.png"
              },
              {
                title: "Customized Solutions",
                text: "Our services are tailored to meet the unique requirements of each client.",
                img: "images/customized_solution.png"
              },
              {
                title: "Sustainable Practices",
                text: "We incorporate eco-friendly practices in our construction processes.",
                img: "images/sustainable_practice.png"
              },
              {
                title: "Reliability and Trust",
                text: "We are committed to building long-lasting relationships based on reliability and trust.",
                img: "images/relaiability_and_trust.png"
              }
            ].map((feature, index) => (
              <Card key={index} className="about-card m-2" style={{ minWidth: '300px' }}>
                <Card.Img variant="top" src={feature.img} alt={feature.title} />
                <Card.Body>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
          {/* Arrow Buttons */}
          <Button className="slide-arrow prev position-absolute" onClick={scrollLeft}>
            <i className="fas fa-chevron-left"></i>
          </Button>
          <Button className="slide-arrow next position-absolute" onClick={scrollRight}>
            <i className="fas fa-chevron-right"></i>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default About;
