import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProductList from './ProductList'; // Import ProductList component

const UploadProduct = () => {
  const [productTitle, setProductTitle] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [subProductTitle, setSubProductTitle] = useState('');
  const [subProductDescription, setSubProductDescription] = useState('');
  const [subProductImage, setSubProductImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState('');
  const [products, setProducts] = useState([]); // State to store fetched products
  const [selectedProduct, setSelectedProduct] = useState(''); // State to store selected product

  // State to trigger product list update
  const [productListUpdated, setProductListUpdated] = useState(false);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productListUpdated]); // Update products list when productListUpdated changes

  const handleProductUpload = async (e) => {
    e.preventDefault();
    if (!productTitle || !productImage) {
      setAlert('Product title and image are required');
      return;
    }
    try {
      setUploading(true);

      // Upload product image to Firebase Storage
      const storageRef = ref(storage, `products/${productImage.name}`);
      await uploadBytes(storageRef, productImage);
      const productImageUrl = await getDownloadURL(storageRef);

      // Add product details to Firestore
      const productRef = await addDoc(collection(db, 'products'), {
        title: productTitle,
        imageUrl: productImageUrl,
      });

      setAlert('Product uploaded successfully!');
      setProductTitle('');
      setProductImage(null);

      // Update products list after adding a product
      fetchProducts(); // Call fetchProducts to update products list
    } catch (error) {
      console.error("Error adding product: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubProductUpload = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !subProductTitle || !subProductDescription || !subProductImage) {
      setAlert('All subproduct fields and product selection are required');
      return;
    }
    try {
      setUploading(true);

      // Upload subproduct image to Firebase Storage
      const storageRef = ref(storage, `subproducts/${subProductImage.name}`);
      await uploadBytes(storageRef, subProductImage);
      const subProductImageUrl = await getDownloadURL(storageRef);

      // Add subproduct details to Firestore under the selected product
      await addDoc(collection(db, `products/${selectedProduct}/subproducts`), {
        title: subProductTitle,
        description: subProductDescription,
        imageUrl: subProductImageUrl,
      });

      setAlert('Subproduct uploaded successfully!');
      setProductListUpdated(true); // Trigger product list update
      setSubProductTitle('');
      setSubProductDescription('');
      setSubProductImage(null);
    } catch (error) {
      console.error("Error adding subproduct: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleSubProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubProductImage(file);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Admin Panel - Upload Product and Subproduct</h2>
      {alert && <Alert variant="danger">{alert}</Alert>}

      {/* Product Upload Form */}
      <Form onSubmit={handleProductUpload}>
        <h3>Upload Product</h3>
        <Form.Group className="mb-3">
          <Form.Label>Product Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product title"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" onChange={handleProductImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload Product'
          )}
        </Button>
      </Form>

      <hr />

      {/* Subproduct Upload Form */}
      <Form onSubmit={handleSubProductUpload}>
        <h3>Add Subproduct</h3>
        <Form.Group className="mb-3">
          <Form.Label>Select Product</Form.Label>
          <Form.Control as="select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Select a product...</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.title}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subproduct Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subproduct title"
            value={subProductTitle}
            onChange={(e) => setSubProductTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subproduct Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter subproduct description"
            value={subProductDescription}
            onChange={(e) => setSubProductDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subproduct Image</Form.Label>
          <Form.Control type="file" onChange={handleSubProductImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload Subproduct'
          )}
        </Button>
      </Form>

      {/* Display ProductList component below the forms */}
      <ProductList productListUpdated={productListUpdated} setProductListUpdated={setProductListUpdated} />
    </Container>
  );
};

export default UploadProduct;