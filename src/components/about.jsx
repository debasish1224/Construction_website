import React, { useRef, useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../firebase'; // Import Firebase firestore
import '../Css/About.css'; // Import your custom CSS for About styling
import { collection, getDocs } from 'firebase/firestore';

const About = () => {
  const sliderRef = useRef(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const aboutImageRef = collection(db, 'aboutImage');
        const snapshot = await getDocs(aboutImageRef);

        console.log('Snapshot:', snapshot); // Check the snapshot object in the console

        const imagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Images Data:', imagesData); // Check the mapped images data

        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images from Firestore:', error);
      }
    };

    fetchImages();
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
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {/* Card Items */}
            {images.map((image, index) => (
              <Card key={index} className="about-card m-2" style={{ minWidth: '300px' }}>
                <Card.Img variant="top" src={image.imageUrl} alt={image.title} />
                <Card.Body>
                  <Card.Text className="text-center font-weight-bold">{image.title}</Card.Text>
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