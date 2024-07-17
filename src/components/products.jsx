import React, { useRef, useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path as per your project structure
import '../Css/Products.css'; // Adjust import path as per your project structure

const Products = () => {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [subproducts, setSubproducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const fetchSubproducts = async (productId) => {
    try {
      const subproductsSnapshot = await getDocs(collection(db, `products/${productId}/subproducts`));
      const subproductsData = subproductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubproducts(prevState => ({ ...prevState, [productId]: subproductsData }));
    } catch (error) {
      console.error('Error fetching subproducts:', error);
    }
  };

  const toggleExpanded = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null); // Collapse if already expanded
    } else {
      setExpandedProductId(productId); // Expand if not expanded
      fetchSubproducts(productId); // Fetch subproducts for the expanded product
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
    <div className="products-container">
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Products</h2>
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {products.map((product, index) => (
              <Card key={index} className="product-card m-2">
                <Card.Img variant="top" src={product.imageUrl} alt={product.title} />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  {expandedProductId === product.id ? (
                      <Button
                        variant="success"
                        className="mt-2 btn-sm"
                        onClick={() => toggleExpanded(product.id)}
                      >
                        View Less &#11167;
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        className="mt-2 btn-sm"
                        onClick={() => toggleExpanded(product.id)}
                      >
                        View More &#11167;
                      </Button>
                    )}
                  {expandedProductId === product.id && (
                    <div className="mt-3">
                      {subproducts[product.id] ? (
                        subproducts[product.id].map((subproduct, subIndex) => (
                          <Card key={subIndex} className="subproduct-card">
                            <Card.Img variant="top" src={subproduct.imageUrl} alt={subproduct.title} />
                            <Card.Body>
                              <Card.Title>{subproduct.title}</Card.Title>
                              <Card.Text>{truncateText(subproduct.description, 100)}</Card.Text>
                              <div className="text-center">
                                <Link to={`/product/${product.id}/subproduct/${subproduct.id}`} className="btn btn-secondary">
                                  Click here for details
                                </Link>
                              </div>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <p>Loading subproducts...</p>
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

export default Products;