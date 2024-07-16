import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path as per your file structure
import '../Css/Products.css'; // Adjust the import path as per your file structure

const Products = () => {
  const [products, setProducts] = useState([]);
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

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error state here, e.g., setProducts([]) and display an error message
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Products</h2>
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {products.map((product) => (
              <Card key={product.id} className="product-card m-2">
                <Card.Img variant="top" src={product.imageUrl} alt={product.title} />
                <Card.Body>
                  <Card.Title className="text-center">{product.title}</Card.Title>
                  <Card.Text>{product.description.substring(0, 100)}...</Card.Text>
                  <div className="text-center mt-3">
                    <Link to={`/product/${product.id}`} className="btn btn-primary">
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

export default Products;