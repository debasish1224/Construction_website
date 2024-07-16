import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore instance from Firebase
import { doc, getDoc } from 'firebase/firestore';
import '../Css/DetailPage.css'; // Import your custom CSS for DetailPage styling

const DetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'product', id);
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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="my-5">
      {product && (
        <Card className="product-detail-card">
          <Card.Img variant="top" src={product.imageUrl} alt={product.title} className="product-image" />
          <Card.Body>
            <Card.Title className="text-center blog-title">{product.title}</Card.Title>
            <Row>
              <Col>
                
                <p className="blog-content">{product.description}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default DetailPage;