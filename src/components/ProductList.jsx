import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Import storage from firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary methods from firebase storage
import { Container, Table, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';

const ProductList = ({ productListUpdated, setProductListUpdated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

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
  }, [productListUpdated]);

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
      setAlert({ show: true, message: 'Product updated successfully!', variant: 'success' });
      setProductListUpdated(true); // Trigger product list update
    } catch (error) {
      console.error("Error updating product: ", error);
      setAlert({ show: true, message: 'Error updating product!', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'product', id));
      setProducts(products.filter(product => product.id !== id));
      setAlert({ show: true, message: 'Product deleted successfully!', variant: 'success' });
      setProductListUpdated(true); // Trigger product list update
    } catch (error) {
      console.error("Error deleting product: ", error);
      setAlert({ show: true, message: 'Error deleting product!', variant: 'danger' });
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid>
      <h3 className="text-center mb-4">Product Details</h3>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <div className="table-responsive">
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
                  <Button variant="primary" onClick={() => handleEdit(product)} className="mb-2 mr-2">Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(product.id)} className="mb-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

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