import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/Services.css'; // Import your custom CSS for Services styling

const Services = () => {
  const sliderRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

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

  const services = [
    {
      title: "Infrastructure",
      text: "We specialize in developing robust infrastructure that stands the test of time. Our projects include bridges, highways, and utilities that are essential for modern living. Using cutting-edge technology and materials, we ensure that our infrastructure projects are both durable and sustainable.",
      img: "images/infrastructure.png"
    },
    {
      title: "Construction",
      text: "From residential buildings to commercial complexes, our construction services cover a wide range of projects. We handle every aspect of the construction process, from initial design and planning to final execution. Our team ensures that every project is completed to the highest standards, on time, and within budget.",
      img: "images/construction.png"
    },
    {
      title: "Exterior Design",
      text: "Our exterior design services enhance the curb appeal and functionality of any property. We create outdoor spaces that are not only visually stunning but also practical and sustainable. From landscaping to hardscaping, we design exteriors that perfectly complement the architecture and environment.",
      img: "images/exterior.png"
    },
    {
      title: "Interior Design",
      text: "Our interior design services transform spaces into beautiful, functional areas tailored to your lifestyle and needs. We work with you to create a cohesive design that reflects your personality and enhances your comfort. Our services include space planning, color selection, furniture placement, and more.",
      img: "images/interior.png"
    },
    {
      title: "Planting & Gardening",
      text: "We bring your outdoor spaces to life with our planting and gardening services. Whether you want a lush garden, a vegetable patch, or a serene landscape, our experts will help you choose the right plants and design a layout that thrives. We also offer maintenance services to keep your garden looking its best year-round.",
      img: "images/planting.png"
    },
    {
      title: "Park Design",
      text: "Our park design services focus on creating recreational areas that are both beautiful and functional. We design parks that cater to various activities and age groups, providing spaces for play, relaxation, and community events. Our designs incorporate natural elements, sustainable practices, and innovative features to create parks that everyone can enjoy.",
      img: "images/park.png"
    },
    {
      title: "Pool Landscaping",
      text: "We create stunning poolside landscapes that transform your backyard into a private oasis. Our services include the design and installation of plants, lighting, and hardscape elements that enhance the beauty and functionality of your pool area. Whether you prefer a tropical paradise or a minimalist retreat, we can design a landscape that meets your vision.",
      img: "images/pool.png"
    }
  ];

  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="services-container">
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Services</h2>
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {services.map((service, index) => (
              <Card key={index} className="service-card m-2" style={{ minWidth: '300px' }}>
                <Card.Img variant="top" src={service.img} alt={service.title} />
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{truncateText(service.text, 100)}</Card.Text>
                  {/* Clickable link to open modal */}
                  <div className="text-center">
                      <Button variant="link" onClick={() => handleCardClick(service)}>Click here to know more</Button>
                    </div>
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

      {/* Modal for Service Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered >
        <Modal.Header >
          <Modal.Title>{selectedService?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedService?.text}</p>
          {/* Add additional details or images if needed */}
          
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'center' }}>
  <Button variant="secondary" onClick={handleCloseModal}>
    Close
  </Button>
</Modal.Footer>

      </Modal>
    </div>
  );
};

export default Services;
