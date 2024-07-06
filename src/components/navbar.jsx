import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import '../Css/Navbar.css'; // Import your custom CSS for Navbar styling

const CustomNavbar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand as={Link} to="/">SannuTech Construction</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvas-navbar" onClick={handleShow} />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end d-none d-lg-flex">
          <Nav>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/research-development">Research</Nav.Link>
            <Nav.Link as={Link} to="/carrerPage">Career</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleClose}>About</Nav.Link>
            <Nav.Link as={Link} to="/services" onClick={handleClose}>Services</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={handleClose}>Products</Nav.Link>
            <Nav.Link as={Link} to="/research-development" onClick={handleClose}>Research</Nav.Link>
            <Nav.Link as={Link} to="/carrerPage" onClick={handleClose}>Career</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={handleClose}>Contact</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomNavbar;
