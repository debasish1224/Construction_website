import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Import storage from firebase
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary methods from firebase storage
import { Container, Table, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'product');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = editProduct.imageUrl;
      
      if (newImage) {
        const storageRef = ref(storage, `images/${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productDoc = doc(db, 'product', editProduct.id);
      await updateDoc(productDoc, {
        title: editProduct.title,
        description: editProduct.description,
        imageUrl
      });

      setProducts(products.map(product => product.id === editProduct.id ? { ...editProduct, imageUrl } : product));
      setShowModal(false);
      setNewImage(null);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h3>Product Details</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>
                <img src={product.imageUrl} alt={product.title} style={{ width: '100px', height: '100px' }} />
              </td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(product)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editProduct?.title || ''}
                onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editProduct?.description || ''}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
              {editProduct?.imageUrl && (
                <img src={editProduct.imageUrl} alt="Current" style={{ marginTop: '10px', width: '100px', height: '100px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;