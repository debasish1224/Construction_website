import React, { useRef, useState, useEffect } from 'react';
import { Container, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from '../firebase'; // Import Firestore from Firebase
import { collection, getDocs } from 'firebase/firestore';
import '../Css/Services.css'; // Import your custom CSS for Services styling

const Services = () => {
  const sliderRef = useRef(null);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, "service"));
    const servicesArray = querySnapshot.docs.map(doc => doc.data());
    setServices(servicesArray);
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
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
                <Card.Img variant="top" src={service.imageUrl} alt={service.title} />
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{truncateText(service.description, 100)}</Card.Text>
                  <div className="text-center">
                    <Button variant="link" onClick={() => handleCardClick(service)}>Click here to know more</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          <Button className="slide-arrow prev position-absolute" onClick={scrollLeft}>
            <i className="fas fa-chevron-left"></i>
          </Button>
          <Button className="slide-arrow next position-absolute" onClick={scrollRight}>
            <i className="fas fa-chevron-right"></i>
          </Button>
        </div>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title>{selectedService?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedService?.description}</p>
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