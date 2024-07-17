import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { db, storage } from '../firebase'; // Import Firestore and Storage from Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ServiceList from './ServiceList'; // Import ServiceList component

const UploadService = () => {
  const [serviceTitle, setserviceTitle] = useState('');
  const [serviceImage, setserviceImage] = useState(null);
  const [subserviceTitle, setSubserviceTitle] = useState('');
  const [subserviceDescription, setSubserviceDescription] = useState('');
  const [subserviceImage, setSubserviceImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState('');
  const [services, setservices] = useState([]); // State to store fetched services
  const [selectedservice, setSelectedservice] = useState(''); // State to store selected service

  // State to trigger service list update
  const [serviceListUpdated, setServiceListUpdated] = useState(false);

  // Fetch services from Firestore
  const fetchservices = async () => {
    try {
      const servicesCollection = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setservices(servicesList);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  useEffect(() => {
    fetchservices();
  }, [serviceListUpdated]); // Update services list when serviceListUpdated changes

  const handleserviceUpload = async (e) => {
    e.preventDefault();
    if (!serviceTitle || !serviceImage) {
      setAlert('service title and image are required');
      return;
    }
    try {
      setUploading(true);

      // Upload service image to Firebase Storage
      const storageRef = ref(storage, `services/${serviceImage.name}`);
      await uploadBytes(storageRef, serviceImage);
      const serviceImageUrl = await getDownloadURL(storageRef);

      // Add service details to Firestore
      const serviceRef = await addDoc(collection(db, 'services'), {
        title: serviceTitle,
        imageUrl: serviceImageUrl,
      });

      setAlert('service uploaded successfully!');
      setserviceTitle('');
      setserviceImage(null);

      // Update services list after adding a service
      fetchservices(); // Call fetchservices to update services list
    } catch (error) {
      console.error("Error adding service: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubserviceUpload = async (e) => {
    e.preventDefault();
    if (!selectedservice || !subserviceTitle || !subserviceDescription || !subserviceImage) {
      setAlert('All subservice fields and service selection are required');
      return;
    }
    try {
      setUploading(true);

      // Upload subservice image to Firebase Storage
      const storageRef = ref(storage, `subservices/${subserviceImage.name}`);
      await uploadBytes(storageRef, subserviceImage);
      const subserviceImageUrl = await getDownloadURL(storageRef);

      // Add subservice details to Firestore under the selected service
      await addDoc(collection(db, `services/${selectedservice}/subservices`), {
        title: subserviceTitle,
        description: subserviceDescription,
        imageUrl: subserviceImageUrl,
      });

      setAlert('Subservice uploaded successfully!');
      setServiceListUpdated(true); // Trigger service list update
      setSubserviceTitle('');
      setSubserviceDescription('');
      setSubserviceImage(null);
    } catch (error) {
      console.error("Error adding subservice: ", error);
      setAlert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleserviceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setserviceImage(file);
    }
  };

  const handleSubserviceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubserviceImage(file);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Admin Panel - Upload service and Subservice</h2>
      {alert && <Alert variant="danger">{alert}</Alert>}

      {/* service Upload Form */}
      <Form onSubmit={handleserviceUpload}>
        <h3>Upload service</h3>
        <Form.Group className="mb-3">
          <Form.Label>service Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter service title"
            value={serviceTitle}
            onChange={(e) => setserviceTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>service Image</Form.Label>
          <Form.Control type="file" onChange={handleserviceImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload service'
          )}
        </Button>
      </Form>

      <hr />

      {/* Subservice Upload Form */}
      <Form onSubmit={handleSubserviceUpload}>
        <h3>Add Subservice</h3>
        <Form.Group className="mb-3">
          <Form.Label>Select service</Form.Label>
          <Form.Control as="select" value={selectedservice} onChange={(e) => setSelectedservice(e.target.value)}>
            <option value="">Select a service...</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.title}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subservice Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subservice title"
            value={subserviceTitle}
            onChange={(e) => setSubserviceTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subservice Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter subservice description"
            value={subserviceDescription}
            onChange={(e) => setSubserviceDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subservice Image</Form.Label>
          <Form.Control type="file" onChange={handleSubserviceImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Upload Subservice'
          )}
        </Button>
      </Form>

      {/* Display ServiceList component below the forms */}
      <ServiceList serviceListUpdated={serviceListUpdated} setServiceListUpdated={setServiceListUpdated} />
    </Container>
  );
};

export default UploadService;