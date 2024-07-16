import React, { useRef, useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path as per your project structure
import '../Css/Services.css'; // Adjust import path as per your project structure

const Services = () => {
  const sliderRef = useRef(null);
  const [services, setServices] = useState([]);

  // Fetch services from Firestore
  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'service'));
      const servicesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesArray);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Handle error state here if needed
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Scroll functions for slider
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

  // Function to truncate text
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
              <Card key={index} className="service-card m-2">
                <Card.Img variant="top" src={service.imageUrl} alt={service.title} />
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{truncateText(service.description, 100)}</Card.Text>
                  <div className="text-center">
                    <Link to={`/service/${service.id}`} className="btn btn-primary">
                      Click here to know more
                    </Link>
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
    </div>
  );
};

export default Services;