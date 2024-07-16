import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore instance from Firebase
import { doc, getDoc } from 'firebase/firestore';
import '../Css/DetailPage.css'; // Import your custom CSS for DetailPage styling

const DetailPage2 = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const docRef = doc(db, 'service', id); // Adjust 'service' to your Firestore collection name for services
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setService(docSnap.data());
        } else {
          console.log('No such document!');
          setError('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Error fetching service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="my-5">
      {service && (
        <Card className="service-detail-card">
          <Card.Img variant="top" src={service.imageUrl} alt={service.title} className="service-image" />
          <Card.Body>
            <Card.Title className="text-center service-title">{service.title}</Card.Title>
            <Row>
              <Col>
                <p className="blog-content">{service.description}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default DetailPage2;