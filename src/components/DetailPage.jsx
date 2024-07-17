import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore instance from Firebase
import { doc, getDoc } from 'firebase/firestore';
import '../Css/DetailPage.css'; // Import your custom CSS for DetailPage styling

const DetailPage = () => {
  const { id, subid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, `products/${id}/subproducts/${subid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log('No such document!');
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, subid]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {product && (
        <Card className="product-detail-card shadow-lg">
          <Row noGutters>
            <Col md={6}>
              <Card.Img variant="top" src={product.imageUrl} alt={product.title} className="product-image mt-4 ml-2" />
            </Col>
            <Col md={6}>
              <Card.Body>
                <Card.Title className="text-center blog-title">{product.title}</Card.Title>
                <p className="blog-content">{product.description}</p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}
    </Container>
  );
};

export default DetailPage;