import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ServiceList from './ServiceList'; // Import ServiceList component

const UploadService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState('');


  // State to trigger service list update
  const [serviceListUpdated, setServiceListUpdated] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      setAlert('All fields are required');
      return;
    }
    try {
      setUploading(true);

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Add service details to Firestore
      await addDoc(collection(db, 'service'), {
        title,
        description,
        imageUrl, // Store image URL in Firestore
      });

      setAlert('Service uploaded successfully!');
      setTitle('');
      setDescription('');
      setImage(null);
      setServiceListUpdated(true); // Trigger service list update
    } catch (error) {
      console.error("Error adding document: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Upload Service</h2>
      {alert && <Alert variant="danger">{alert}</Alert>}
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter service title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter service description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload'
          )}
        </Button>
      </Form>

      {/* Display ServiceList component below the form */}
      <ServiceList serviceListUpdated={serviceListUpdated} setServiceListUpdated={setServiceListUpdated} />
    </Container>
  );
};

export default UploadService;