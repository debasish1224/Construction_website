import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductList = ({ productListUpdated, setProductListUpdated }) => {
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editSubProduct, setEditSubProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newSubImage, setNewSubImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        setError("Error fetching products: " + error.message);
        setLoading(false);
      }
    };
  
    const fetchSubProducts = async () => {
      try {
        const subProductsMap = {};
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        for (const doc of productsSnapshot.docs) {
          const productId = doc.id;
          const subProductsCollection = collection(db, `products/${productId}/subproducts`);
          const subProductsSnapshot = await getDocs(subProductsCollection);
          subProductsMap[productId] = subProductsSnapshot.docs.map(subdoc => ({
            id: subdoc.id,
            ...subdoc.data()
          }));
        }
        
        setSubProducts(subProductsMap);
      } catch (error) {
        setError("Error fetching subproducts: " + error.message);
      }
    };
  
    fetchProducts();
    fetchSubProducts();
  }, [productListUpdated]);
  
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleSubEdit = (subProduct, productId) => {
    setEditSubProduct({ ...subProduct, productId });
    setShowSubModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSubImage(file);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = editProduct.imageUrl;

      if (newImage) {
        const storageRef = ref(storage, `products/${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productDoc = doc(db, 'products', editProduct.id);
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

  const handleSubSave = async () => {
    try {
      let subImageUrl = editSubProduct.imageUrl;

      if (newSubImage) {
        const storageRef = ref(storage, `products/${editSubProduct.productId}/subproducts/${newSubImage.name}`);
        await uploadBytes(storageRef, newSubImage);
        subImageUrl = await getDownloadURL(storageRef);
      }

      const subProductDoc = doc(db, `products/${editSubProduct.productId}/subproducts`, editSubProduct.id);
      await updateDoc(subProductDoc, {
        title: editSubProduct.title,
        description: editSubProduct.description,
        imageUrl: subImageUrl
      });

      const updatedSubProducts = {
        ...subProducts,
        [editSubProduct.productId]: subProducts[editSubProduct.productId].map(subProduct =>
          subProduct.id === editSubProduct.id ? { ...editSubProduct, imageUrl: subImageUrl } : subProduct
        )
      };

      setSubProducts(updatedSubProducts);
      setShowSubModal(false);
      setNewSubImage(null);
      setAlert({ show: true, message: 'Subproduct updated successfully!', variant: 'success' });
      setProductListUpdated(true); // Trigger product list update
    } catch (error) {
      console.error("Error updating subproduct: ", error);
      setAlert({ show: true, message: 'Error updating subproduct!', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(product => product.id !== id));
      setAlert({ show: true, message: 'Product deleted successfully!', variant: 'success' });
      setProductListUpdated(true); // Trigger product list update
    } catch (error) {
      console.error("Error deleting product: ", error);
      setAlert({ show: true, message: 'Error deleting product!', variant: 'danger' });
    }
  };

  const handleSubDelete = async (productId, subProductId) => {
    try {
      await deleteDoc(doc(db, `products/${productId}/subproducts`, subProductId));
      const updatedSubProducts = {
        ...subProducts,
        [productId]: subProducts[productId].filter(subProduct => subProduct.id !== subProductId)
      };
      setSubProducts(updatedSubProducts);
      setAlert({ show: true, message: 'Subproduct deleted successfully!', variant: 'success' });
      setProductListUpdated(true); // Trigger product list update
    } catch (error) {
      console.error("Error deleting subproduct: ", error);
      setAlert({ show: true, message: 'Error deleting subproduct!', variant: 'danger' });
    }
  };

  const handleAlertClose = () => {
    setAlert({ show: false, message: '', variant: '' });
  };

  if (loading) {
    return <Spinner animation="border" className="mt-5" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">Product Details</h3>
      {alert.show && <Alert variant={alert.variant} onClose={handleAlertClose} dismissible className="mt-3">
        {alert.message}
      </Alert>}
      <div className="table-responsive">
        <Table striped bordered hover responsive>
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
              <React.Fragment key={product.id}>
                <tr>
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
                {subProducts[product.id] && subProducts[product.id].map(subProduct => (
                  <tr key={subProduct.id}>
                    <td style={{ paddingLeft: '40px' }}>{subProduct.title}</td>
                    <td>{`${subProduct.description.substring(0, 40)}${subProduct.description.length > 40 ? "..." : ""}`}</td>
                    <td>
                      <img src={subProduct.imageUrl} alt={subProduct.title} style={{ width: '100px', height: '100px' }} />
                    </td>
                    <td>
                      <Button variant="primary" onClick={() => handleSubEdit(subProduct, product.id)} className="mb-2 mr-2">Edit</Button>
                      <Button variant="danger" onClick={() => handleSubDelete(product.id, subProduct.id)} className="mb-2">Delete</Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
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

      <Modal show={showSubModal} onHide={() => setShowSubModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subproduct</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editSubProduct?.title || ''}
                onChange={(e) => setEditSubProduct({ ...editSubProduct, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editSubProduct?.description || ''}
                onChange={(e) => setEditSubProduct({ ...editSubProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleSubImageChange}
              />
              {editSubProduct?.imageUrl && (
                <img src={editSubProduct.imageUrl} alt="Current" style={{ marginTop: '10px', width: '100px', height: '100px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;