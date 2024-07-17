import React, { useRef, useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path as per your project structure
import '../Css/Services.css'; // Adjust import path as per your project structure

const Services = () => {
  const sliderRef = useRef(null);
  const [services, setServices] = useState([]);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [subservices, setSubservices] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesArray);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Handle error state here if needed
      }
    };

    fetchServices();
  }, []);

  const fetchSubservices = async (serviceId) => {
    try {
      const subservicesSnapshot = await getDocs(collection(db, `services/${serviceId}/subservices`));
      const subservicesData = subservicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubservices(prevState => ({ ...prevState, [serviceId]: subservicesData }));
    } catch (error) {
      console.error('Error fetching subservices:', error);
      // Handle error state here if needed
    }
  };

  const toggleExpanded = (serviceId) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null); // Collapse if already expanded
    } else {
      setExpandedServiceId(serviceId); // Expand if not expanded
      fetchSubservices(serviceId); // Fetch subservices for the expanded service
    }
  };

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
                    {expandedServiceId === service.id ? (
                      <Button
                        variant="success"
                        className="mt-2 btn-sm"
                        onClick={() => toggleExpanded(service.id)}
                      >
                        View Less &#11167;
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        className="mt-2 btn-sm"
                        onClick={() => toggleExpanded(service.id)}
                      >
                        View More &#11167;
                      </Button>
                    )}
                  {expandedServiceId === service.id && (
                    <div className="mt-3">
                      {subservices[service.id] ? (
                        subservices[service.id].map((subservice, subIndex) => (
                          <Card key={subIndex} className="subservice-card">
                            <Card.Img variant="top" src={subservice.imageUrl} alt={subservice.title} />
                            <Card.Body>
                              <Card.Title>{subservice.title}</Card.Title>
                              <Card.Text>{truncateText(subservice.description, 100)}</Card.Text>
                              <div className="text-center">
                                <Link to={`/service/${service.id}/subservice/${subservice.id}`} className="btn btn-secondary">
                                  Click here for details
                                </Link>
                              </div>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <p>Loading subservices...</p>
                      )}
                    </div>
                  )}
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