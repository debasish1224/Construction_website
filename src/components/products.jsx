import React, { useState, useRef } from 'react';
import { Container, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/Products.css'; // Import your custom CSS for Products styling

const Products = () => {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const sliderRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
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

  const products = [
    {
      title: "AAC Block",
      text: "Lightweight and durable building blocks made from autoclaved aerated concrete, ideal for construction projects.",
      img: "images/aac_block.png",
      moreText: "Detailed description of AAC Block..."
    },
    
    {
      title: "Concrete Mix",
      text: "Premium concrete mix for various construction needs, ensuring strength and durability in every application.",
      img: "images/concrete_mix.png",
      moreText: "Detailed description of Concrete Mix..."
    },
    
    {
      title: "Insulation Panels",
      text: "Efficient insulation panels for energy-saving construction, maintaining indoor temperature and reducing energy costs.",
      img: "images/insulation_panels.png",
      moreText: "Detailed description of Insulation Panels..."
    },
    {
      title: "Roofing Tiles",
      text: "Durable and aesthetically pleasing roofing tiles, designed to protect buildings while enhancing their appearance.",
      img: "images/roofing_tiles.png",
      moreText: "Detailed description of Roofing Tiles..."
    }
  ];

  return (
    <div className="products-container">
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Products</h2>
        <div className="slider-container position-relative">
          <div className="scrolling-wrapper d-flex" ref={sliderRef}>
            {products.map((product, index) => (
              <Card key={index} className="product-card m-2" style={{ minWidth: '300px' }}>
                <Card.Img variant="top" src={product.img} alt={product.title} />
                <Card.Body>
                  <Card.Title className="text-center">{product.title}</Card.Title>
                  <Card.Text>
                    {product.text.substring(0, 100)}... {/* Adjust the number of characters to show */}
                    <div className="text-center">
                      <Button variant="link" onClick={() => handleShow(product)}>Click here to know more</Button>
                    </div>
                  </Card.Text>
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

      <Modal show={show} onHide={handleClose} centered className="custom-modal">
        <Modal.Header  className="custom-modal-header">
          <Modal.Title>{selectedProduct.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">{selectedProduct.text}</Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
